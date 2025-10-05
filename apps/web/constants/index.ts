import { slugify } from "@/lib/utils"

export type TopBarConfig = {
  message: string
  shortMessage: string
  showLanguage: boolean
  languageLabel: string
  showContact: boolean
  contactLabel: string
  contactHref?: string
}

export const TOPBAR_CONFIG: TopBarConfig = {
    message: 'معرفی GridOS 3.0 — مدیریت یکپارچه انرژی برای شرکت‌های چندسایته.',
    shortMessage: 'آشنایی با GridOS 3.0',
    showLanguage: true,
    languageLabel: 'فا',
    showContact: true,
    contactLabel: 'تماس با فروش',
    contactHref: undefined,
  }

export type NavBarConfig = {
  brand: string
  items: NavBarItem[]
}

export type NavBarItem = {
  label: string
  href?: string
  megaMenu?: {
    columns: {
      title: string
      links: {
        label: string
        href: string
        description?: string
      }[]
    }[]
  }
}

export const NAVBAR_CONFIG: NavBarConfig = {
  brand: "رانین فرایند",
  items: [
    { 
      label: "محصولات", 
      megaMenu: {
        columns: [
          {
            title: "راهکارهای کسب‌وکار",
            links: [
              { label: "مدیریت پروژه", href: "/products/project-management", description: "ابزارهای پیشرفته مدیریت پروژه" },
              { label: "تحلیل داده", href: "/products/analytics", description: "تحلیل و گزارش‌گیری هوشمند" },
              { label: "اتوماسیون", href: "/products/automation", description: "خودکارسازی فرآیندهای کسب‌وکار" }
            ]
          },
          {
            title: "راهکارهای فنی",
            links: [
              { label: "توسعه نرم‌افزار", href: "/products/software-development", description: "توسعه اپلیکیشن‌های کاربردی" },
              { label: "زیرساخت ابری", href: "/products/cloud-infrastructure", description: "خدمات ابری و میزبانی" },
              { label: "امنیت سایبری", href: "/products/cybersecurity", description: "حفاظت از داده‌ها و سیستم‌ها" }
            ]
          }
        ]
      }
    },
    { 
      label: "خدمات", 
      megaMenu: {
        columns: [
          {
            title: "مشاوره",
            links: [
              { label: "مشاوره استراتژیک", href: "/services/strategy", description: "برنامه‌ریزی استراتژیک کسب‌وکار" },
              { label: "مشاوره فنی", href: "/services/technical", description: "راهنمایی‌های تخصصی فنی" }
            ]
          },
          {
            title: "پیاده‌سازی",
            links: [
              { label: "راه‌اندازی سیستم", href: "/services/implementation", description: "پیاده‌سازی سیستم‌های سازمانی" },
              { label: "آموزش", href: "/services/training", description: "آموزش کاربران و تیم‌ها" }
            ]
          }
        ]
      }
    },
    { label: "بینش‌ها", href: "/insights" },
    { label: "درباره ما", href: "/about" },
    { label: "تماس", href: "/contact" },
  ]
}

export type HeroConfig = {
  slides?: HeroSlide[]
}

export type HeroSlide = {
  image: string
  headline: string
  sub?: string
  primaryHref?: string
  secondaryHref?: string
}

export const HERO_CONFIG: HeroConfig = {
  slides: [
    {
      image: "/images/slide-1.jpg",
      headline: "تجهیزات برق صنعتی و ساختمانی",
      sub: "ارائه بهترین کلیدها، ترانسفورماتورها و تابلوهای برق با استانداردهای بین‌المللی و کیفیت برتر.",
      primaryHref: "/products",
      secondaryHref: "/contact",
    },
    {
      image: "/images/slide-2.jpg",
      headline: "مشاوره تخصصی و خدمات فنی",
      sub: "تیم مجرب ما آماده ارائه مشاوره رایگان و پشتیبانی کامل در انتخاب بهترین تجهیزات برای پروژه شماست.",
      primaryHref: "/about",
      secondaryHref: "/contact",
    },
    {
      image: "/images/slide-3.jpg",
      headline: "سرعت در تحویل و کیفیت مطمئن",
      sub: "با شبکه توزیع گسترده و انبارداری مدرن، محصولات با سرعت و دقت بالا به دست شما می‌رسد.",
      primaryHref: "/services",
      secondaryHref: "/contact",
    },
  ]
}

export type AnimatedFeaturesProps = {
  /** Section title displayed at the top */
  sectionTitle?: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  /** Whether to reverse the layout (image on start, text on end) */
  reverse?: boolean
  /** Background style */
  background?: "default" | "gray" | "gradient" | "dark"
  /** Custom class for the container */
  className?: string
  /** Animation timing options */
  animationOptions?: {
    staggerDelay?: number
    textDuration?: number
    imageDuration?: number
    viewportAmount?: number
    viewportMargin?: string
  }
}

export const ANIMATED_FEATURES_CONFIG: AnimatedFeaturesProps[] = [
  {
    sectionTitle: "مشاوره تخصصی",
    title: "مشاوره تخصصی خرید",
    description: "با افتخار در کنار شما هستیم تا بهترین انتخاب را داشته باشید. تیم مشاوره تخصصی ما با تجربه‌ی سال‌ها فعالیت در حوزه تجهیزات برق صنعتی و ساختمانی، آماده است تا متناسب با نیاز دقیق شما—از ظرفیت جریان گرفته تا استانداردهای بین‌المللی—بهترین راهکارها را پیشنهاد دهد. مشاوران ما نه تنها در زمینه انواع کلیدها، ترانسفورماتورها و تابلوهای برق تخصص دارند، بلکه در مورد جدیدترین فناوری‌های روز دنیا نیز به‌روز هستند. با ما تماس بگیرید تا با مشاوره‌ای تخصصی و رایگان، بهترین تصمیم را برای پروژه‌ی خود بگیرید.",
    imageSrc: "/images/advice.png",
    imageAlt: "مشاوره تخصصی خرید",
    background: "default",
  },
  {
    sectionTitle: "تحویل فوری",
    title: "ارسال سریع",
    description: "با سیستم ارسال سریع ما، فاصله‌ی بین سفارش تا دریافت محصول به حداقل می‌رسد. کافیست محصول مورد نظر خود را انتخاب کنید تا در کوتاه‌ترین زمان، بسته‌ی شما با بسته‌بندی ایمن و استاندارد، مستقیماً از انبار ما به دستتان برسد. سرعت، دقت و اطمینان سه اصل اساسی خدمات تحویل ما هستند. شبکه ارسال گسترده ما امکان تحویل سریع به تمام نقاط کشور را فراهم کرده و با پیگیری لحظه‌ای، همواره از وضعیت سفارش خود مطلع خواهید بود. همچنین امکان ارسال فوری برای سفارش‌های اورژانسی و پروژه‌های حساس نیز در دسترس شماست.",
    imageSrc: "/images/delivery.png",
    imageAlt: "ارسال سریع",
    reverse: true,
    background: "gray",
  },
]

export type ParallaxSectionProps = {
  image: string
  height: "small" | "medium" | "large" | "full"
  overlay: boolean
  overlayOpacity: number
  title?: string
  subtitle?: string
  ctaText?: string
  ctaHref?: string
  textAlign: "left" | "center" | "right"
  textColor: "white" | "black" | "inherit"
}

export const PARALLAX_SECTION_CONFIG: ParallaxSectionProps = {
  image: "/images/parallax.png",
  height: "medium",
  overlay: true,
  overlayOpacity: 0.7,
  title: "راه‌حل‌های نوآورانه برای صنعت برق",
  subtitle: "با تکنولوژی پیشرفته و تجربه چندین ساله، بهترین راه‌حل‌ها را برای پروژه‌های برق صنعتی و ساختمانی ارائه می‌دهیم.",
  ctaText: "مشاهده محصولات",
  ctaHref: "/products",
  textAlign: "center",
  textColor: "white",
}

export type ProductCategory = {
  title: string
  description: string
  icon: "plug" | "lightning" | "shield"
  categoryHref: string
  productCount: string
}

export type ProductsCategoriesConfig = {
  title: string
  subtitle: string
  ctaText: string
  ctaHref: string
  categories: ProductCategory[]
}

export const PRODUCTS_CATEGORIES_CONFIG: ProductsCategoriesConfig = {
  title: "دسته‌بندی محصولات",
  subtitle: "انواع تجهیزات برق صنعتی و ساختمانی با کیفیت و استاندارد برتر.",
  ctaText: "مشاهده همه محصولات",
  ctaHref: "/products",
  categories: [
    {
      title: "کلیدهای مینیاتوری و اتوماتیک",
      description: "انواع کلیدهای MCB، MCCB و کلیدهای اتوماتیک برای حفاظت مدارهای برق.",
      icon: "plug",
      categoryHref: "/products?category=circuit-breakers",
      productCount: "۲۵+ محصول",
    },
    {
      title: "ترانسفورماتور و تجهیزات قدرت",
      description: "ترانسفورماتورهای توزیع، قدرت و کنترل برای صنایع مختلف.",
      icon: "lightning",
      categoryHref: "/products?category=transformers",
      productCount: "۱۸+ محصول",
    },
    {
      title: "تابلوهای برق و کنترل",
      description: "تابلوهای توزیع، کنترل و محافظت برای انواع کاربردهای صنعتی.",
      icon: "shield",
      categoryHref: "/products?category=control-panels",
      productCount: "۳۰+ محصول",
    },
  ],
}

export type NewsletterSectionProps = {
  title: string
  subtitle: string
  placeholder: string
  buttonText: string
}

export const NEWSLETTER_SECTION_CONFIG: NewsletterSectionProps = {
  title: "عضویت در خبرنامه",
  subtitle: "با عضویت در خبرنامه ما از آخرین محصولات، تخفیف‌های ویژه و اخبار فنی دنیای برق مطلع شوید.",
  placeholder: "ایمیل خود را وارد کنید",
  buttonText: "عضویت",
}

export type FooterLink = {
  label: string
  href: string
}

export type FooterConfig = {
  logo: string
  quickLinks: FooterLink[]
  services: FooterLink[]
  contactEmail: string
  note?: string
}

export const FOOTER_CONFIG: FooterConfig = {
  logo: "رانین فرایند",
  quickLinks: [
    { label: "صفحه اصلی", href: "/" },
    { label: "محصولات", href: "/products" },
    { label: "درباره ما", href: "/about" },
    { label: "تماس با ما", href: "/contact" },
  ],
  services: [
    { label: "فروش تجهیزات", href: "/services/equipment" },
    { label: "مشاوره فنی", href: "/services/consulting" },
  ],
  contactEmail: "sales@raninfarayand.com",
}

export type ContactDetails = {
  phones: string[]
  emails: string[]
  addressLines: string[]
  workHours: string[]
}

export const CONTACT_DETAILS: ContactDetails = {
  phones: ["۰۲۱-۱۲۳۴۵۶۷۸", "۰۹۱۲-۳۴۵۶۷۸۹"],
  emails: ["info@raninfarayand.com", "sales@raninfarayand.com"],
  addressLines: ["تهران، خیابان ولیعصر", "پلاک ۱۲۳۴، طبقه دوم"],
  workHours: [
    "شنبه تا چهارشنبه: ۸:۰۰ - ۱۷:۰۰",
    "پنج‌شنبه: ۸:۰۰ - ۱۳:۰۰",
  ],
}

export const CONTACT_SERVICES: string[] = [
  "مشاوره تخصصی خرید",
  "پشتیبانی فنی",
  "نصب و راه‌اندازی",
  "گارانتی و خدمات پس از فروش",
];

export type AboutHeroConfig = {
  title: string
  subtitle: string
  description: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  image: { src: string; alt: string }
}

export const ABOUT_HERO_CONFIG: AboutHeroConfig = {
  title: "رانین فرایند",
  subtitle: "پیشرو در ارائه تجهیزات برق صنعتی و ساختمانی",
  description:
    "با بیش از دو دهه تجربه در حوزه انرژی و برق، ما به عنوان یکی از پیشروترین شرکت‌های توزیع تجهیزات برق صنعتی و ساختمانی در کشور، آماده ارائه بهترین خدمات و محصولات با کیفیت برتر به مشتریان خود هستیم. تیم متخصص ما با دانش فنی عمیق و تجربه گسترده در پروژه‌های مختلف، قادر به ارائه راهکارهای جامع و نوآورانه برای تمامی نیازهای برقی شما می‌باشد.",
  primaryCta: { label: "تماس با ما", href: "/contact" },
  secondaryCta: { label: "مشاهده محصولات", href: "/products" },
  image: { src: "/images/slide-1.jpg", alt: "رانین فرایند - تجهیزات برق صنعتی" },
}

export type AboutMissionVisionItem = {
  image: { src: string; alt: string }
  icon: "award" | "users"
  title: string
  text: string
}

export const ABOUT_MISSION_VISION: AboutMissionVisionItem[] = [
  {
    image: { src: "/images/slide-2.jpg", alt: "مشاوره تخصصی و خدمات فنی" },
    icon: "award",
    title: "ماموریت ما",
    text: "ارائه بهترین تجهیزات برق صنعتی و ساختمانی با کیفیت برتر و استانداردهای بین‌المللی.",
  },
  {
    image: { src: "/images/slide-3.jpg", alt: "سرعت در تحویل و کیفیت مطمئن" },
    icon: "users",
    title: "چشم‌انداز ما",
    text: "تبدیل شدن به پیشروترین شرکت در حوزه تجهیزات برق صنعتی در منطقه.",
  },
]

export type AboutStat = {
  icon: "award" | "users" | "check" | "clock"
  value: string
  label: string
}

export const ABOUT_STATS: AboutStat[] = [
  { icon: "award", value: "۲۰+", label: "سال تجربه" },
  { icon: "users", value: "۵۰۰+", label: "مشتری راضی" },
  { icon: "check", value: "۱۰۰۰+", label: "پروژه موفق" },
  { icon: "clock", value: "۲۴/۷", label: "پشتیبانی" },
]

export type AboutValue = {
  icon: "check" | "users" | "award"
  title: string
  text: string
}

export const ABOUT_VALUES: AboutValue[] = [
  { icon: "check", title: "کیفیت", text: "ارائه محصولات با بالاترین استانداردهای کیفیت و دوام" },
  { icon: "users", title: "اعتماد", text: "ایجاد روابط پایدار و قابل اعتماد با مشتریان" },
  { icon: "award", title: "نوآوری", text: "استفاده از جدیدترین تکنولوژی‌ها و روش‌های پیشرفته" },
]

export type AboutContactItem = {
  icon: "phone" | "mail" | "map"
  label: string
  value: string
}

export const ABOUT_CONTACT_ITEMS: AboutContactItem[] = [
  { icon: "phone", label: "تلفن", value: CONTACT_DETAILS.phones[0] },
  { icon: "mail", label: "ایمیل", value: CONTACT_DETAILS.emails[0] },
  { icon: "map", label: "آدرس", value: CONTACT_DETAILS.addressLines[0] },
]
export type ProductDTO = {
  id: string;
  name: string;
  slug: string;
  description: string;
  code: string;
  catalogUrl?: string | null;
  imageUrl?: string | null;
};


export type ProductCategoryType = {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  products: ProductDTO[];
};

export const productCategories: ProductCategoryType[] = [
  {
    id: "protection-relays",
    name: "رله‌های حفاظتی",
    slug: "protection-relays",
    description: "رله‌های حفاظتی پیشرفته برای سیستم‌های قدرت و کنترل",
    productCount: 4,
    products: [
      {
        id: "p3u20-6aaa2agaa",
        name: "P3U20-6AAA2AGAA",
        slug: slugify("P3U20-6AAA2AGAA"),
        description: "Schneider Electric product (relay/protection device)",
        code: "P3U20-6AAA2AGAA",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "p3u30-6aaa2bbaa",
        name: "P3U30-6AAA2BBAA",
        slug: slugify("P3U30-6AAA2BBAA"),
        description: "Schneider Electric product",
        code: "P3U30-6AAA2BBAA",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "p1f1-rel-15013d",
        name: "Power Logic Protection Relay P1F1-REL 15013D",
        slug: slugify("Power Logic Protection Relay P1F1-REL 15013D"),
        description: "Power Logic Protection Relay",
        code: "P1F1-REL-15013D",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "p1f1-rel-15012d",
        name: "Power Logic Protection Relay P1F1-REL 15012D",
        slug: slugify("Power Logic Protection Relay P1F1-REL 15012D"),
        description: "Power Logic Protection Relay",
        code: "P1F1-REL-15012D",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
    ],
  },
  {
    id: "micom-relays",
    name: "رله‌های MiCOM",
    slug: "micom-relays",
    description: "رله‌های حفاظتی MiCOM با تکنولوژی پیشرفته",
    productCount: 1,
    products: [
      {
        id: "micom-p632",
        name: "MiCOM P632",
        slug: slugify("MiCOM P632"),
        description: "MiCOM protection relay",
        code: "P632-3B9011F0-316-421-675-705-463-921",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
    ],
  },
  {
    id: "power-logic-devices",
    name: "دستگاه‌های Power Logic",
    slug: "power-logic-devices",
    description: "دستگاه‌های Power Logic برای کنترل و مانیتورینگ سیستم‌های قدرت",
    productCount: 3,
    products: [
      {
        id: "p3g32-cgita-aaefa-baaaa",
        name: "P3G32-CGITA-AAEFA-BAAAA",
        slug: slugify("P3G32-CGITA-AAEFA-BAAAA"),
        description: "Schneider Electric product",
        code: "P3G32-CGITA-AAEFA-BAAAA",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "p3m32-cgita-aaefa-baaaa",
        name: "P3M32-CGITA-AAEFA-BAAAA",
        slug: slugify("P3M32-CGITA-AAEFA-BAAAA"),
        description: "Schneider Electric product",
        code: "P3M32-CGITA-AAEFA-BAAAA",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "p3t32-cgg1a-aa1fa-baaaa",
        name: "P3T32-CGG1A-AA1FA-BAAAA",
        slug: slugify("P3T32-CGG1A-AA1FA-BAAAA"),
        description: "Schneider Electric product",
        code: "P3T32-CGG1A-AA1FA-BAAAA",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
    ],
  },
  {
    id: "control-devices",
    name: "دستگاه‌های کنترل",
    slug: "control-devices",
    description: "دستگاه‌های کنترل و مانیتورینگ برای سیستم‌های صنعتی",
    productCount: 2,
    products: [
      {
        id: "p127-aa0z112gb0",
        name: "P127-AA0Z112GB0",
        slug: slugify("P127-AA0Z112GB0"),
        description: "Schneider Electric product",
        code: "P127-AA0Z112GB0",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "p3u30-6aaa1bbaa",
        name: "P3U30-6AAA1BBAA",
        slug: slugify("P3U30-6AAA1BBAA"),
        description: "Schneider Electric product",
        code: "P3U30-6AAA1BBAA",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
    ],
  },
  {
    id: "circuit-breakers",
    name: "کلیدهای مدار",
    slug: "circuit-breakers",
    description: "کلیدهای مدار مینیاتوری و اتوماتیک برای حفاظت سیستم‌های برق",
    productCount: 3,
    products: [
      {
        id: "mcb-16a",
        name: "MCB 16A",
        slug: slugify("MCB 16A"),
        description: "کلید مدار مینیاتوری 16 آمپر",
        code: "MCB-16A",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "mcb-32a",
        name: "MCB 32A",
        slug: slugify("MCB 32A"),
        description: "کلید مدار مینیاتوری 32 آمپر",
        code: "MCB-32A",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "mccb-63a",
        name: "MCCB 63A",
        slug: slugify("MCCB 63A"),
        description: "کلید مدار اتوماتیک 63 آمپر",
        code: "MCCB-63A",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
    ],
  },
  {
    id: "transformers",
    name: "ترانسفورماتورها",
    slug: "transformers",
    description: "ترانسفورماتورهای توزیع و قدرت برای صنایع مختلف",
    productCount: 2,
    products: [
      {
        id: "transformer-100kva",
        name: "ترانسفورماتور 100 کیلوولت‌آمپر",
        slug: slugify("ترانسفورماتور 100 کیلوولت‌آمپر"),
        description: "ترانسفورماتور توزیع 100 کیلوولت‌آمپر",
        code: "TR-100KVA",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "transformer-250kva",
        name: "ترانسفورماتور 250 کیلوولت‌آمپر",
        slug: slugify("ترانسفورماتور 250 کیلوولت‌آمپر"),
        description: "ترانسفورماتور قدرت 250 کیلوولت‌آمپر",
        code: "TR-250KVA",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
    ],
  },
  {
    id: "control-panels",
    name: "تابلوهای کنترل",
    slug: "control-panels",
    description: "تابلوهای کنترل و توزیع برق برای کاربردهای صنعتی",
    productCount: 4,
    products: [
      {
        id: "panel-mcc",
        name: "تابلو MCC",
        slug: slugify("تابلو MCC"),
        description: "تابلو کنترل موتور مرکزی",
        code: "MCC-PANEL",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "panel-pcc",
        name: "تابلو PCC",
        slug: slugify("تابلو PCC"),
        description: "تابلو کنترل قدرت مرکزی",
        code: "PCC-PANEL",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "panel-distribution",
        name: "تابلو توزیع",
        slug: slugify("تابلو توزیع"),
        description: "تابلو توزیع برق صنعتی",
        code: "DIST-PANEL",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "panel-automation",
        name: "تابلو اتوماسیون",
        slug: slugify("تابلو اتوماسیون"),
        description: "تابلو کنترل و اتوماسیون صنعتی",
        code: "AUTO-PANEL",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
    ],
  },
  {
    id: "cables-wires",
    name: "کابل‌ها و سیم‌ها",
    slug: "cables-wires",
    description: "انواع کابل‌ها و سیم‌های برق برای مصارف مختلف",
    productCount: 3,
    products: [
      {
        id: "cable-power-3x16",
        name: "کابل قدرت 3x16",
        slug: slugify("کابل قدرت 3x16"),
        description: "کابل قدرت 3 رشته 16 میلی‌متر مربع",
        code: "CABLE-3X16",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "cable-control-24x1.5",
        name: "کابل کنترل 24x1.5",
        slug: slugify("کابل کنترل 24x1.5"),
        description: "کابل کنترل 24 رشته 1.5 میلی‌متر مربع",
        code: "CABLE-24X1.5",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "wire-single-2.5",
        name: "سیم تک 2.5",
        slug: slugify("سیم تک 2.5"),
        description: "سیم تک رشته 2.5 میلی‌متر مربع",
        code: "WIRE-2.5",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
    ],
  },
  {
    id: "sensors-instruments",
    name: "سنسورها و ابزار دقیق",
    slug: "sensors-instruments",
    description: "سنسورها و ابزارهای اندازه‌گیری و کنترل",
    productCount: 2,
    products: [
      {
        id: "pressure-sensor",
        name: "سنسور فشار",
        slug: slugify("سنسور فشار"),
        description: "سنسور اندازه‌گیری فشار صنعتی",
        code: "PRESSURE-SENSOR",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "temperature-transmitter",
        name: "ترانسمیتر دما",
        slug: slugify("ترانسمیتر دما"),
        description: "ترانسمیتر اندازه‌گیری دما",
        code: "TEMP-TRANSMITTER",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
    ],
  },
];