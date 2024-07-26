import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabaseClient'
import prisma from '@/lib/prisma'
require('dotenv').config()

// Next.js API 라우트에서 Multer를 사용하려면 미들웨어 형태로 처리해야 합니다.
export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: NextRequest) {
  // 프론트에서 받은 formData
  const formData = await request.formData()

  // formData - input_data
  const inputDataEntry = formData.get('input_data')

  if (!inputDataEntry) {
    return NextResponse.json({ error: 'input_data is required' }, { status: 400 })
  }

  // inputDataEntry가 파일인 경우 Blob으로 처리
  const inputDataText = typeof inputDataEntry === 'string' ? inputDataEntry : await (inputDataEntry as Blob).text()

  // input_data JSON 데이터 파싱
  const inputData = JSON.parse(inputDataText)
  console.log('파싱 결과 =========>', inputData)

  // 비밀번호 해시 암호화
  const hashedPassword = bcrypt.hashSync(inputData.password, 10)

  // formData - profile_image
  const profileImageFile = formData.get('profile_image')
  console.log('========>', profileImageFile)

  if (!profileImageFile) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const fileName = `${uuidv4()}-${inputData.id}`
  const { data, error } = await supabase.storage.from(process.env.NEXT_PUBLIC_PROJECT_DIR!).upload(fileName, profileImageFile, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    return NextResponse.json({ error: 'Supabase Storage Upload Error' }, { status: 500 })
  }

  if (!data) return
  const filePath = data.path
  console.log('========>', filePath)

  try {
    const new_user = await prisma.user.create({
      data: {
        provider: 'credential',
        user_type: inputData.user_type,
        name: inputData.name,
        id: inputData.id,
        email: inputData.email,
        password: hashedPassword,
        profile_img: filePath,
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
