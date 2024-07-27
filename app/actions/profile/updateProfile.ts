'use server'
import prisma from '@/lib/prisma'

interface UpdateUsernameParams {
  idx: string
  new_name: string
}

export const updateUserName = async ({ idx, new_name }: UpdateUsernameParams) => {
  try {
    const user = await prisma.user.update({
      where: {
        idx: idx,
      },
      data: {
        name: new_name,
      },
    })

    return { success: true, user }
  } catch (error) {
    console.log(error)
    return { success: false, error: 'Failed to update username' }
  }
}

interface UpdateUserAgreementParams {
  idx: string
  selectable_agreement: boolean
}

export const updateUserAgreement = async ({ idx, selectable_agreement }: UpdateUserAgreementParams) => {
  try {
    const user = await prisma.user.update({
      where: {
        idx: idx,
      },
      data: {
        selectable_agreement: selectable_agreement,
      },
      select: {
        selectable_agreement: true,
      },
    })

    console.log(user, '////')

    return { success: true, user }
  } catch (error) {
    console.log(error)
    return { success: false, error: 'Failed to update agreements' }
  }
}
