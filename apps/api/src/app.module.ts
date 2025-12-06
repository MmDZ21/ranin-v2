import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { BlogModule } from './blog/blog.module';
import { LeadsModule } from './leads/leads.module';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule, 
    ProductsModule, 
    CategoriesModule,
    BlogModule, 
    LeadsModule, 
    AuthModule, 
    UploadsModule
  ],
})
export class AppModule {}