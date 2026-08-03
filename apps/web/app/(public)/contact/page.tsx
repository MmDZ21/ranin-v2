import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ContactHero } from "@/components/pages/contact/ContactHero";
import { ContactForm } from "@/components/pages/contact/ContactForm";
import { ContactInfo } from "@/components/pages/contact/ContactInfo";

export const metadata: Metadata = {
  title: "تماس با ما",
  description:
    "برای استعلام قیمت، مشاوره فنی و سفارش رله‌های حفاظتی و تجهیزات حفاظت الکتریکی صنعتی با تیم رانین فرایند در تماس باشید.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <Container className="py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Contact Form */}
          <div id="quote-form" className="lg:col-span-2 scroll-mt-28">
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div>
            <ContactInfo />
          </div>
        </div>
      </Container>
    </>
  );
}
