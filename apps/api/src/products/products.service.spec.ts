import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from './products.service';

type PrismaMock = {
  product: {
    findMany: jest.Mock;
    count: jest.Mock;
  };
};

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaMock;

  beforeEach(async () => {
    prisma = {
      product: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ProductsService);
  });

  describe('findPublished', () => {
    it('applies both limit and offset to the public product list', async () => {
      prisma.product.findMany.mockResolvedValue([]);

      await service.findPublished(12, 24);

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { published: true },
        take: 12,
        skip: 24,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          images: { orderBy: { order: 'asc' } },
        },
      });
    });
  });

  describe('findByCategory', () => {
    it('returns a page of published products with a total count', async () => {
      const items = [{ id: 'product-1' }, { id: 'product-2' }];
      prisma.product.findMany.mockResolvedValue(items);
      prisma.product.count.mockResolvedValue(7);

      const result = await service.findByCategory('category-1', 2, 4);

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { categoryId: 'category-1', published: true },
        take: 2,
        skip: 4,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          images: { orderBy: { order: 'asc' } },
        },
      });
      expect(prisma.product.count).toHaveBeenCalledWith({
        where: { categoryId: 'category-1', published: true },
      });
      expect(result).toEqual({ items, total: 7, limit: 2, offset: 4 });
    });
  });
});
