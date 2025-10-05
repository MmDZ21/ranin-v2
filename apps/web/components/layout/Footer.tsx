import Link from "next/link";
import { Container } from "../ui/Container";
import Logo from "../Logo";
import { FooterConfig } from "@/constants";

export async function Footer(p: FooterConfig) {
  const {quickLinks, services, contactEmail, note } = p;
  return (
    <footer className="bg-gray-900 text-white">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo Section */}
          <div className="md:col-span-1">
            <div className="flex flex-col justify-center mb-6">
                <Logo width={150} height={60} color="hsl(var(--brand))" />
              {/* <span className="text-lg md:text-xl font-bold text-white">{logo}</span> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-white">لینک‌های سریع</h3>
            <ul className="space-y-2 md:space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href} 
                    className="text-sm md:text-base text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-white">خدمات</h3>
            <ul className="space-y-2 md:space-y-3">
              {services.map((service, i) => (
                <li key={i}>
                  <Link 
                    href={service.href} 
                    className="text-sm md:text-base text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-white">تماس با ما</h3>
            <div className="space-y-2 md:space-y-3">
              <Link 
                href={`mailto:${contactEmail}`}
                className="text-sm md:text-base text-gray-300 hover:text-white transition-colors duration-200 block"
              >
                {contactEmail}
              </Link>
            </div>
          </div>
        </div>
      </Container>
      
      {/* Bottom Border */}
      <div className="border-t border-gray-800">
        <Container className="py-6">
          <div className="text-center text-gray-400 text-sm">
            {note || "© ۲۰۲۵ رانین فرایند. تمامی حقوق محفوظ است."}
          </div>
        </Container>
      </div>
    </footer>
  );
}


