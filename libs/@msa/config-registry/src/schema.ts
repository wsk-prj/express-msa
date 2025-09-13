import { z } from "zod";

// 기본 공통 설정
const BaseConfigSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// 서비스 포트 설정
const ServicePortsSchema = z.object({
  GATEWAY_PORT: z.string().default("4000"),
  AUTH_SERVICE_PORT: z.string().default("4001"),
  USER_SERVICE_PORT: z.string().default("4002"),
  STORE_SERVICE_PORT: z.string().default("4003"),
  ORDER_SERVICE_PORT: z.string().default("4004"),
});

// JWT 설정
const JWTConfigSchema = z.object({
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.coerce.number().default(900), // ms
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
  JWT_REFRESH_EXPIRES_IN: z.coerce.number().default(7200), // ms
  JWT_REFRESH_REGENERATE_THRESHOLD: z.coerce.number().default(1800), // ms
});

// Redis 설정
const RedisConfigSchema = z.object({
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().default(""),
  REDIS_DB: z.coerce.number().default(0),
});

// 서비스별 설정 스키마
export const GatewayConfigSchema = BaseConfigSchema.merge(ServicePortsSchema);

export const BaseServiceConfigSchema = BaseConfigSchema.merge(ServicePortsSchema)
  .merge(JWTConfigSchema)
  .merge(RedisConfigSchema);

export const AuthServiceConfigSchema = BaseServiceConfigSchema.extend({
  SERVICE_NAME: z.string().default("auth-service"),
});

export const UserServiceConfigSchema = BaseServiceConfigSchema.extend({
  SERVICE_NAME: z.string().default("user-service"),
});

export const StoreServiceConfigSchema = BaseServiceConfigSchema.extend({
  SERVICE_NAME: z.string().default("store-service"),
});

export const OrderServiceConfigSchema = BaseServiceConfigSchema.extend({
  SERVICE_NAME: z.string().default("order-service"),
});

// 타입 정의
export type GatewayConfig = z.infer<typeof GatewayConfigSchema>;
export type AuthServiceConfig = z.infer<typeof AuthServiceConfigSchema>;
export type UserServiceConfig = z.infer<typeof UserServiceConfigSchema>;
export type StoreServiceConfig = z.infer<typeof StoreServiceConfigSchema>;
export type OrderServiceConfig = z.infer<typeof OrderServiceConfigSchema>;

export type ServiceConfig = GatewayConfig | AuthServiceConfig | UserServiceConfig | StoreServiceConfig | OrderServiceConfig;
