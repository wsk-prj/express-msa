import { getAuthConfig } from "@msa/config-registry";

const baseConfig = getAuthConfig();

export const config = {
  ...baseConfig,
  ROUTER_PREFIX: "/api",

  // Cookie Configuration
  REFRESH_TOKEN_COOKIE_NAME: "refreshToken",
  COOKIE_OPTIONS: {
    path: "/",
    secure: baseConfig.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict" as const,
  },
};
