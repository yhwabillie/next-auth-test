'use client'
import { SessionProvider, useSession } from 'next-auth/react'
import { useAddressFormStore, useAddressStore, useDefaultAddressStore, useModalStore } from '../zustandStore'
import clsx from 'clsx'
import { PostCodeModal } from './individual/PostCodeModal'
import { AddressAddForm } from './individual/AddressAddForm'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AddressFormSchema, AddressFormSchemaType } from '../zodSchema'
import { useEffect } from 'react'
import { createNewAddress, fetchAddressList } from '@/app/actions/address/actions'
import { toast } from 'sonner'

interface ProvidersProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: ProvidersProps) => {
  const { modalState, setModalState } = useModalStore()
  const { isPostcodeOpen, setIsPostcodeOpen, postcode, addressLine1, updateData } = useAddressStore()
  const { showForm, hideForm } = useAddressFormStore()
  const { setDefaultState, defaultState } = useDefaultAddressStore()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddressFormSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(AddressFormSchema),
  })

  // const handleSubmitAddress = async (data: any) => {
  //   console.log('Form Data:', data)

  //   try {
  //     const response = await createNewAddress(userIdx!, data, defaultState)
  //     console.log(response)
  //     // fetchData()
  //     // reset()

  //     toast.success('배송지가 추가되었습니다.')
  //   } catch (error) {
  //   } finally {
  //   }
  // }

  return (
    <SessionProvider>
      <body
        className={clsx('bg-gray-200', {
          'overflow-hidden': modalState,
        })}
      >
        {children}

        {isPostcodeOpen && <PostCodeModal />}
      </body>
    </SessionProvider>
  )
}
