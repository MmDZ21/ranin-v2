import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AdvancedSearchDto } from './dto/advanced-search.dto';
import { Product } from '../generated/client';

export type PaginatedProducts = {
  items: Product[];
  total: number;
  limit: number;
  offset: number;
};

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Get all products with optional filtering
  async findAll(
    published?: boolean,
    limit = 50,
    offset = 0,
  ): Promise<Product[]> {
    const where = published !== undefined ? { published } : {};

    return this.prisma.product.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
        catalogs: true,
      },
    });
  }

  // Get published products (public endpoint)
  async findPublished(limit = 20, offset = 0): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { published: true },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  // Get product by ID
  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
        catalogs: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  // Get product by slug (public endpoint)
  async findBySlug(slug: string): Promise<Product> {
    const product = await this.prisma.product.findFirst({
      where: { slug, published: true },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
        catalogs: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return product;
  }

  // Get product by SKU
  async findBySku(sku: string): Promise<Product> {
    const product = await this.prisma.product.findFirst({
      where: { sku },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
        catalogs: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with SKU ${sku} not found`);
    }

    return product;
  }

  // Create new product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { image, ...productData } = createProductDto;

    const data: any = { ...productData };

    if (image) {
      data.images = {
        create: {
          url: image,
          alt: productData.name,
          order: 0,
        },
      };
    }

    return this.prisma.product.create({
      data,
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
        catalogs: true,
      },
    });
  }

  // Update product
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    // Check if product exists (throws NotFoundException if not)
    const existingProduct = await this.findOne(id);

    const { image, ...productData } = updateProductDto;
    const data: any = { ...productData };

    if (image !== undefined) {
      if (image) {
        data.images = {
          deleteMany: {},
          create: {
            url: image,
            alt: productData.name || existingProduct.name,
            order: 0,
          },
        };
      } else {
        data.images = {
          deleteMany: {},
        };
      }
    }

    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
        catalogs: true,
      },
    });
  }

  // Delete product
  async remove(id: string): Promise<Product> {
    // Check if product exists (throws NotFoundException if not)
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
        catalogs: true,
      },
    });
  }

  // Get products by category
  async findByCategory(
    categoryId: string,
    limit = 20,
    offset = 0,
  ): Promise<PaginatedProducts> {
    const where = { categoryId, published: true };
    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          images: { orderBy: { order: 'asc' } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total, limit, offset };
  }

  // Search products - searches across all relevant fields
  async search(query: string, limit = 20, offset = 0): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        published: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
          { shortDesc: { contains: query, mode: 'insensitive' } },
          { longDesc: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
          { modelNumber: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } },
          {
            category: {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { slug: { contains: query, mode: 'insensitive' } },
              ],
            },
          },
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

  // Advanced search with specific filters
  async advancedSearch(filters: AdvancedSearchDto): Promise<Product[]> {
    const { name, sku, brand, category, limit = 20, offset = 0 } = filters;

    const where: {
      published: boolean;
      name?: { contains: string; mode: 'insensitive' };
      sku?: { contains: string; mode: 'insensitive' };
      brand?: { contains: string; mode: 'insensitive' };
      category?: {
        OR: Array<{
          name?: { contains: string; mode: 'insensitive' };
          slug?: { contains: string; mode: 'insensitive' };
        }>;
      };
    } = {
      published: true,
    };

    // Build dynamic where conditions
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }

    if (sku) {
      where.sku = { contains: sku, mode: 'insensitive' };
    }

    if (brand) {
      where.brand = { contains: brand, mode: 'insensitive' };
    }

    if (category) {
      where.category = {
        OR: [
          { name: { contains: category, mode: 'insensitive' } },
          { slug: { contains: category, mode: 'insensitive' } },
        ],
      };
    }

    return this.prisma.product.findMany({
      where,
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
