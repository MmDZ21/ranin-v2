"use server";

import z from "zod";
import { FormState, LoginSchema, RegisterSchema } from "./types";
import { redirect } from "next/navigation";
import { API_URL } from "./constants";
import {
  createSession,
  deleteSession,
  getSession,
  updateTokens,
} from "./session";
import { revalidatePath } from "next/cache";

export async function signup(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedFields.data),
  });

  if (response.ok) {
    redirect("/auth/login");
  } else {
    return {
      message:
        response.status === 409
          ? "User already exists"
          : "Something went wrong" + response.status,
    };
  }
}

export async function login(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedFields.data),
  });
  
  console.log(`[Auth] Login response status: ${response.status}`);

  if (response.ok) {
    const data = await response.json();
    const { user, accessToken, refreshToken } = data;

    console.log("[Auth] Login successful, creating session...");

    await createSession({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken,
    });
    
    console.log("[Auth] Session created, redirecting to dashboard.");
    redirect("/dashboard");
  } else {
    return {
      message:
        response.status === 401
          ? "Invalid email or password"
          : "Something went wrong" + response.status,
    };
  }
}

export async function logout() {
  await deleteSession();
  revalidatePath("/");
  redirect("/");
}

export async function getProfile() {
  const session = await getSession();
  
  if (!session?.accessToken) {
    throw new Error("Unauthorized");
  }

  let response = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      "Authorization": `Bearer ${session.accessToken}`,
    },
  });

  if (response.status === 401) {
    if (!session?.refreshToken) {
      throw new Error("Unauthorized");
    }

    const newAccessToken = await refreshToken(session.refreshToken);
    if (!newAccessToken) {
      throw new Error("Failed to refresh token");
    }
    
    response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        "Authorization": `Bearer ${newAccessToken}`,
      },
    });
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
}

export const refreshToken = async (oldRefreshToken: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: oldRefreshToken }),
    });
    
    if (!response.ok) {
      await response.json().catch(() => ({}));
      throw new Error("Failed to refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } = await response.json();
    
    // Update tokens directly in session (server action context)
    // This is more efficient than using a separate API route
    await updateTokens({ 
      accessToken, 
      refreshToken: newRefreshToken 
    });
    
    return accessToken;
  } catch {
    // Don't log sensitive information
    return null;
  }
};
