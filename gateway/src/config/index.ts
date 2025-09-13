import { getGatewayConfig } from "@msa/config-registry";

const baseConfig = getGatewayConfig();

export const config = {
  ...baseConfig,
  SERVICES: {
    AUTH: `http://127.0.0.1:${baseConfig.AUTH_SERVICE_PORT}`,
    USER: `http://127.0.0.1:${baseConfig.USER_SERVICE_PORT}`,
    STORE: `http://127.0.0.1:${baseConfig.STORE_SERVICE_PORT}`,
    ORDER: `http://127.0.0.1:${baseConfig.ORDER_SERVICE_PORT}`,
  },
};