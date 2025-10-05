import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ContactLead } from '@prisma/client';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  // Get all leads with optional filtering
  async findAll(limit = 50, offset = 0, source?: string): Promise<ContactLead[]> {
    const where = source ? { source } : {};
    
    return this.prisma.contactLead.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      },
    });
  }

  // Get lead by ID
  async findOne(id: string): Promise<ContactLead | null> {
    return this.prisma.contactLead.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      },
    });
  }

  // Create new lead
  async create(createLeadDto: CreateLeadDto): Promise<ContactLead> {
    return this.prisma.contactLead.create({
      data: createLeadDto,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      },
    });
  }

  // Update lead
  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<ContactLead> {
    // Check if lead exists
    const existingLead = await this.findOne(id);
    if (!existingLead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return this.prisma.contactLead.update({
      where: { id },
      data: updateLeadDto,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      },
    });
  }

  // Delete lead
  async remove(id: string): Promise<ContactLead> {
    // Check if lead exists
    const existingLead = await this.findOne(id);
    if (!existingLead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return this.prisma.contactLead.delete({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      },
    });
  }

  // Get leads by product
  async findByProduct(productId: string, limit = 20): Promise<ContactLead[]> {
    return this.prisma.contactLead.findMany({
      where: { productId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      },
    });
  }

  // Get leads by source
  async findBySource(source: string, limit = 20): Promise<ContactLead[]> {
    return this.prisma.contactLead.findMany({
      where: { source },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      },
    });
  }

  // Search leads
  async search(query: string, limit = 20): Promise<ContactLead[]> {
    return this.prisma.contactLead.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
          { message: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      },
    });
  }

  // Get leads statistics
  async getStats() {
    const total = await this.prisma.contactLead.count();
    const today = await this.prisma.contactLead.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });
    const thisWeek = await this.prisma.contactLead.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });
    const thisMonth = await this.prisma.contactLead.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    return {
      total,
      today,
      thisWeek,
      thisMonth,
    };
  }
}
