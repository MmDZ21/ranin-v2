"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/lib/auth";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "./SubmitButton";

export default function SignupForm() {
  const [state, action] = useActionState(signup, undefined);

  return (
    <Card>
      <CardHeader className="text-center">
        <h1 className="text-xl font-bold text-foreground">ایجاد حساب کاربری</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          برای ثبت‌نام، اطلاعات زیر را تکمیل کنید
        </p>
      </CardHeader>

      <CardBody>
        <form action={action} className="space-y-4">
          {state?.message && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">نام و نام خانوادگی</Label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="نام خود را وارد کنید"
            />
            {state?.errors?.name && (
              <p className="text-sm text-destructive">{state.errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">ایمیل</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="ایمیل خود را وارد کنید"
            />
            {state?.errors?.email && (
              <p className="text-sm text-destructive">{state.errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">رمز عبور</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="رمز عبور خود را وارد کنید"
            />
            {state?.errors?.password && (
              <p className="text-sm text-destructive">{state.errors.password}</p>
            )}
          </div>

          <SubmitButton pendingText="در حال ثبت‌نام...">ثبت‌نام</SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            وارد شوید
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}
