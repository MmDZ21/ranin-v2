// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin1234', 10);
  await prisma.user.upsert({
    where: { email: 'admin@ranin.local' },
    update: {},
    create: {
      email: 'admin@ranin.local',
      password,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  // یک نمونه دسته
  const cat = await prisma.category.upsert({
    where: { slug: 'electrical' },
    update: {},
    create: { name: 'Electrical', slug: 'electrical' },
  });

  // چند محصول نمونه
  await prisma.product.createMany({
    data: [
      {
        name: 'Schneider Acti 9 - مدل A9',
        slug: 'schneider-acti9-a9',
        shortDesc: 'کلید مینیاتوری محافظ جریان',
        brand: 'Schneider Electric',
        modelNumber: 'A9F',
        categoryId: cat.id,
      },
      {
        name: 'Schneider Harmony - شستی',
        slug: 'schneider-harmony-button',
        shortDesc: 'شستی صنعتی با کیفیت',
        brand: 'Schneider Electric',
        modelNumber: 'XB4',
        categoryId: cat.id,
      },
    ],
  });

  // یک پست بلاگ نمونه
  const author = await prisma.author.upsert({
    where: { slug: 'admin' },
    update: {},
    create: { name: 'Admin', slug: 'admin' },
  });

  await prisma.blogPost.create({
    data: {
      title: 'معرفی محصولات شنتی',
      slug: 'intro-products',
      excerpt: 'یک مقدمه درباره محصولات شنتی...',
      content: '<p>متن تستی برای بلاگ</p>',
      authorId: author.id,
      status: 'PUBLISHED',
    },
  });

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
     await prisma.$disconnect()
  });
