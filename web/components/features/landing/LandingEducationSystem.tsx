import { useTranslations } from "next-intl";
import { EducationStep } from "@/components/features/landing/EducationStep";
import { Container } from "@/components/ui/Container";

const STEP_KEYS = ["level", "lessons", "practice", "progress"] as const;

export function LandingEducationSystem() {
  const t = useTranslations("EducationSystem");

  return (
    <section
      id="egitim-sistemi"
      aria-labelledby="education-system-heading"
      className="scroll-mt-20 border-t border-border"
    >
      <Container className="py-16 sm:py-20">
        <div className="max-w-3xl space-y-3">
          <h2
            id="education-system-heading"
            className="page-title"
          >
            {t("title")}
          </h2>
          <p className="text-base leading-7 text-brand-600 dark:text-brand-400">
            {t("subtitle")}
          </p>
        </div>

        <ol className="mt-10">
          {STEP_KEYS.map((key, index) => (
            <EducationStep
              key={key}
              index={index + 1}
              title={t(`steps.${key}.title`)}
              body={t(`steps.${key}.body`)}
            />
          ))}
        </ol>
      </Container>
    </section>
  );
}
