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
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/enums';
import { PostStatus } from '../generated/enums';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  // Public endpoints (published content only — enforced in the service)

  @Get()
  async list(@Query() pagination: PaginationDto) {
    return this.blogService.list(pagination.limit ?? 20);
  }

  @Get('featured')
  async getFeatured(@Query() pagination: PaginationDto) {
    return this.blogService.getFeatured(pagination.limit ?? 20);
  }

  @Get('author/:authorId')
  async getByAuthor(
    @Param('authorId') authorId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.blogService.findByAuthor(authorId, pagination.limit ?? 20);
  }

  @Get(':slug')
  async detail(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  // Admin endpoints (ADMIN only — can see drafts/archived)

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/all')
  async findAll(
    @Query('status') status?: PostStatus,
    @Query() pagination?: PaginationDto,
  ) {
    return this.blogService.findAll(
      status,
      pagination?.limit ?? 20,
      pagination?.offset ?? 0,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/:id')
  async findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogService.create(createBlogPostDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBlogPostDto: UpdateBlogPostDto,
  ) {
    return this.blogService.update(id, updateBlogPostDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.blogService.remove(id);
  }
}
