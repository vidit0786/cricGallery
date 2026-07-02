import { getServerSession } from "next-auth";

import { authOptions } from "@/server/auth/auth-options";
import { AppError } from "@/utils/api-errors";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user?.id) {
    throw new AppError("You must be signed in to access this resource.", 401, "INVALID_REQUEST");
  }

  return user;
}
