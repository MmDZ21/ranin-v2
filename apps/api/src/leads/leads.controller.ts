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
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/enums';

// Tight per-IP limit for the public contact form to blunt spam/abuse
// (overrides the global 100/min throttle).
const LEADS_CREATE_THROTTLE = { default: { ttl: 60000, limit: 5 } };

@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  // Public endpoint (contact form).
  @Throttle(LEADS_CREATE_THROTTLE)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  // Admin endpoints — these expose customer PII, so ADMIN-only.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('source') source?: string,
  ) {
    return this.leadsService.findAll(
      pagination.limit ?? 20,
      pagination.offset ?? 0,
      source,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('stats')
  async getStats() {
    return this.leadsService.getStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('search')
  async search(@Query('q') query: string, @Query() pagination: PaginationDto) {
    if (!query) {
      return [];
    }
    return this.leadsService.search(query, pagination.limit ?? 20);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('product/:productId')
  async findByProduct(
    @Param('productId') productId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.leadsService.findByProduct(productId, pagination.limit ?? 20);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('source/:source')
  async findBySource(
    @Param('source') source: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.leadsService.findBySource(source, pagination.limit ?? 20);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.leadsService.remove(id);
  }
}
