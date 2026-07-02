import type { Metadata } from "next";
import { Suspense } from "react";

import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <section className="page-section grid min-h-[70vh] place-items-center py-14">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="rounded-3xl border border-white/10 bg-card/70 p-8 text-muted-foreground">Loading sign in...</div>}>
          <SignInForm />
        </Suspense>
      </div>
    </section>
  );
}
