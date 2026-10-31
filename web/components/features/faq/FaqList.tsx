import { useTranslations } from "next-intl";
import { FaqItem } from "@/components/features/faq/FaqItem";

const FAQ_KEYS = ["what", "level", "ai", "free", "pace", "contact"] as const;

export function FaqList() {
  const t = useTranslations("Faq");

  return (
    <div className="mt-10">
      {FAQ_KEYS.map((key) => (
        <FaqItem
          key={key}
          question={t(`items.${key}.question`)}
          answer={t(`items.${key}.answer`)}
        />
      ))}
    </div>
  );
}
