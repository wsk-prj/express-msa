/**
 * @description HTTP Error class
 * @param message - 에러 메시지
 * @param details - 에러 상세 정보
 * @param status - HTTP 상태 코드
 * @param instance - 에러가 발생한 API 인스턴스
 */
export class HttpError extends Error {
  public status?: number;
  public details?: any;
  public instance?: string;

  constructor(message: string = "HTTP Error", details?: any, status?: number, instance?: string) {
    super();
    this.status = status;
    this.message = message;
    this.details = details;
    this.instance = instance;
  }
}
