import { getSession } from "./session";

export async function requireAdminSession() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}
