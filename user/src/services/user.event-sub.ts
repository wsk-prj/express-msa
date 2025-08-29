import { eventBus, UserSignupEvent } from "@msa/shared";
import { userService } from "@/services/user.service";

// 이벤트 구독 설정
export const setupEventSubscriptions = async () => {
  await eventBus.subscribe("user.signup", async (event: UserSignupEvent) => {
    console.log("📧 User signup event received:", event);

    await userService.createProfile(event.userId);
    console.log("✅ User profile created:", event.userId);
  });

  console.log("✅ Event subscriptions setup complete");
};
