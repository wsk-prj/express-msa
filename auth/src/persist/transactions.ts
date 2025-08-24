import { SignupDto } from "@/routes/auth/auth.schema";
import { db } from "@/libs/db";

export const tx = {
  /**
   * 회원가입 트랜잭션
   */
  signup({ email, password, nickname }: SignupDto) {
    return db.$transaction(async (tx) => {
      const dbUser = await tx.user.create({
        data: {
          nickname,
          tokenVersion: 0, // 초기 토큰 버전
        },
      });

      const dbAuth = await tx.auth.create({
        data: {
          email,
          password,
          userId: dbUser.id,
        },
      });

      return { user: dbUser, auth: dbAuth };
    });
  },
};
