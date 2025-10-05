import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Query, 
  Body,
  HttpCode,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { PostStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  // Public endpoints (for frontend)
  
  @Get()
  async list(@Query('limit') limit?: string) {
    return this.blogService.list(Number(limit) || 10);
  }

  @Get('featured')
  async getFeatured(@Query('limit') limit?: string) {
    return this.blogService.getFeatured(Number(limit) || 5);
  }

  @Get('author/:authorId')
  async getByAuthor(
    @Param('authorId') authorId: string,
    @Query('limit') limit?: string
  ) {
    return this.blogService.findByAuthor(authorId, Number(limit) || 10);
  }

  @Get(':slug')
  async detail(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  // Admin endpoints (for content management)
  
  @Get('admin/all')
  async findAll(
    @Query('status') status?: PostStatus,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    return this.blogService.findAll(
      status, 
      Number(limit) || 10, 
      Number(offset) || 0
    );
  }

  @Get('admin/:id')
  async findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogService.create(createBlogPostDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateBlogPostDto: UpdateBlogPostDto
  ) {
    return this.blogService.update(id, updateBlogPostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
