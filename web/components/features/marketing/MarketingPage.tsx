import { Container } from "@/components/ui/Container";

type MarketingPageProps = {
  title: string;
  description: string;
};

export function MarketingPage({ title, description }: MarketingPageProps) {
  return (
    <Container className="py-16 sm:py-20">
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-900 sm:text-4xl dark:text-brand-100">
          {title}
        </h1>
        <p className="text-base leading-relaxed text-brand-600 dark:text-brand-400">
          {description}
        </p>
      </div>
    </Container>
  );
}
