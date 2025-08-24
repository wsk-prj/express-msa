import { z } from "zod";

// 회원가입 스키마
export const SignupSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요").max(255, "이메일은 255자를 초과할 수 없습니다"),
  password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .max(20, "비밀번호는 20자를 초과할 수 없습니다")
    .regex(/^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/, "비밀번호는 소문자, 숫자, 특수문자를 포함해야 합니다"),
  nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다").max(10, "닉네임은 10자를 초과할 수 없습니다"),
});

// 로그인 스키마
export const LoginSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요").max(255, "이메일은 255자를 초과할 수 없습니다"),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다"),
});

// 이메일 중복 체크 스키마
export const CheckEmailSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요").max(255, "이메일은 255자를 초과할 수 없습니다"),
});

// 닉네임 중복 체크 스키마
export const CheckNicknameSchema = z.object({
  nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다").max(10, "닉네임은 10자를 초과할 수 없습니다"),
});

// 타입 추출
export type SignupDto = z.infer<typeof SignupSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type CheckEmailDto = z.infer<typeof CheckEmailSchema>;
export type CheckNicknameDto = z.infer<typeof CheckNicknameSchema>;
