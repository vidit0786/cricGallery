import { redirect } from "next/navigation";

import { getCurrentUser } from "@/server/auth/session";

export async function requirePageUser() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/auth/sign-in");
  return user;
}
