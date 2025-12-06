
import { getCategories } from "@/actions/products";
import { ProductsCategoriesConfig } from "@/constants";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";
import ProductsClient from "./ProductsClient";


export async function Products(props: ProductsCategoriesConfig) {
  const categoriesResult = await getCategories();
  const { title, subtitle, ctaText, ctaHref } = props;
  const fullScreen = false; // Force fullscreen mode

  // Handle error state
  if (!categoriesResult.success) {
    return (
      <Section className="bg-muted/20">
        <div className="py-8 md:py-10 lg:py-14">
          <Container>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                خطا در بارگذاری دسته‌بندی‌ها
              </h2>
              <p className="text-gray-600">{categoriesResult.error}</p>
            </div>
          </Container>
        </div>
      </Section>
    );
  }

  const categories = (categoriesResult.data || []).slice(0, 3);

  return (
    <ProductsClient
      title={title}
      subtitle={subtitle}
      ctaText={ctaText}
      ctaHref={ctaHref}
      categories={categories}
      fullScreen={fullScreen}
    />
  );
}
