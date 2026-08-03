import { slugify } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Users, 
  Settings,
  BookOpen,
  MessageSquare
} from "lucide-react"

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
  message:
    'تأمین رله‌های حفاظتی و تجهیزات حفاظت الکتریکی برای پروژه‌های صنعتی',
  shortMessage: 'تجهیزات حفاظت الکتریکی صنعتی',
  showLanguage: true,
  languageLabel: 'فا',
  showContact: true,
  contactLabel: 'درخواست استعلام قیمت',
  contactHref: '/contact#quote-form',
};

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
            title: "حفاظت و پایش",
            links: [
              { label: "رله‌های حفاظتی", href: "/products?category=protection-relays", description: "حفاظت فیدر، موتور و شبکه قدرت" },
              { label: "رله‌های MiCOM", href: "/products?category=micom-relays", description: "رله‌های حفاظتی سری MiCOM" },
              { label: "دستگاه‌های PowerLogic", href: "/products?category=power-logic-devices", description: "پایش و اندازه‌گیری پارامترهای شبکه" }
            ]
          },
          {
            title: "کنترل و توزیع",
            links: [
              { label: "تجهیزات کنترل", href: "/products?category=control-devices", description: "کنترل و اتوماسیون تجهیزات صنعتی" },
              { label: "کلیدهای مدار", href: "/products?category=circuit-breakers", description: "حفاظت مدارهای توزیع و قدرت" },
              { label: "تابلوهای کنترل", href: "/products?category=control-panels", description: "تابلوهای کنترل و حفاظت" }
            ]
          },
          {
            title: "تجهیزات تکمیلی",
            links: [
              { label: "ترانسفورماتورها", href: "/products?category=transformers", description: "تجهیزات تبدیل و توزیع توان" },
              { label: "کابل‌ها و سیم‌ها", href: "/products?category=cables-wires", description: "کابل و سیم مورد استفاده در پروژه‌های برق" },
              { label: "سنسورها و ابزار دقیق", href: "/products?category=sensors-instruments", description: "اندازه‌گیری و پایش فرایند" }
            ]
          }
        ]
      }
    },
    { label: "همه محصولات", href: "/products" },
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
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
}

export const HERO_CONFIG: HeroConfig = {
  slides: [
    {
      image: "/images/slide-1.jpg",
      headline: "رله‌های حفاظتی برای شبکه‌های برق صنعتی",
      sub: "مشخصات فنی محصولات را بررسی کنید و برای انتخاب تجهیز متناسب با پروژه، استعلام قیمت بگیرید.",
      primaryHref: "/products",
      primaryLabel: "مشاهده محصولات",
      secondaryHref: "/contact#quote-form",
      secondaryLabel: "درخواست استعلام قیمت",
    },
    {
      image: "/images/slide-2.jpg",
      headline: "انتخاب تجهیز بر پایه نیاز فنی پروژه",
      sub: "نوع حفاظت، مشخصات شبکه و کد فنی موردنیاز را ارسال کنید تا درخواست شما دقیق‌تر بررسی شود.",
      primaryHref: "/contact#quote-form",
      primaryLabel: "ثبت درخواست فنی",
      secondaryHref: "/products",
      secondaryLabel: "مرور کاتالوگ",
    },
    {
      image: "/images/slide-3.jpg",
      headline: "استعلام موجودی و قیمت تجهیزات حفاظتی",
      sub: "کد محصول، تعداد و زمان موردنیاز را در فرم تماس وارد کنید تا تیم فروش درخواست شما را پیگیری کند.",
      primaryHref: "/contact#quote-form",
      primaryLabel: "درخواست پیش‌فاکتور",
      secondaryHref: "/products",
      secondaryLabel: "مشاهده محصولات",
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
    sectionTitle: "انتخاب فنی",
    title: "محصول را با مشخصات پروژه تطبیق دهید",
    description: "نوع حفاظت، ولتاژ شبکه، کاربرد تجهیز و کد فنی موردنظر را در درخواست خود ثبت کنید. این اطلاعات مسیر بررسی محصول و استعلام قیمت را روشن‌تر می‌کند و از رفت‌وبرگشت‌های غیرضروری می‌کاهد.",
    imageSrc: "/images/advice.png",
    imageAlt: "مشاوره تخصصی خرید",
    background: "default",
  },
  {
    sectionTitle: "فرایند درخواست",
    title: "از کد محصول تا استعلام قیمت",
    description: "محصول را از کاتالوگ انتخاب کنید یا کد تجهیز را برای ما بفرستید. تیم فروش پس از بررسی مشخصات ثبت‌شده، برای ادامه فرایند تأمین و هماهنگی درخواست با شما در ارتباط خواهد بود.",
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
  title: "تجهیزات حفاظت الکتریکی برای پروژه‌های صنعتی",
  subtitle: "کاتالوگ رله‌های حفاظتی و تجهیزات پایش را مرور کنید یا مشخصات فنی پروژه را برای استعلام ارسال کنید.",
  ctaText: "درخواست استعلام قیمت",
  ctaHref: "/contact#quote-form",
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
  subtitle: "مرور دسته‌های رله حفاظتی، پایش شبکه و تجهیزات کنترل و توزیع.",
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
  buttonText: string
  buttonHref: string
}

export const NEWSLETTER_SECTION_CONFIG: NewsletterSectionProps = {
  title: "برای پروژه خود استعلام فنی و قیمت بگیرید",
  subtitle: "کد محصول، تعداد و مشخصات شبکه را ارسال کنید تا درخواست شما با اطلاعات کامل‌تری بررسی شود.",
  buttonText: "ثبت درخواست استعلام",
  buttonHref: "/contact#quote-form",
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
    { label: "کاتالوگ تجهیزات", href: "/products" },
    { label: "استعلام قیمت", href: "/contact#quote-form" },
  ],
  contactEmail: "sales@raninfarayand.com",
}

export type ContactDetails = {
  emails: string[]
}

export const CONTACT_DETAILS: ContactDetails = {
  emails: ["info@raninfarayand.com", "sales@raninfarayand.com"],
}

export const CONTACT_SERVICES: string[] = [
  "انتخاب رله حفاظتی متناسب با کاربرد",
  "بررسی مشخصات فنی موردنیاز پروژه",
  "استعلام قیمت و موجودی محصول",
  "پیگیری درخواست فروش",
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
  subtitle: "تأمین تجهیزات حفاظت الکتریکی برای پروژه‌های صنعتی",
  description:
    "رانین فرایند بر تأمین رله‌های حفاظتی، تجهیزات پایش شبکه و ملزومات حفاظت الکتریکی تمرکز دارد. برای انتخاب محصول می‌توانید مشخصات فنی و کد تجهیز موردنیاز پروژه را از طریق فرم استعلام ارسال کنید.",
  primaryCta: { label: "درخواست استعلام قیمت", href: "/contact#quote-form" },
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
    text: "ساده‌تر کردن بررسی و تأمین تجهیزات حفاظت الکتریکی بر پایه مشخصات فنی پروژه.",
  },
  {
    image: { src: "/images/slide-3.jpg", alt: "سرعت در تحویل و کیفیت مطمئن" },
    icon: "users",
    title: "چشم‌انداز ما",
    text: "ایجاد یک مسیر روشن و قابل پیگیری از انتخاب محصول تا درخواست فروش.",
  },
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
  icon: "catalog" | "mail" | "quote"
  label: string
  value: string
}

export const ABOUT_CONTACT_ITEMS: AboutContactItem[] = [
  { icon: "catalog", label: "محصولات", value: "مرور تجهیزات و مشخصات فنی" },
  { icon: "mail", label: "ایمیل", value: CONTACT_DETAILS.emails[0] },
  { icon: "quote", label: "استعلام قیمت", value: "ثبت درخواست از طریق فرم تماس" },
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
        name: "رله حفاظتی P3U20-6AAA2AGAA",
        slug: slugify("P3U20-6AAA2AGAA"),
        description: "رله حفاظتی با کد فنی P3U20-6AAA2AGAA",
        code: "P3U20-6AAA2AGAA",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "p3u30-6aaa2bbaa",
        name: "رله حفاظتی P3U30-6AAA2BBAA",
        slug: slugify("P3U30-6AAA2BBAA"),
        description: "رله حفاظتی با کد فنی P3U30-6AAA2BBAA",
        code: "P3U30-6AAA2BBAA",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "p1f1-rel-15013d",
        name: "رله حفاظتی PowerLogic P1F1-REL 15013D",
        slug: slugify("Power Logic Protection Relay P1F1-REL 15013D"),
        description: "رله حفاظتی PowerLogic با کد فنی P1F1-REL-15013D",
        code: "P1F1-REL-15013D",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "p1f1-rel-15012d",
        name: "رله حفاظتی PowerLogic P1F1-REL 15012D",
        slug: slugify("Power Logic Protection Relay P1F1-REL 15012D"),
        description: "رله حفاظتی PowerLogic با کد فنی P1F1-REL-15012D",
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
        description: "رله حفاظتی MiCOM P632",
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
        name: "تجهیز پایش P3G32-CGITA-AAEFA-BAAAA",
        slug: slugify("P3G32-CGITA-AAEFA-BAAAA"),
        description: "تجهیز پایش شبکه با کد فنی P3G32-CGITA-AAEFA-BAAAA",
        code: "P3G32-CGITA-AAEFA-BAAAA",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "p3m32-cgita-aaefa-baaaa",
        name: "تجهیز پایش P3M32-CGITA-AAEFA-BAAAA",
        slug: slugify("P3M32-CGITA-AAEFA-BAAAA"),
        description: "تجهیز پایش شبکه با کد فنی P3M32-CGITA-AAEFA-BAAAA",
        code: "P3M32-CGITA-AAEFA-BAAAA",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "p3t32-cgg1a-aa1fa-baaaa",
        name: "تجهیز پایش P3T32-CGG1A-AA1FA-BAAAA",
        slug: slugify("P3T32-CGG1A-AA1FA-BAAAA"),
        description: "تجهیز پایش شبکه با کد فنی P3T32-CGG1A-AA1FA-BAAAA",
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
        name: "تجهیز کنترل P127-AA0Z112GB0",
        slug: slugify("P127-AA0Z112GB0"),
        description: "تجهیز کنترل با کد فنی P127-AA0Z112GB0",
        code: "P127-AA0Z112GB0",
        catalogUrl: null,
        imageUrl: "/images/relay.png",
      },
      {
        id: "p3u30-6aaa1bbaa",
        name: "تجهیز کنترل P3U30-6AAA1BBAA",
        slug: slugify("P3U30-6AAA1BBAA"),
        description: "تجهیز کنترل با کد فنی P3U30-6AAA1BBAA",
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

export const sidebarItems = [
  {
    title: "داشبورد",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "محصولات",
    url: "/dashboard/products",
    icon: Package,
    items: [
      {
        title: "همه محصولات",
        url: "/dashboard/products",
      },
      {
        title: "افزودن محصول",
        url: "/dashboard/products/new",
      },
      {
        title: "دسته‌بندی محصولات",
        url: "/dashboard/products/categories",
      },
    ],
  },
  {
    title: "دسته‌بندی‌ها",
    url: "/dashboard/categories",
    icon: FolderTree,
    items: [
      {
        title: "همه دسته‌بندی‌ها",
        url: "/dashboard/categories",
      },
      {
        title: "افزودن دسته‌بندی",
        url: "/dashboard/categories/new",
      },
    ],
  },
  {
    title: "بلاگ",
    url: "/dashboard/blog",
    icon: BookOpen,
    items: [
      {
        title: "همه نوشته‌ها",
        url: "/dashboard/blog",
      },
      {
        title: "نویسندگان",
        url: "/dashboard/blog/authors",
      },
      {
        title: "تگ‌ها",
        url: "/dashboard/blog/tags",
      },
    ],
  },
  {
    title: "پیام‌ها",
    url: "/dashboard/leads",
    icon: MessageSquare,
  },
  {
    title: "کاربران",
    url: "/dashboard/users",
    icon: Users,
    items: [
      {
        title: "همه کاربران",
        url: "/dashboard/users",
      },
      {
        title: "افزودن کاربر",
        url: "/dashboard/users/new",
      },
    ],
  },
  {
    title: "تنظیمات",
    url: "/dashboard/settings",
    icon: Settings,
    items: [
      {
        title: "تنظیمات عمومی",
        url: "/dashboard/settings",
      },
      {
        title: "تنظیمات سایت",
        url: "/dashboard/settings/site",
      },
      {
        title: "پشتیبان‌گیری",
        url: "/dashboard/settings/backup",
      },
    ],
  },
]
