"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";

export default function SubmitButton({
  children,
  pendingText = "در حال ارسال...",
}: {
  children: React.ReactNode;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? pendingText : children}
    </Button>
  );
}
