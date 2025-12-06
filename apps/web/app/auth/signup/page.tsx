"use client";
import React, { useActionState } from "react";
import SubmitButton from "./SubmitButton";
import { signup } from "@/lib/auth";

export default function SignupPage() {
  const [state, action] = useActionState(signup, undefined);
  return (
    <div>
      <h1>sign up</h1>
      <form action={action}>
        {state?.message && <p>{state.message}</p>}
        <input name="name" type="text" placeholder="name" />
        {state?.errors?.name && <p className="text-red-500">{state.errors.name}</p>}
        <input name="email" type="email" placeholder="email" />
        {state?.errors?.email && <p className="text-red-500">{state.errors.email}</p>}
        <input name="password" type="password" placeholder="password" />
        {state?.errors?.password && <p className="text-red-500">{state.errors.password}</p>}
        <SubmitButton />
      </form>
    </div>
  );
}
