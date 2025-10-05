import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Get all products with optional filtering
  async findAll(published?: boolean, limit = 50, offset = 0): Promise<Product[]> {
    const where = published !== undefined ? { published } : {};
    
    return this.prisma.product.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' }
        },
        catalogs: true,
      },
    });
  }

  // Get published products (public endpoint)
  async findPublished(limit = 20): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { published: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' }
        },
      },
    });
  }

  // Get product by ID
  async findOne(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' }
        },
        catalogs: true,
      },
    });
  }

  // Get product by slug (public endpoint)
  async findBySlug(slug: string): Promise<Product | null> {
    return this.prisma.product.findFirst({
      where: { slug, published: true },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
        catalogs: true,
      },
    });
  }

  // Get product by SKU
  async findBySku(sku: string): Promise<Product | null> {
    return this.prisma.product.findFirst({
      where: { sku },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
        catalogs: true,
      },
    });
  }

  // Create new product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: createProductDto,
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' }
        },
        catalogs: true,
      },
    });
  }

  // Update product
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    // Check if product exists
    const existingProduct = await this.findOne(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' }
        },
        catalogs: true,
      },
    });
  }

  // Delete product
  async remove(id: string): Promise<Product> {
    // Check if product exists
    const existingProduct = await this.findOne(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.prisma.product.delete({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' }
        },
        catalogs: true,
      },
    });
  }

  // Get products by category
  async findByCategory(categoryId: string, limit = 20, offset = 0): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { categoryId, published: true },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
      },
    });
  }

  // Search products
  async search(query: string, limit = 20, offset = 0): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        published: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { shortDesc: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } },
        ],
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
      },
    });
  }
  
}
