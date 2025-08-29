import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "@/config";

/**
 * Auth Service 프록시
 */
export const authProxy = createProxyMiddleware({
  target: config.SERVICES.AUTH,
  changeOrigin: true,
  timeout: 5000,
  logLevel: "debug",
  onProxyReq: (proxyReq, req) => {
    console.log(`[PROXY] ${req.method} ${req.url} -> ${config.SERVICES.AUTH}${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[PROXY] Response: ${proxyRes.statusCode} for ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error("Auth Service Error:", err.message);
    console.error("Target URL:", config.SERVICES.AUTH);
    res.status(503).json({
      success: false,
      message: "Auth service unavailable",
    });
  },
});

/**
 * User Service 프록시
 */
export const userProxy = createProxyMiddleware({
  target: config.SERVICES.USER,
  changeOrigin: true,
  timeout: 5000,
  logLevel: "debug",
  onProxyReq: (proxyReq, req) => {
    console.log(`[PROXY] ${req.method} ${req.url} -> ${config.SERVICES.USER}${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[PROXY] Response: ${proxyRes.statusCode} for ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error("User Service Error:", err.message);
    console.error("Target URL:", config.SERVICES.USER);
    res.status(503).json({
      success: false,
      message: "User service unavailable",
    });
  },
});

/**
 * Store Service 프록시
 */
export const storeProxy = createProxyMiddleware({
  target: config.SERVICES.STORE,
  changeOrigin: true,
  timeout: 5000,
  logLevel: "debug",
  onProxyReq: (proxyReq, req) => {
    console.log(`[PROXY] ${req.method} ${req.url} -> ${config.SERVICES.STORE}${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[PROXY] Response: ${proxyRes.statusCode} for ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error("Store Service Error:", err.message);
    console.error("Target URL:", config.SERVICES.STORE);
    res.status(503).json({
      success: false,
      message: "Store service unavailable",
    });
  },
});
