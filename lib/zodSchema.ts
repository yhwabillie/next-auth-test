import { z } from 'zod'

//배송지 주소 관련
export const AddressFormSchema = z.object({
  idx: z.string().optional(),
  addressName: z.string().min(1, 'address_name 필요'),
  recipientName: z.string().min(1, 'recipient_name 필요'),
  phoneNumber: z.string().regex(/^010\d{8}$/, {
    message: 'Invalid phone number format',
  }),
  postcode: z.string().regex(/^[0-9]{5}$/, 'Invalid postcode'),
  addressLine1: z.string().min(1, 'addressLine1 필요'),
  addressLine2: z.string().min(1, 'addressLine2 필요'),
  deliveryNote: z.string().min(1, 'delivery_note 필요'),
})

export type AddressFormSchemaType = z.infer<typeof AddressFormSchema>

export const AddNewAddressFormSchema = z.object({
  idx: z.string().optional(),
  addressName: z.string().min(1, '최소 1자이상 작성해주세요.'),
  recipientName: z.string().min(1, '최소 1자이상 작성해주세요.'),
  phoneNumber: z.string().regex(/^010\d{8}$/, '-없이 작성해주세요'),
  new_postcode: z.string().regex(/^[0-9]{5}$/, '맞지 않는 우편번호 형식입니다.'),
  new_addressLine1: z.string().min(1, '최소 1자이상 작성해주세요.'),
  addressLine2: z.string().min(1, '최소 1자이상 작성해주세요.'),
  deliveryNote: z.string().min(1, 'delivery_note 필요'),
})

export type AddNewAddressFormSchemaType = z.infer<typeof AddNewAddressFormSchema>

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

export const OrderSchema = z.object({
  phoneNumber: z.string().regex(/^010\d{8}$/, {
    message: 'Invalid phone number format',
  }),
  payment: z.enum(['CREDIT_CARD', 'BANK_TRANSFER']),
  addressIdx: z.string(),
})

export type OrderSchemaType = z.infer<typeof OrderSchema>

export const ResetPwSchema = z
  .object({
    password: PasswordSchema(),
    password_confirm: z.string(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['password_confirm'],
  })

export type ResetPwSchemaType = z.infer<typeof ResetPwSchema>

export const ConFirmEmailSchema = z.object({
  email: z
    .string()
    .regex(/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, '이메일 형식에 맞게 공백을 제외하고 작성해주세요. (EX. test@test.com)'),
})

export type ConFirmEmailSchemaType = z.infer<typeof ConFirmEmailSchema>

export const AgreementSchema = z.object({
  service_agreement: z.boolean(),
  privacy_agreement: z.boolean(),
  selectable_agreement: z.boolean().optional(),
})

export type AgreementSchemaType = z.infer<typeof AgreementSchema>

const MAX_FILE_SIZE = 1024 * 1024 * 5
const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const ACCEPTED_IMAGE_TYPES = ['jpeg', 'jpg', 'png', 'webp']

export const SignUpSchema = z
  .object({
    profile_img: z.any(),
    // .refine((files) => {
    //   return files?.[0]?.size <= MAX_FILE_SIZE
    // }, `Max image size is 5MB.`)
    // .refine((files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type), 'Only .jpg, .jpeg, .png and .webp formats are supported.'),
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
