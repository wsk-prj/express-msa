import { getStoreConfig } from "@msa/config-registry";

const baseConfig = getStoreConfig();

export const config = {
  ...baseConfig,
  ROUTER_PREFIX: "/api",
};