"use client";
import React from "react";
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}
