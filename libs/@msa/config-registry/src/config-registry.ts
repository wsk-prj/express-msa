import dotenv from "dotenv";
import path from "path";
import {
  AuthServiceConfigSchema,
  UserServiceConfigSchema,
  StoreServiceConfigSchema,
  OrderServiceConfigSchema,
  GatewayConfigSchema,
  type ServiceConfig,
  type AuthServiceConfig,
  type UserServiceConfig,
  type StoreServiceConfig,
  type OrderServiceConfig,
  type GatewayConfig,
} from "./schema";

// 루트 디렉토리의 .env 파일 로드
const rootEnvPath = path.resolve(process.cwd(), "../../.env");
dotenv.config({ path: rootEnvPath });

class ConfigRegistry {
  private static instance: ConfigRegistry;
  private configs: Map<string, any> = new Map();

  private constructor() {}

  public static getInstance(): ConfigRegistry {
    if (!ConfigRegistry.instance) {
      ConfigRegistry.instance = new ConfigRegistry();
    }
    return ConfigRegistry.instance;
  }

  /**
   * 서비스별 설정 초기화
   */
  private initialize<T extends ServiceConfig>(serviceName: string, schema: any): T {
    if (this.configs.has(serviceName)) {
      return this.configs.get(serviceName);
    }

    try {
      // 스키마로 검증 및 파싱
      const validatedConfig = schema.parse(process.env);
      this.configs.set(serviceName, validatedConfig);

      console.log(`✅ Config initialized for ${serviceName}`);
      return validatedConfig as T;
    } catch (error) {
      console.error(`❌ Config validation failed for ${serviceName}:`, error);
      throw error;
    }
  }

  /**
   * Auth Service 설정
   */
  public getAuthConfig(): AuthServiceConfig & { PORT: string } {
    const config = this.initialize<AuthServiceConfig>("auth-service", AuthServiceConfigSchema);
    return { ...config, PORT: config.AUTH_SERVICE_PORT };
  }

  /**
   * User Service 설정
   */
  public getUserConfig(): UserServiceConfig & { PORT: string } {
    const config = this.initialize<UserServiceConfig>("user-service", UserServiceConfigSchema);
    return { ...config, PORT: config.USER_SERVICE_PORT };
  }

  /**
   * Store Service 설정
   */
  public getStoreConfig(): StoreServiceConfig & { PORT: string } {
    const config = this.initialize<StoreServiceConfig>("store-service", StoreServiceConfigSchema);
    return { ...config, PORT: config.STORE_SERVICE_PORT };
  }

  /**
   * Order Service 설정
   */
  public getOrderConfig(): OrderServiceConfig & { PORT: string } {
    const config = this.initialize<OrderServiceConfig>("order-service", OrderServiceConfigSchema);
    return { ...config, PORT: config.ORDER_SERVICE_PORT };
  }

  /**
   * Gateway 설정
   */
  public getGatewayConfig(): GatewayConfig & { PORT: string } {
    const config = this.initialize<GatewayConfig>("gateway", GatewayConfigSchema);
    return { ...config, PORT: config.GATEWAY_PORT };
  }

  /**
   * 설정 리셋 (테스트용)
   */
  public reset(): void {
    this.configs.clear();
  }
}

export const configRegistry = ConfigRegistry.getInstance();
