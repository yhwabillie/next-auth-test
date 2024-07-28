'use server'
import prisma from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabaseClient'

//사용자 프로필 이미지 업데이트
export const updateUserProfile = async (id: string, new_profile?: FormData) => {
  if (!new_profile) return new Error('프론트에서 업데이트 이미지를 받지못했습니다.')
  console.log(new_profile)

  const profileImageEntry = new_profile.get('profile_img')

  // 최종 저장 프로필 이미지 변수
  let profile_img_result

  // 기본 제공 프로필 이미지를 사용하는 경우 undefined
  if (profileImageEntry === 'undefined') {
    profile_img_result = profileImageEntry
    console.log('기본 프로필 사용 ========>', profile_img_result)
  } else if (profileImageEntry) {
    // 별도 프로필 이미지 사용하는 경우, supabase publicUrl 생성
    const fileName = `${uuidv4()}-${id}`
    const { data, error } = await supabase.storage.from(process.env.NEXT_PUBLIC_PROJECT_DIR!).upload(fileName, profileImageEntry, {
      cacheControl: '3600',
      upsert: false,
    })

    if (error) throw Error('Supabase Storage 업로드 에러입니다.')

    const filePath = data.path
    console.log('========>', filePath)

    const profileImg = supabase.storage.from(process.env.NEXT_PUBLIC_PROJECT_DIR!).getPublicUrl(`${filePath}`)
    console.log('========>', profileImg.data.publicUrl)

    profile_img_result = profileImg.data.publicUrl
    console.log('별도 프로필 사용 ========>', profile_img_result)
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        profile_img: profile_img_result,
      },
    })

    return user.profile_img
  } catch (error) {
    throw new Error('프로필 이미지 업로드에 실패했습니다. 다시 시도해주세요.')
  }
}

//사용자 이름 업데이트
export const updateUserName = async (idx: string, new_name: string) => {
  try {
    const user = await prisma.user.update({
      where: {
        idx: idx,
      },
      data: {
        name: new_name,
      },
    })

    return user
  } catch (error) {
    console.log(error)
    throw new Error(`사용자 이름 업데이트에 실패했습니다. 다시 시도해주세요.`)
  }
}

//사용자 정보 동의서 업데이트
interface UpdateUserAgreementParams {
  idx: string
  selectable_agreement: boolean
}

export const updateUserAgreement = async ({ idx, selectable_agreement }: UpdateUserAgreementParams) => {
  try {
    const user = await prisma.user.update({
      where: {
        idx,
      },
      data: {
        selectable_agreement,
      },
    })

    // 필요하지 않은 사용자 데이터 로그 생략
    console.log('User agreement updated for user with idx:', idx)

    return { success: true, user }
  } catch (error) {
    console.log(error)
    return { success: false, error: 'Failed to update agreements' }
  }
}
