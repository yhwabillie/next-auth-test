import { z } from 'zod'

export const UserNameSchema = () => {
  return z.string().regex(/^[ㄱ-ㅎ가-힣]{2,8}$/g, '2자-8자 사이의 한글로 작성하세요 (공백, 특수문자 X)')
}

export const PasswordSchema = () => {
  return z
    .string()
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,15}$/,
      '8자-15자, 영문자 & 숫자 & 특수문자의 조합으로 작성해주세요. (공백 제외)',
    )
}

export const SignUpSchema = z
  .object({
    user_type: z.enum(['indivisual', 'admin']),
    name: UserNameSchema(),
    id: z.string().regex(/^[a-zA-Z]+[a-zA-Z0-9]{6,10}$/g, '6자-10자 사이 영문자로 시작하는 영문과 숫자의 조합으로 작성하세요 (공백, 특수문자 X)'),
    email: z
      .string()
      .regex(/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, '이메일 형식에 맞게 공백을 제외하고 작성해주세요. (EX. test@test.com)'),
    password: PasswordSchema(),
    password_confirm: z.string(),
    confirm_email: z.boolean().optional(),
    confirm_id: z.boolean().optional(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['password_confirm'],
  })

export type SignUpFormSchemaType = z.infer<typeof SignUpSchema>

export const SignInSchema = z.object({
  id: z.string().min(1, 'ID를 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
})

export type SignInFormSchemaType = z.infer<typeof SignInSchema>

export const AgreementSchema = z.object({
  service_agreement: z.boolean(),
  privacy_agreement: z.boolean(),
  selectable_agreement: z.boolean().optional(),
})

export type AgreementSchemaType = z.infer<typeof AgreementSchema>
