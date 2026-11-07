"use client";

import { useEffect, useState } from "react";
import {
  CONTINUE_ACTIVITY_CHANGED_EVENT,
  readContinueActivities,
  type ContinueActivity,
} from "@/lib/continueActivityStorage";

export function useContinueActivities(): ContinueActivity[] {
  const [activities, setActivities] = useState<ContinueActivity[]>([]);

  useEffect(() => {
    const sync = () => setActivities(readContinueActivities());
    sync();
    window.addEventListener(CONTINUE_ACTIVITY_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CONTINUE_ACTIVITY_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return activities;
}
