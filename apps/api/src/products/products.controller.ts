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
  UseGuards
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // Public endpoints (for frontend)
  
  @Get()
  async findPublished(@Query('limit') limit?: string) {
    return this.productsService.findPublished(Number(limit) || 20);
  }

  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    if (!query) return [];
    return this.productsService.search(query, Number(limit) || 20, Number(offset) || 0);
  }

  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    return this.productsService.findByCategory(categoryId, Number(limit) || 20, Number(offset) || 0);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get('sku/:sku')
  async findBySku(@Param('sku') sku: string) {
    return this.productsService.findBySku(sku);
  }

  // Admin endpoints (for content management)
  
  @Get('admin/all')
  async findAll(
    @Query('published') published?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const publishedFilter = published === 'true' ? true : published === 'false' ? false : undefined;
    return this.productsService.findAll(
      publishedFilter, 
      Number(limit) || 50, 
      Number(offset) || 0
    );
  }

  @Get('admin/:id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
