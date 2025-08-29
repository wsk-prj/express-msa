import { eventBus, UserSignupEvent } from "@msa/shared";

// 사용자 생성 이벤트 발행
export const publishSignupEvent = async (event: UserSignupEvent): Promise<void> => {
  await eventBus.publish("user.signup", event);
  console.log("📧 User signup event published:", event);
};
