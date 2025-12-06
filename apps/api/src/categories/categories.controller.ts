import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name);

  constructor(private categoriesService: CategoriesService) {}

  // Public endpoints (for frontend)

  @Get()
  async findAll(@Query('tree') tree?: string) {
    this.logger.log(`GET /categories tree=${tree}`);
    if (tree === 'true') {
      return this.categoriesService.findTree();
    }
    return this.categoriesService.findAll();
  }

  @Get('with-counts')
  async findWithProductCounts() {
    this.logger.log('GET /categories/with-counts');
    return this.categoriesService.findWithProductCounts();
  }

  @Get('tree')
  async findTree() {
    this.logger.log('GET /categories/tree');
    return this.categoriesService.findTree();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`GET /categories/${id}`);
    return this.categoriesService.findOne(id);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    this.logger.log(`GET /categories/slug/${slug}`);
    return this.categoriesService.findBySlug(slug);
  }

  // Admin endpoints (protected)

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    this.logger.log('POST /categories');
    return this.categoriesService.create(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    this.logger.log(`PUT /categories/${id}`);
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    this.logger.log(`DELETE /categories/${id}`);
    await this.categoriesService.remove(id);
  }
}
