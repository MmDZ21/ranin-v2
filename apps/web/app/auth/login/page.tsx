"use client";
import { login } from "@/lib/auth";
import React, { useActionState } from "react";
import SubmitButton from "../signup/SubmitButton";

export default function LoginPage() {
    const [state, action] = useActionState(login, undefined);
    return (
      <div>
        <h1>login</h1>
        <form action={action}>
          {state?.message && <p>{state.message}</p>}
          <input name="email" type="email" placeholder="email" />
          {state?.errors?.email && <p className="text-red-500">{state.errors.email}</p>}
          <input name="password" type="password" placeholder="password" />
          {state?.errors?.password && <p className="text-red-500">{state.errors.password}</p>}
          <SubmitButton />
        </form>
      </div>
    );
}
