import { getUserConfig } from "@msa/config-registry";

const baseConfig = getUserConfig();

export const config = {
  ...baseConfig,
  ROUTER_PREFIX: "/api",
};
