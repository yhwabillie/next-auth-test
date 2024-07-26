import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import multer from 'multer'
import prisma from '@/lib/prisma'

// Multer 설정: 파일을 저장할 디렉토리와 파일명 설정
const upload = multer({ dest: 'uploads/' })

// Next.js API 라우트에서 Multer를 사용하려면 미들웨어 형태로 처리해야 합니다.
export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: NextRequest) {
  // 프론트에서 받은 formdata
  const formData = await request.formData()

  // FormData에서 'input_data' 키의 값을 가져옵니다.
  const inputDataEntry = formData.get('input_data')

  // profile_image
  const profileImageFile = formData.get('profile_image')

  if (!inputDataEntry) {
    return NextResponse.json({ error: 'input_data is required' }, { status: 400 })
  }

  // inputDataEntry가 파일인 경우 Blob으로 처리
  const inputDataText = typeof inputDataEntry === 'string' ? inputDataEntry : await (inputDataEntry as Blob).text()

  // JSON 데이터 파싱
  const inputData = JSON.parse(inputDataText)
  console.log('파싱 결과 =========>', inputData)

  // 비밀번호 해시 암호화
  const hashedPassword = bcrypt.hashSync(inputData.password, 10)

  try {
    const new_user = await prisma.user.create({
      data: {
        provider: 'credential',
        user_type: inputData.user_type,
        name: inputData.name,
        id: inputData.id,
        email: inputData.email,
        password: hashedPassword,
        service_agreement: inputData.service_agreement,
        privacy_agreement: inputData.privacy_agreement,
        selectable_agreement: inputData.selectable_agreement,
      },
    })

    const { password, ...infoWithOutPW } = new_user
    return NextResponse.json(infoWithOutPW)
  } catch (error) {
    throw new Error(`==========================> ${error}`)
  }
}
