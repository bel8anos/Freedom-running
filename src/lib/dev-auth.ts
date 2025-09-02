// Development authentication bypass utilities
// SECURITY WARNING: This should NEVER be used in production!

export const isDevelopment = process.env.NODE_ENV === "development";
// Support public flag for client-side evaluation to avoid SSR/CSR mismatches
const clientFlag =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_DISABLE_AUTH === "true"
    : false;
export const isAuthDisabled =
  isDevelopment && (process.env.DISABLE_AUTH === "true" || clientFlag);

export const getDevUser = () => {
  if (!isAuthDisabled) return null;

  return {
    id: "dev-user-123",
    name: process.env.DEV_USER_NAME || "Development User",
    email: process.env.DEV_USER_EMAIL || "dev@freedomrunning.dev",
    image: null,
    role: (process.env.DEV_USER_ROLE as "admin" | "user") || "admin",
  };
};

export const createMockSession = () => {
  if (!isAuthDisabled) return null;

  const devUser = getDevUser()!;

  return {
    user: devUser,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
  };
};

// Security check - ensures this can't accidentally run in production
if (
  process.env.NODE_ENV === "production" &&
  process.env.DISABLE_AUTH === "true"
) {
  console.warn(
    "🚨 SECURITY WARNING: DISABLE_AUTH is enabled in production! This is a security risk."
  );
}
