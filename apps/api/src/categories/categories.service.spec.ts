import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '../generated/client';

type PrismaMock = {
  category: {
    count: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  product: {
    count: jest.Mock;
  };
};

function createPrismaMock(): PrismaMock {
  return {
    category: {
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    product: {
      count: jest.fn(),
    },
  };
}

// Only truthiness/shape matters here -- findOne()'s null-check is what's under
// test, not the rich `include` payload it would receive from a real Prisma call.
const existingCategory: Category = {
  id: 'cat-1',
  name: 'Existing',
  slug: 'existing',
  description: null,
  image: null,
  parentId: null,
};

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: PrismaMock;

  beforeEach(async () => {
    prisma = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  describe('remove', () => {
    const id = 'cat-1';

    it('throws ConflictException when the category has children, and never deletes', async () => {
      prisma.category.findUnique.mockResolvedValue(existingCategory);
      prisma.category.count.mockResolvedValue(2);

      await expect(service.remove(id)).rejects.toThrow(ConflictException);

      expect(prisma.category.count).toHaveBeenCalledWith({
        where: { parentId: id },
      });
      expect(prisma.category.delete).not.toHaveBeenCalled();
    });

    it('throws ConflictException when children count is 0 but products exist, and never deletes', async () => {
      prisma.category.findUnique.mockResolvedValue(existingCategory);
      prisma.category.count.mockResolvedValue(0);
      prisma.product.count.mockResolvedValue(3);

      await expect(service.remove(id)).rejects.toThrow(ConflictException);

      expect(prisma.product.count).toHaveBeenCalledWith({
        where: { categoryId: id },
      });
      expect(prisma.category.delete).not.toHaveBeenCalled();
    });

    it('deletes the category when it has no children and no products', async () => {
      prisma.category.findUnique.mockResolvedValue(existingCategory);
      prisma.category.count.mockResolvedValue(0);
      prisma.product.count.mockResolvedValue(0);
      prisma.category.delete.mockResolvedValue(existingCategory);

      const result = await service.remove(id);

      expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id } });
      expect(result).toBe(existingCategory);
    });

    it('throws NotFoundException when the category does not exist, and never checks counts or deletes', async () => {
      prisma.category.findUnique.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);

      expect(prisma.category.count).not.toHaveBeenCalled();
      expect(prisma.product.count).not.toHaveBeenCalled();
      expect(prisma.category.delete).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const id = 'cat-1';

    it('throws BadRequestException when parentId equals id, and never updates', async () => {
      prisma.category.findUnique.mockResolvedValue(existingCategory);

      await expect(service.update(id, { parentId: id })).rejects.toThrow(
        BadRequestException,
      );

      expect(prisma.category.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.category.update).not.toHaveBeenCalled();
    });

    it('throws BadRequestException when the proposed parent is a descendant of id via a 2-hop ancestor walk', async () => {
      const proposedParentId = 'cat-2';
      const middleId = 'cat-3';

      prisma.category.findUnique
        .mockResolvedValueOnce(existingCategory) // findOne(id)
        .mockResolvedValueOnce({ parentId: middleId }) // walk: parent of proposedParentId
        .mockResolvedValueOnce({ parentId: id }); // walk: parent of middleId -> equals id

      await expect(
        service.update(id, { parentId: proposedParentId }),
      ).rejects.toThrow(BadRequestException);

      expect(prisma.category.findUnique).toHaveBeenCalledTimes(3);
      expect(prisma.category.update).not.toHaveBeenCalled();
    });

    it('updates without running cycle-check logic when parentId is omitted', async () => {
      const dto = { name: 'Renamed' };
      const updated = { ...existingCategory, name: 'Renamed' };

      prisma.category.findUnique.mockResolvedValue(existingCategory);
      prisma.category.update.mockResolvedValue(updated);

      const result = await service.update(id, dto);

      expect(prisma.category.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id },
        data: dto,
      });
      expect(result).toBe(updated);
    });

    it('updates when parentId is provided and is neither id nor an ancestor (walk terminates at null)', async () => {
      const proposedParentId = 'cat-2';
      const dto = { parentId: proposedParentId };
      const updated = { ...existingCategory, parentId: proposedParentId };

      prisma.category.findUnique
        .mockResolvedValueOnce(existingCategory) // findOne(id)
        .mockResolvedValueOnce({ parentId: null }); // walk: proposedParentId has no parent
      prisma.category.update.mockResolvedValue(updated);

      const result = await service.update(id, dto);

      expect(prisma.category.findUnique).toHaveBeenCalledTimes(2);
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id },
        data: dto,
      });
      expect(result).toBe(updated);
    });
  });
});
