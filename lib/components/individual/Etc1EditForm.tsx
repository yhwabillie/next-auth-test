'use client'

import { hasETCAddress, updateEtcAddress } from '@/app/actions/address/actions'
import { ETCAddressSchema, ETCAddressSchemaType } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export const Etc1EditForm = () => {
  const { data: session } = useSession()
  const userIdx = session?.user?.idx
  const [defaultData, setDefaultData] = useState<any>()
  const [isEdit, setIsEdit] = useState(false)
  const [hasETC, setHasETC] = useState<any>(false)
  const [ETCData, setETCData] = useState<any>()
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

  const fetchhasETCAddress = async () => {
    try {
      const response = await hasETCAddress(userIdx!)
      console.log('....받은거', response)
      setHasETC(response.length > 0)
      setDefaultData(response[0])
      // reset(response[0])
    } catch (erorr) {
    } finally {
      setLoading(false)
    }
  }

  const editDataSubmit = async (data: any) => {
    console.log(data)

    try {
      await updateEtcAddress(userIdx!, {
        recipientName: data.recipient_name,
        phoneNumber: data.phone_number,
        addressName: data.address_name,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        deliveryNote: data.delivery_note,
        postcode: data.postcode,
      })

      fetchhasETCAddress()
    } catch (error) {
    } finally {
      setIsEdit(false)
    }
  }

  const handleCancel = () => {
    if (initialData) {
      setDefaultData(initialData) // defaultData 상태를 초기 데이터로 리셋
      reset(initialData) // 폼을 초기 데이터로 리셋
      setIsEdit(false) // 편집 모드를 비활성화
    }
  }

  return (
    <div>
      <button
        onClick={() => {
          setValue('etc1_address_name', defaultData.addressName)
          setValue('etc1_recipient_name', defaultData.recipientName)
          setValue('etc1_phone_number', defaultData.phoneNumber)
          setValue('etc1_postcode', defaultData.postcode)
          setValue('etc1_addressLine1', defaultData.addressLine1)
          setValue('etc1_addressLine2', defaultData.addressLine2)
          setValue('etc1_delivery_note', defaultData.deliveryNote)
          setIsEdit(true)
        }}
      >
        수정
      </button>
      <form onSubmit={handleSubmit(editDataSubmit)}>
        <fieldset>
          <div>
            <label htmlFor="etc1_address_name">배송지명</label>
            <input
              {...register('etc1_address_name')}
              value={defaultData?.addressName}
              onChange={(event) => {
                const newValue = event.target.value
                setDefaultData((prevData: any) => ({
                  ...prevData,
                  addressName: newValue,
                }))
                setValue('etc1_address_name', newValue)
              }}
              id="address_name"
              type="text"
              placeholder="배송지명을 입력하세요"
              disabled={!isEdit}
            />
          </div>

          <div>
            <label htmlFor="recipient_name">받는분</label>
            <input
              {...register('etc1_recipient_name')}
              value={defaultData?.recipientName}
              onChange={(event) => {
                const newValue = event.target.value
                setDefaultData((prevData: any) => ({
                  ...prevData,
                  recipientName: newValue,
                }))
                setValue('etc1_recipient_name', newValue)
              }}
              id="recipient_name"
              type="text"
              placeholder="받는분을 입력하세요"
              disabled={!isEdit}
            />
          </div>

          <div>
            <label htmlFor="phone_number">휴대폰 번호</label>
            <input
              {...register('etc1_phone_number')}
              value={defaultData?.phoneNumber}
              onChange={(event) => {
                const newValue = event.target.value
                setDefaultData((prevData: any) => ({
                  ...prevData,
                  phoneNumber: newValue,
                }))
                setValue('etc1_phone_number', newValue)
              }}
              id="phone_number"
              type="text"
              placeholder="휴대폰 번호 입력하세요"
              disabled={!isEdit}
            />
          </div>

          <div>
            <input {...register('etc1_postcode')} value={defaultData?.postcode} id="postcode" type="text" readOnly disabled={!isEdit} />
            <button type="button" onClick={() => setIsPostcodeOpen(true)} disabled={!isEdit}>
              찾기
            </button>
          </div>

          <div>
            <input {...register('etc1_addressLine1')} value={defaultData?.addressLine1} id="addressLine1" type="text" readOnly disabled={!isEdit} />
            <input
              {...register('etc1_addressLine2')}
              value={defaultData?.addressLine2}
              onChange={(event) => {
                const newValue = event.target.value
                setDefaultData((prevData: any) => ({
                  ...prevData,
                  addressLine2: newValue,
                }))
                setValue('etc1_addressLine2', newValue)
              }}
              id="addressLine2"
              type="text"
              disabled={!isEdit}
            />

            <select
              {...register('etc1_delivery_note')}
              value={defaultData?.deliveryNote}
              onChange={(event) => {
                const newValue = event.target.value
                setDefaultData((prevData: any) => ({
                  ...prevData,
                  deliveryNote: newValue,
                }))
                setValue('etc1_delivery_note', newValue)
              }}
              id="delivery_note"
              disabled={!isEdit}
            >
              <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
              <option value="부재시 연락부탁드립니다">부재시 연락부탁드립니다</option>
              <option value="배송전 미리 연락해주세요">배송전 미리 연락해주세요</option>
            </select>
          </div>
        </fieldset>

        <button>저장</button>
        <button type="button" onClick={handleCancel}>
          취소
        </button>
      </form>
    </div>
  )
}
