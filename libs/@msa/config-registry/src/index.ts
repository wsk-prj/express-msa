export * from "./config-registry";
export * from "./schema";

// 편의 함수들
import { configRegistry } from "./config-registry";

/**
 * Auth Service용 설정 가져오기
 */
export const getAuthConfig = () => configRegistry.getAuthConfig();

/**
 * User Service용 설정 가져오기
 */
export const getUserConfig = () => configRegistry.getUserConfig();

/**
 * Store Service용 설정 가져오기
 */
export const getStoreConfig = () => configRegistry.getStoreConfig();

/**
 * Order Service용 설정 가져오기
 */
export const getOrderConfig = () => configRegistry.getOrderConfig();

/**
 * Gateway용 설정 가져오기
 */
export const getGatewayConfig = () => configRegistry.getGatewayConfig();
