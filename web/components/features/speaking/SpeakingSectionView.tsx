"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { SpeakingSection } from "@/data/speakings/types";
import { SpeakingExercisesView } from "@/components/features/speaking/SpeakingExercisesView";
import { SpeakingModelView } from "@/components/features/speaking/SpeakingModelView";
import { SpeakingSectionTabs } from "@/components/features/speaking/SpeakingSectionTabs";
import { useRouter } from "@/i18n/navigation";
import {
  parseSpeakingSectionTab,
  tabFromSpeakingLocationHash,
  type SpeakingSectionTab,
} from "@/lib/speakingSectionTab";

type SpeakingSectionViewProps = {
  section: SpeakingSection;
};

function speakingSectionHref(
  sectionId: string,
  tab: SpeakingSectionTab,
): string {
  return tab === "practice"
    ? `/panel/speaking/${sectionId}?tab=practice`
    : `/panel/speaking/${sectionId}`;
}

export function SpeakingSectionView({ section }: SpeakingSectionViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = parseSpeakingSectionTab(searchParams.get("tab") ?? undefined);

  useEffect(() => {
    const hashTab = tabFromSpeakingLocationHash();
    if (hashTab !== "practice") {
      return;
    }
    router.replace(speakingSectionHref(section.id, "practice"), {
      scroll: false,
    });
  }, [router, section.id]);

  function handleTabChange(next: SpeakingSectionTab) {
    if (next === tab) {
      return;
    }
    router.replace(speakingSectionHref(section.id, next), { scroll: false });
  }

  return (
    <div className="space-y-6">
      <SpeakingSectionTabs activeTab={tab} onChange={handleTabChange} />

      {tab === "model" ? (
        <SpeakingModelView section={section} />
      ) : (
        <SpeakingExercisesView section={section} />
      )}
    </div>
  );
}
