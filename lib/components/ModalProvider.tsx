'use client'

import { useForm } from 'react-hook-form'
import { AddressFormSchema, AddressFormSchemaType } from '../zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAddressFormStore, useAddressStore, useDefaultAddressStore, useModalStore } from '../zustandStore'
import { AddressAddForm } from './individual/AddressAddForm'
import { createNewAddress, fetchAddressList } from '@/app/actions/address/actions'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

interface ModalProviderProps {
  children: React.ReactNode
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const { data: session, update, status } = useSession()
  const userIdx = session?.user?.idx
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

  /**
   * 사용자 배송지 리스트 fetch
   */
  const fetchData = async () => {
    try {
      const fetchedCartList = await fetchAddressList(userIdx!)

      updateData(fetchedCartList)

      setDefaultState(fetchedCartList.length === 0)
    } catch (error) {
    } finally {
    }
  }

  const handleSubmitAddress = async (data: any) => {
    console.log('Form Data:', data)

    try {
      const response = await createNewAddress(userIdx!, data, defaultState)
      console.log(response)
      fetchData()
      reset()

      toast.success('배송지가 추가되었습니다.')
      hideForm()
      setModalState(false)
    } catch (error) {
    } finally {
    }
  }

  useEffect(() => {
    setValue('addressLine1', addressLine1)
    setValue('postcode', postcode)
  }, [addressLine1, postcode])

  return (
    <div>
      {children}

      {showForm && (
        <AddressAddForm
          formRegister={{ method: register }}
          onSubmitForm={{ function: handleSubmit(handleSubmitAddress) }}
          onActions={{
            onHideForm: () => {
              hideForm()
              setModalState(false)
            },
            onShowPostcodeModal: () => setIsPostcodeOpen(true),
          }}
        />
      )}
    </div>
  )
}
