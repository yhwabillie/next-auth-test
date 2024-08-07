'use client'

import { hasETCAddress, saveETCAddress } from '@/app/actions/address/actions'
import { ETCAddressSchema, ETCAddressSchemaType } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import DaumPostcodeEmbed from 'react-daum-postcode'
import { useForm } from 'react-hook-form'

export const Etc1AddressModal = (props: any) => {
  const { data: session } = useSession()
  const userIdx = session?.user?.idx
  const [hasETC, setHasETC] = useState(false)
  const [defaultData, setDefaultData] = useState<any>()
  const [initialData, setInitialData] = useState<any>(null)
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const {
    register,
    setValue,
    getValues,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ETCAddressSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(ETCAddressSchema),
  })

  const handleComplete = (data: any) => {
    let fullAddress = data.address
    let extraAddress = ''

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : ''
    }

    setValue('etc1_postcode', data.zonecode)
    setValue('etc1_addressLine1', fullAddress)
    setIsPostcodeOpen(false)
  }

  const fetchhasETCAddress = async () => {
    try {
      const response = await hasETCAddress(userIdx!)
      setHasETC(response.length > 0)
      setInitialData(response[0])
      setDefaultData(response[0])
      // reset(response[0])
    } catch (erorr) {
    } finally {
      setLoading(false)
    }
  }

  const onSubmitData = async (data: any) => {
    console.log(data)

    try {
      const response = await saveETCAddress(userIdx!, {
        recipientName: data.etc1_recipient_name,
        phoneNumber: data.etc1_phone_number,
        addressName: data.etc1_address_name,
        addressLine1: data.etc1_addressLine1,
        addressLine2: data.etc1_addressLine2,
        deliveryNote: data.etc1_delivery_note,
        postcode: data.etc1_postcode,
      })

      fetchhasETCAddress()
      reset()
      props.setIsModalOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitData)}>
        <h5 className="text-lg font-bold">추가 배송지 등록!</h5>

        <fieldset>
          <div>
            <label htmlFor="address_name">배송지명</label>
            <input {...register('etc1_address_name')} id="etc1_address_name" type="text" placeholder="배송지명을 입력하세요" />
          </div>

          <div>
            <label htmlFor="recipient_name">받는분</label>
            <input {...register('etc1_recipient_name')} id="etc1_recipient_name" type="text" placeholder="받는분을 입력하세요?" />
          </div>

          <div>
            <label htmlFor="phone_number">휴대폰 번호</label>
            <input {...register('etc1_phone_number')} id="etc1_phone_number" type="text" placeholder="휴대폰 번호 입력하세요" />
          </div>

          <div>
            <input {...register('etc1_postcode')} id="etc1_postcode" type="text" readOnly />
            <button type="button" onClick={() => setIsPostcodeOpen(true)}>
              찾기
            </button>
          </div>

          <div>
            <input {...register('etc1_addressLine1')} id="etc1_addressLine1" type="text" readOnly />
            <input {...register('etc1_addressLine2')} id="etc1_addressLine2" type="text" />

            <select {...register('etc1_delivery_note')} id="etc1_delivery_note">
              <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
              <option value="부재시 연락부탁드립니다">부재시 연락부탁드립니다</option>
              <option value="배송전 미리 연락해주세요">배송전 미리 연락해주세요</option>
            </select>
          </div>
        </fieldset>
        <button type="submit">추가 배송지 저장</button>
        <button
          type="button"
          onClick={() => {
            props.setIsModalOpen(false)
            reset()
          }}
        >
          닫기
        </button>
      </form>
      {isPostcodeOpen && <DaumPostcodeEmbed onComplete={handleComplete} autoClose={false} />}
    </>
  )
}
