import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '../generated/client';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private prisma: PrismaService) {}

  // Create a new category
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const created = await this.prisma.category.create({
      data: createCategoryDto,
    });
    this.logger.log(`Created category id=${created.id} name="${created.name}"`);
    return created;
  }

  // Get all categories
  async findAll(): Promise<Category[]> {
    const list = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    this.logger.log(`Fetched ${list.length} categories`);
    return list;
  }

  // Get categories in tree structure
  async findTree(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      include: {
        children: {
          include: {
            children: true,
          },
        },
        parent: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Filter to only root categories (no parent)
    const roots = categories.filter((category) => !category.parentId);
    this.logger.log(
      `Fetched category tree: roots=${roots.length}, total=${categories.length}`,
    );
    return roots;
  }

  // Get a single category by ID
  async findOne(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: {
          where: { published: true },
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      this.logger.warn(`Category not found by id=${id}`);
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  // Get a category by slug
  async findBySlug(slug: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
        products: {
          where: { published: true },
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      this.logger.warn(`Category not found by slug=${slug}`);
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return category;
  }

  // Update a category
  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    // Check if category exists
    await this.findOne(id);

    const updated = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
    this.logger.log(`Updated category id=${updated.id}`);
    return updated;
  }

  // Delete a category
  async remove(id: string): Promise<Category> {
    // Check if category exists
    await this.findOne(id);

    // Check if category has children
    const children = await this.prisma.category.findMany({
      where: { parentId: id },
    });

    if (children.length > 0) {
      this.logger.warn(
        `Blocked deletion for id=${id}: has ${children.length} child categories`,
      );
      throw new Error(
        'Cannot delete category with children. Please delete or move children first.',
      );
    }

    // Check if category has products
    const products = await this.prisma.product.findMany({
      where: { categoryId: id },
    });

    if (products.length > 0) {
      this.logger.warn(
        `Blocked deletion for id=${id}: has ${products.length} products`,
      );
      throw new Error(
        'Cannot delete category with products. Please move or delete products first.',
      );
    }

    const deleted = await this.prisma.category.delete({
      where: { id },
    });
    this.logger.log(`Deleted category id=${id}`);
    return deleted;
  }

  // Get categories with product counts
  async findWithProductCounts(): Promise<Category[]> {
    const list = await this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: { published: true },
            },
          },
        },
        parent: true,
      },
      orderBy: { name: 'asc' },
    });
    this.logger.log(`Fetched ${list.length} categories with product counts`);
    return list;
  }
}
