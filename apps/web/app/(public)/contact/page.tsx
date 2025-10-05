import { Container } from "@/components/ui/Container";
import { ContactHero } from "@/components/pages/contact/ContactHero";
import { ContactForm } from "@/components/pages/contact/ContactForm";
import { ContactInfo } from "@/components/pages/contact/ContactInfo";
import { ContactMap } from "@/components/pages/contact/ContactMap";

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <Container className="py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div>
            <ContactInfo />
          </div>
        </div>

        {/* Map Section */}
        {/* <ContactMap /> */}
      </Container>
    </>
  );
}
