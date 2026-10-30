import { Container } from "@/components/ui/Container";

type MarketingPageProps = {
  title: string;
  description: string;
};

export function MarketingPage({ title, description }: MarketingPageProps) {
  return (
    <Container className="py-16 sm:py-20">
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-teal-900 sm:text-4xl dark:text-teal-200">
          {title}
        </h1>
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </div>
    </Container>
  );
}
