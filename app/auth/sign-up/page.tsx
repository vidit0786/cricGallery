import type { Metadata } from "next";

import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <section className="page-section grid min-h-[70vh] place-items-center py-14">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </section>
  );
}
