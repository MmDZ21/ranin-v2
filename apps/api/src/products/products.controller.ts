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
import { AdvancedSearchDto } from './dto/advanced-search.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Product } from 'src/generated/client';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // Public endpoints (for frontend)
  
  @Get()
  async findPublished(@Query('limit') limit?: string): Promise<Product[]> {
    return this.productsService.findPublished(Number(limit) || 20);
  }

  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<Product[]> {
    if (!query) return [];
    return this.productsService.search(query, Number(limit) || 20, Number(offset) || 0);
  }

  @Get('search/advanced')
  async advancedSearch(@Query() query: AdvancedSearchDto): Promise<Product[]> {
    return await this.productsService.advancedSearch(query);
  }

  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<Product[]> {
    return this.productsService.findByCategory(categoryId, Number(limit) || 20, Number(offset) || 0);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<Product | null> {
    return this.productsService.findBySlug(slug);
  }

  @Get('sku/:sku')
  async findBySku(@Param('sku') sku: string): Promise<Product | null> {
    return this.productsService.findBySku(sku);
  }

  // Admin endpoints (for content management)
  
  @Get('admin/all')
  async findAll(
    @Query('published') published?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<Product[]> {
    const publishedFilter = published === 'true' ? true : published === 'false' ? false : undefined;
    return this.productsService.findAll(
      publishedFilter, 
      Number(limit) || 50, 
      Number(offset) || 0
    );
  }

  @Get('admin/:id')
  async findOne(@Param('id') id: string): Promise<Product | null> {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<Product> {
    return this.productsService.remove(id);
  }
}
