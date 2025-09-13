import { getOrderConfig } from "@msa/config-registry";

const baseConfig = getOrderConfig();

export const config = {
  ...baseConfig,
  ROUTER_PREFIX: "/api",
};
