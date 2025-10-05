import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { BlogPost, PostStatus } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  // Get all blog posts with optional filtering
  async findAll(status?: PostStatus, limit = 10, offset = 0): Promise<BlogPost[]> {
    const where = status ? { status } : {};
    
    return this.prisma.blogPost.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: { 
        author: true, 
        images: true, 
        tags: { include: { tag: true } } 
      },
    });
  }

  // Get published blog posts (public endpoint)
  async list(limit = 10): Promise<BlogPost[]> {
    return this.prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: { author: true },
    });
  }

  // Get blog post by ID
  async findOne(id: string): Promise<BlogPost | null> {
    return this.prisma.blogPost.findUnique({
      where: { id },
      include: { 
        author: true, 
        images: true, 
        tags: { include: { tag: true } } 
      },
    });
  }

  // Get blog post by slug (public endpoint)
  async findBySlug(slug: string): Promise<BlogPost | null> {
    return this.prisma.blogPost.findUnique({
      where: { slug },
      include: { author: true, images: true, tags: { include: { tag: true } } },
    });
  }

  // Create new blog post
  async create(createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
    const { tagIds, ...postData } = createBlogPostDto;
    
    const blogPost = await this.prisma.blogPost.create({
      data: {
        ...postData,
        publishedAt: postData.publishedAt ? new Date(postData.publishedAt) : null,
        tags: tagIds ? {
          create: tagIds.map(tagId => ({
            tag: { connect: { id: tagId } }
          }))
        } : undefined,
      },
      include: { 
        author: true, 
        images: true, 
        tags: { include: { tag: true } } 
      },
    });

    return blogPost;
  }

  // Update blog post
  async update(id: string, updateBlogPostDto: UpdateBlogPostDto): Promise<BlogPost> {
    const { tagIds, ...postData } = updateBlogPostDto;
    
    // Check if blog post exists
    const existingPost = await this.findOne(id);
    if (!existingPost) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    const blogPost = await this.prisma.blogPost.update({
      where: { id },
      data: {
        ...postData,
        publishedAt: postData.publishedAt ? new Date(postData.publishedAt) : undefined,
        tags: tagIds ? {
          deleteMany: {},
          create: tagIds.map(tagId => ({
            tag: { connect: { id: tagId } }
          }))
        } : undefined,
      },
      include: { 
        author: true, 
        images: true, 
        tags: { include: { tag: true } } 
      },
    });

    return blogPost;
  }

  // Delete blog post
  async remove(id: string): Promise<BlogPost> {
    // Check if blog post exists
    const existingPost = await this.findOne(id);
    if (!existingPost) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    return this.prisma.blogPost.delete({
      where: { id },
      include: { 
        author: true, 
        images: true, 
        tags: { include: { tag: true } } 
      },
    });
  }

  // Get featured blog posts
  async getFeatured(limit = 5): Promise<BlogPost[]> {
    return this.prisma.blogPost.findMany({
      where: { 
        featured: true,
        status: 'PUBLISHED' 
      },
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: { author: true },
    });
  }

  // Get blog posts by author
  async findByAuthor(authorId: string, limit = 10): Promise<BlogPost[]> {
    return this.prisma.blogPost.findMany({
      where: { authorId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  }
}
