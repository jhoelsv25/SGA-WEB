import * as React from "react";
import { AuthSlider, LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen w-full grid-cols-1 overflow-hidden lg:grid-cols-12">
      <section className="relative hidden lg:col-span-7 lg:flex">
        <AuthSlider />
      </section>

      <section className="border-border/50 bg-background flex flex-col justify-center border-l shadow-xs lg:col-span-5">
        <LoginForm />
      </section>
    </main>
  );
}
