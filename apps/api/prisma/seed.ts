import { PrismaClient } from "../src/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as argon2 from "argon2";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create Admin User
  const adminEmail = "admin@example.com";
  const adminPassword = await argon2.hash("admin123");

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // First, create or find categories
  const categories = [
    { 
      name: "رله حفاظتی همه‌منظوره", 
      slug: "universal-protection-relays",
      description: "رله‌های حفاظتی همه‌منظوره که قابلیت حفاظت از فیدرها، موتورها و تجهیزات مختلف را دارند. این رله‌ها دارای قابلیت‌های پیشرفته حفاظتی و اندازه‌گیری هستند."
    },
    { 
      name: "رله حفاظتی اضافه‌جریان و زمین", 
      slug: "overcurrent-earth-fault-relays",
      description: "رله‌های حفاظتی مخصوص حفاظت از اضافه‌جریان و خطای زمین در شبکه‌های توزیع و انتقال برق. این رله‌ها برای حفاظت از خطوط و تجهیزات در برابر جریان‌های غیرعادی طراحی شده‌اند."
    },
    { 
      name: "رله حفاظتی", 
      slug: "protection-relays",
      description: "رله‌های حفاظتی عمومی که برای حفاظت از تجهیزات الکتریکی در برابر انواع خطاها و شرایط غیرعادی استفاده می‌شوند."
    },
    { 
      name: "رله حفاظتی ترانسفورماتور", 
      slug: "transformer-protection-relays",
      description: "رله‌های حفاظتی مخصوص ترانسفورماتورها که شامل حفاظت دیفرانسیل، اضافه‌بار، خطای زمین و سایر حفاظت‌های تخصصی ترانسفورماتور می‌باشند."
    },
    { 
      name: "رله حفاظتی ژنراتور", 
      slug: "generator-protection-relays",
      description: "رله‌های حفاظتی مخصوص ژنراتورها که شامل حفاظت دیفرانسیل، اضافه‌بار، خطای زمین، عدم تعادل و سایر حفاظت‌های تخصصی ژنراتور می‌باشند."
    },
    { 
      name: "رله حفاظتی موتور", 
      slug: "motor-protection-relays",
      description: "رله‌های حفاظتی مخصوص موتورهای الکتریکی که شامل حفاظت اضافه‌بار، خطای زمین، حفاظت حرارتی و سایر حفاظت‌های تخصصی موتور می‌باشند."
    },
  ];

  const categoryMap = new Map();
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    categoryMap.set(category.name, created.id);
  }

  const products = [
    {
      sku: "P3U20-6AAA2AGAA",
      name: "رله حفاظتی همه‌منظوره Easergy P3U20 اشنایدر",
      slug: "easergy-p3u20-protection-relay",
      shortDesc:
        "رله حفاظتی Universall Relay سری Easergy P3U20 اشنایدر با منابع تغذیه 48–230VAC/DC و ورودی دیجیتال 110–230VAC.",
      longDesc:
        "رله P3U20 اشنایدر یک رله حفاظتی همه‌منظوره (Feeder/Motor protection) است که مناسب مصارف حفاظت فیدر و موتورها می‌باشد. این رله قابلیت اندازه‌گیری 3 ورودی جریان (CT) و 4 ورودی ولتاژ (VT 100/110VAC)، 10 ورودی دیجیتال (منبع تغذیه 110–230VAC) و 8 خروجی رله را دارد. همچنین پورت ارتباطی RS-485 را پشتیبانی می‌کند.",
      brand: "Schneider Electric",
      categoryId: categoryMap.get("رله حفاظتی همه‌منظوره"),
      specs: {
        "منبع تغذیه": "48…230VAC/DC",
        "ورودی جریان (CT)": "3 × 1/5A",
        "ورودی ولتاژ": "4 × 100/110VAC",
        "ورودی دیجیتال": "10 (110–230VAC)",
        "خروجی رله": "8",
        "پورت ارتباط": "RS-485",
      },
      tags: ["Protection Relay", "Easergy P3U", "Universal", "Feeder", "Motor"],
      features: [
        "حفاظت اضافه‌بار سه‌فاز",
        "حفاظت خطای زمین",
        "حفاظت اضافه‌ولتاژ/کم‌ولتاژ",
        "حفاظت عدم تعادل جریان",
        "حفاظت موتور (Thermal)",
        "اندازه‌گیری انرژی",
        "پورت ارتباطی RS-485",
        "نمایشگر LCD",
        "پیکربندی از طریق نرم‌افزار"
      ],
      published: true,
    },
    {
      sku: "P3U30-6AAA2BBAA",
      name: "رله حفاظتی همه‌منظوره Easergy P3U30 اشنایدر",
      slug: "easergy-p3u30-protection-relay",
      shortDesc:
        "رله حفاظتی Universall Relay سری Easergy P3U30 اشنایدر با منابع تغذیه 48–230VAC/DC.",
      longDesc:
        "رله P3U30 اشنایدر یک رله حفاظتی چندمنظوره (Universal) برای شبکه‌های ولتاژ متوسط است. این رله دارای 3 ورودی جریان (CT) و 1 ورودی جریان خنثی، 4 ورودی ولتاژ (100/110VAC)، 16 ورودی دیجیتال و 8 خروجی رله است. منبع تغذیه آن 48 تا 230VAC/DC بوده و قابلیت‌های پیشرفته حفاظتی مانند حفاظت اضافه‌بار، خطای زمین، خطای دو فاز، و حفاظت موتور را دارا می‌باشد.",
      brand: "Schneider Electric",
      categoryId: categoryMap.get("رله حفاظتی همه‌منظوره"),
      specs: {
        "منبع تغذیه": "48…230VAC/DC",
        "ورودی جریان (CT)": "3 × 1/5A + 1 × 1/5A (خنثی)",
        "ورودی ولتاژ": "4 × 100/110VAC",
        "ورودی دیجیتال": "16",
        "خروجی رله": "8",
        "پورت ارتباط": "USB front, RS-485 rear",
      },
      tags: ["Protection Relay", "Easergy P3U", "Universal", "Feeder", "Motor"],
      features: [
        "حفاظت اضافه‌بار سه‌فاز",
        "حفاظت خطای زمین (خنثی)",
        "حفاظت اضافه‌ولتاژ/کم‌ولتاژ",
        "حفاظت عدم تعادل جریان",
        "حفاظت موتور (Thermal)",
        "اندازه‌گیری انرژی",
        "پورت USB و RS-485",
        "نمایشگر LCD رنگی",
        "پیکربندی از طریق نرم‌افزار",
        "ورودی دیجیتال بیشتر"
      ],
      published: true,
    },
    {
      sku: "P127-AA0Z112GBO",
      name: "رله حفاظت اضافه‌بار و زمین MiCOM P127 اشنایدر",
      slug: "micom-p127-overcurrent-earth-fault-relay",
      shortDesc: "رله حفاظت اضافه‌بار و خطای زمین MiCOM P127 اشنایدر.",
      longDesc:
        "رله MiCOM P127 اشنایدر جهت حفاظت جریان زیاد (اضافه‌بار) و خطای زمین در شبکه‌های MV است. این رله دارای 4 ورودی جریان (CT)، 3 ورودی ولتاژ و 12 ورودی دیجیتال است و 9 خروجی رله دارد. حفاظت‌های اصلی شامل اضافه‌بار سه‌فاز، اضافه‌بار زمین، حفاظت‌های ولتاژ (OVER/UNDER)، و توابع کمکی مانند autoreclose می‌باشد.",
      brand: "Schneider Electric",
      categoryId: categoryMap.get("رله حفاظتی اضافه‌جریان و زمین"),
      specs: {
        "ورودی جریان (CT)": "4",
        "ورودی ولتاژ": "3",
        "ورودی دیجیتال": "12",
        "خروجی رله": "9",
        "پروتکل‌های ارتباطی": "DNP3, IEC 60870-5-103, Modbus RTU",
      },
      tags: ["Protection Relay", "MiCOM P127", "Overcurrent", "Earth Fault"],
      features: [
        "حفاظت اضافه‌بار سه‌فاز",
        "حفاظت خطای زمین",
        "حفاظت اضافه‌ولتاژ/کم‌ولتاژ",
        "تابع Auto-reclose",
        "اندازه‌گیری انرژی",
        "پروتکل‌های ارتباطی متعدد",
        "نمایشگر LCD",
        "پیکربندی از طریق نرم‌افزار",
        "حافظه رویدادها"
      ],
      published: true,
    },
    {
      sku: "POWER LOGIC P1F1-REL 15013D",
      name: "رله حفاظت PowerLogic P1F1 اشنایدر",
      slug: "powerlogic-p1f1-overcurrent-relay",
      shortDesc:
        "رله حفاظتی جریان زیاد و خطای زمین PowerLogic P1F1 اشنایدر با تغذیه 90–250VAC/DC.",
      longDesc:
        "رله PowerLogic P1F1 اشنایدر یک رله حفاظتی جمع‌وجور برای حفاظت اضافه‌بار و خطای زمین است. دارای 3 ورودی جریان، 4 ورودی دیجیتال، 8 خروجی رله و منبع تغذیه 90 تا 250VAC/DC. پشتیبانی از پروتکل‌های Modbus و DNP3.",
      brand: "Schneider Electric",
      categoryId: categoryMap.get("رله حفاظتی"),
      specs: {
        "منبع تغذیه": "90…250VAC/DC",
        "ورودی جریان (CT)": "3",
        "ورودی دیجیتال": "4",
        "خروجی رله": "8",
        "پروتکل‌ها": "Modbus, DNP3",
      },
      tags: ["Protection Relay", "PowerLogic P1", "Overcurrent", "Earth Fault"],
      features: [
        "حفاظت اضافه‌بار سه‌فاز",
        "حفاظت خطای زمین",
        "اندازه‌گیری انرژی",
        "پروتکل‌های Modbus و DNP3",
        "نمایشگر LED",
        "پیکربندی از طریق نرم‌افزار",
        "حافظه رویدادها",
        "منبع تغذیه گسترده"
      ],
      published: true,
    },
    {
      sku: "POWER LOGIC P1F1-REL 15012D",
      name: "رله حفاظت Easergy P1F اشنایدر (24–60V)",
      slug: "easergy-p1f-overcurrent-relay",
      shortDesc:
        "رله حفاظتی جریان زیاد Easergy P1F اشنایدر با تغذیه 24–60VAC/DC.",
      longDesc:
        "رله Easergy P1F اشنایدر یک رله حفاظتی برای حفاظت اضافه‌بار و خطای زمین است که با منبع تغذیه 24 تا 60VAC/DC کار می‌کند. دارای 3 ورودی جریان (CT)، 4 ورودی دیجیتال و 8 خروجی رله. پورت ارتباطی RS-485 و USB دارد.",
      brand: "Schneider Electric",
      categoryId: categoryMap.get("رله حفاظتی"),
      specs: {
        "منبع تغذیه": "24…60VAC/DC",
        "ورودی جریان (CT)": "3",
        "ورودی دیجیتال": "4",
        "خروجی رله": "8",
        "پورت ارتباط": "RS-485, USB",
      },
      tags: ["Protection Relay", "Easergy P1F", "Overcurrent", "Earth Fault"],
      features: [
        "حفاظت اضافه‌بار سه‌فاز",
        "حفاظت خطای زمین",
        "اندازه‌گیری انرژی",
        "پورت RS-485 و USB",
        "نمایشگر LED",
        "پیکربندی از طریق نرم‌افزار",
        "حافظه رویدادها",
        "منبع تغذیه DC کم‌ولتاژ"
      ],
      published: true,
    },
    {
      sku: "MICOM P632-3B9011F0-316-421-675-705-463-921",
      name: "رله حفاظت دیفرانسیل ترانسفورماتور MiCOM P632 اشنایدر",
      slug: "micom-p632-transformer-protection-relay",
      shortDesc: "رله حفاظتی دیفرانسیل ترانسفورماتور MiCOM P632 اشنایدر.",
      longDesc:
        "رله MiCOM P632 برای حفاظت سریع ترانسفورماتور طراحی شده است. دارای 8 ورودی جریان، 4 ورودی ولتاژ، 34 ورودی دیجیتال، 22 خروجی رله و 2 خروجی آنالوگ. مناسب حفاظت دیفرانسیل، خطای زمین و اضافه‌بار.",
      brand: "Schneider Electric",
      categoryId: categoryMap.get("رله حفاظتی ترانسفورماتور"),
      specs: {
        "ورودی جریان (CT)": "8",
        "ورودی ولتاژ": "4",
        "ورودی دیجیتال": "34",
        "خروجی رله": "22",
        "خروجی آنالوگ": "2",
      },
      tags: ["Transformer Protection", "Differential Relay", "MiCOM P632"],
      features: [
        "حفاظت دیفرانسیل ترانسفورماتور",
        "حفاظت خطای زمین",
        "حفاظت اضافه‌بار",
        "حفاظت اضافه‌ولتاژ/کم‌ولتاژ",
        "اندازه‌گیری انرژی",
        "پروتکل‌های ارتباطی متعدد",
        "نمایشگر LCD رنگی",
        "پیکربندی از طریق نرم‌افزار",
        "حافظه رویدادها",
        "خروجی آنالوگ"
      ],
      published: true,
    },
    {
      sku: "P3G32-CGITA-AAEFA-BAAAA",
      name: "رله حفاظت ژنراتور PowerLogic P3G32 اشنایدر",
      slug: "powerlogic-p3g32-generator-relay",
      shortDesc: "رله حفاظتی ژنراتور و دیفرانسیل PowerLogic P3G32 اشنایدر.",
      longDesc:
        "رله PowerLogic P3G32 اشنایدر یک رله حفاظتی برای ژنراتورها با حفاظت‌های دیفرانسیل ماشین، اضافه‌بار و خطای زمین است.",
      brand: "Schneider Electric",
      categoryId: categoryMap.get("رله حفاظتی ژنراتور"),
      specs: {},
      tags: ["Generator Protection", "Differential Relay", "PowerLogic P3G"],
      features: [
        "حفاظت دیفرانسیل ژنراتور",
        "حفاظت خطای زمین",
        "حفاظت اضافه‌بار",
        "حفاظت اضافه‌ولتاژ/کم‌ولتاژ",
        "حفاظت عدم تعادل جریان",
        "اندازه‌گیری انرژی",
        "پروتکل‌های ارتباطی",
        "نمایشگر LCD",
        "پیکربندی از طریق نرم‌افزار",
        "حافظه رویدادها"
      ],
      published: true,
    },
    {
      sku: "P3M32-CGITA-AAEFA-BAAAA",
      name: "رله حفاظت موتور PowerLogic P3M32 اشنایدر",
      slug: "powerlogic-p3m32-motor-relay",
      shortDesc: "رله حفاظتی موتور و دیفرانسیل PowerLogic P3M32 اشنایدر.",
      longDesc:
        "رله PowerLogic P3M32 اشنایدر یک رله حفاظتی برای موتورها با حفاظت‌های جریان زیاد، خطای زمین و دیفرانسیل است.",
      brand: "Schneider Electric",
      categoryId: categoryMap.get("رله حفاظتی موتور"),
      specs: {},
      tags: ["Motor Protection", "Differential Relay", "PowerLogic P3M"],
      features: [
        "حفاظت دیفرانسیل موتور",
        "حفاظت خطای زمین",
        "حفاظت اضافه‌بار",
        "حفاظت اضافه‌ولتاژ/کم‌ولتاژ",
        "حفاظت عدم تعادل جریان",
        "حفاظت موتور (Thermal)",
        "اندازه‌گیری انرژی",
        "پروتکل‌های ارتباطی",
        "نمایشگر LCD",
        "پیکربندی از طریق نرم‌افزار",
        "حافظه رویدادها"
      ],
      published: true,
    },
    {
      sku: "P3T32-CGG1A-AA1FA-BAAAA",
      name: "رله حفاظت ترانسفورماتور PowerLogic P3T32 اشنایدر",
      slug: "powerlogic-p3t32-transformer-relay",
      shortDesc:
        "رله حفاظتی ترانسفورماتور PowerLogic P3T32 با 6 ورودی CT اشنایدر.",
      longDesc:
        "رله PowerLogic P3T32 اشنایدر یک رله حفاظتی برای ترانسفورماتور است. دارای 6 ورودی جریان، 4 ورودی ولتاژ، 6 ورودی دیجیتال، 10 خروجی رله و منبع تغذیه 110–230VAC/DC.",
      brand: "Schneider Electric",
      categoryId: categoryMap.get("رله حفاظتی ترانسفورماتور"),
      specs: {
        "ورودی جریان (CT)": "6",
        "ورودی ولتاژ": "4",
        "ورودی دیجیتال": "6",
        "خروجی رله": "10",
        "منبع تغذیه": "110…230VAC/DC",
      },
      tags: ["Transformer Protection", "Differential Relay", "PowerLogic P3T"],
      features: [
        "حفاظت دیفرانسیل ترانسفورماتور",
        "حفاظت خطای زمین",
        "حفاظت اضافه‌بار",
        "حفاظت اضافه‌ولتاژ/کم‌ولتاژ",
        "اندازه‌گیری انرژی",
        "پروتکل‌های ارتباطی",
        "نمایشگر LCD",
        "پیکربندی از طریق نرم‌افزار",
        "حافظه رویدادها",
        "منبع تغذیه گسترده"
      ],
      published: true,
    },
  ];

  // Use upsert to handle existing products
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
  console.log("✅ Products seeded successfully");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
