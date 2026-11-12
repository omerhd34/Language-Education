"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ExerciseCheckButtonProps = Omit<ComponentProps<typeof Button>, "variant">;

export function ExerciseCheckButton({
  className,
  ...props
}: ExerciseCheckButtonProps) {
  return (
    <Button variant="check" className={cn("gap-2", className)} {...props} />
  );
}
