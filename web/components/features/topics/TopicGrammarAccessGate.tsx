"use client";

import { useMemo, type ReactNode } from "react";
import {
  TopicItemLocked,
  type TopicItemLockedKind,
} from "@/components/features/topics/TopicItemLocked";
import { useTopicItemAccessVersion } from "@/hooks/useTopicItemAccessVersion";
import {
  canAccessCombinedExercise,
  canAccessGrammarTopicOrExam,
  getTopicDisplayIndex,
} from "@/lib/topicItemAccess";

type TopicGrammarAccessGateProps = {
  children: ReactNode;
  topicId?: string;
  combinedId?: string;
  lockedKind: TopicItemLockedKind;
  displayIndex?: number;
};

export function TopicGrammarAccessGate({
  children,
  topicId,
  combinedId,
  lockedKind,
  displayIndex,
}: TopicGrammarAccessGateProps) {
  const accessVersion = useTopicItemAccessVersion();

  const allowed = useMemo(() => {
    if (topicId) {
      return canAccessGrammarTopicOrExam(topicId);
    }
    if (combinedId) {
      return canAccessCombinedExercise(combinedId);
    }
    return false;
  }, [topicId, combinedId, accessVersion]);

  if (!allowed) {
    const index =
      displayIndex ?? (topicId ? getTopicDisplayIndex(topicId) : undefined);

    return <TopicItemLocked kind={lockedKind} index={index} />;
  }

  return children;
}
