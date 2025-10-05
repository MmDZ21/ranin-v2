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
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  // Public endpoint (for contact forms)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  // Admin endpoints (for lead management)
  
  @Get()
  async findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('source') source?: string
  ) {
    return this.leadsService.findAll(
      Number(limit) || 50, 
      Number(offset) || 0, 
      source
    );
  }

  @Get('stats')
  async getStats() {
    return this.leadsService.getStats();
  }

  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('limit') limit?: string
  ) {
    if (!query) {
      return [];
    }
    return this.leadsService.search(query, Number(limit) || 20);
  }

  @Get('product/:productId')
  async findByProduct(
    @Param('productId') productId: string,
    @Query('limit') limit?: string
  ) {
    return this.leadsService.findByProduct(productId, Number(limit) || 20);
  }

  @Get('source/:source')
  async findBySource(
    @Param('source') source: string,
    @Query('limit') limit?: string
  ) {
    return this.leadsService.findBySource(source, Number(limit) || 20);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto
  ) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }
}
