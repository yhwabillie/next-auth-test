'use client'
import { hasDefaultAddress, saveDefaultAddress, updateDefaultAddress } from '@/app/actions/address/actions'
import { AddressSchema, AddressSchemaType } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import DaumPostcode from 'react-daum-postcode'
import { FieldValues, useForm } from 'react-hook-form'

export const AddressInfoTab = () => {
  const { data: session } = useSession()
  const userIdx = session?.user?.idx
  const [postcode, setPostcode] = useState('')
  const [address, setAddress] = useState('')
  const [hasDefault, setHasDefault] = useState(false)
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [defaultData, setDefaultData] = useState<any>()
  const [initialData, setInitialData] = useState<any>(null)
  const [isEdit, setIsEdit] = useState(false)
  const {
    register,
    setValue,
    getValues,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(AddressSchema),
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

    setValue('postcode', data.zonecode)
    setValue('addressLine1', fullAddress)
    setDefaultData((prevData: any) => ({
      ...prevData,
      postcode: data.zonecode,
    }))
    setDefaultData((prevData: any) => ({
      ...prevData,
      addressLine1: fullAddress,
    }))
    setIsPostcodeOpen(false)
  }

  const onSubmitData = async (data: any) => {
    console.log(data)

    try {
      const response = await saveDefaultAddress(userIdx!, {
        recipientName: data.recipient_name,
        phoneNumber: data.phone_number,
        addressName: data.address_name,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        deliveryNote: data.delivery_note,
        postcode: data.postcode,
      })

      fetchhasDefaultAddress()
    } catch (error) {
      console.log(error)
    }
  }

  const fetchhasDefaultAddress = async () => {
    try {
      const response = await hasDefaultAddress(userIdx!)
      setHasDefault(response.length > 0)
      setInitialData(response[0])
      setDefaultData(response[0])
      reset(response[0])
    } catch (erorr) {
    } finally {
      setLoading(false)
    }
  }

  const editDataSubmit = async (data: any) => {
    console.log(data)

    try {
      await updateDefaultAddress(userIdx!, {
        recipientName: data.recipient_name,
        phoneNumber: data.phone_number,
        addressName: data.address_name,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        deliveryNote: data.delivery_note,
        postcode: data.postcode,
      })

      fetchhasDefaultAddress()
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

  useEffect(() => {
    fetchhasDefaultAddress()
  }, [])

  return (
    <>
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {hasDefault ? (
              <>
                <div>
                  <button
                    onClick={() => {
                      setValue('address_name', defaultData.addressName)
                      setValue('recipient_name', defaultData.recipientName)
                      setValue('phone_number', defaultData.phoneNumber)
                      setValue('postcode', defaultData.postcode)
                      setValue('addressLine1', defaultData.addressLine1)
                      setValue('addressLine2', defaultData.addressLine2)
                      setValue('delivery_note', defaultData.deliveryNote)
                      setIsEdit(true)
                    }}
                  >
                    수정
                  </button>
                  <form onSubmit={handleSubmit(editDataSubmit)}>
                    <fieldset>
                      <div>
                        <label htmlFor="address_name">배송지명</label>
                        <input
                          {...register('address_name')}
                          value={defaultData?.addressName}
                          onChange={(event) => {
                            const newValue = event.target.value
                            setDefaultData((prevData: any) => ({
                              ...prevData,
                              addressName: newValue,
                            }))
                            setValue('address_name', newValue)
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
                          {...register('recipient_name')}
                          value={defaultData?.recipientName}
                          onChange={(event) => {
                            const newValue = event.target.value
                            setDefaultData((prevData: any) => ({
                              ...prevData,
                              recipientName: newValue,
                            }))
                            setValue('recipient_name', newValue)
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
                          {...register('phone_number')}
                          value={defaultData?.phoneNumber}
                          onChange={(event) => {
                            const newValue = event.target.value
                            setDefaultData((prevData: any) => ({
                              ...prevData,
                              phoneNumber: newValue,
                            }))
                            setValue('phone_number', newValue)
                          }}
                          id="phone_number"
                          type="text"
                          placeholder="휴대폰 번호 입력하세요"
                          disabled={!isEdit}
                        />
                      </div>

                      <div>
                        <input {...register('postcode')} value={defaultData?.postcode} id="postcode" type="text" readOnly disabled={!isEdit} />
                        <button type="button" onClick={() => setIsPostcodeOpen(true)} disabled={!isEdit}>
                          찾기
                        </button>
                      </div>

                      <div>
                        <input
                          {...register('addressLine1')}
                          value={defaultData?.addressLine1}
                          id="addressLine1"
                          type="text"
                          readOnly
                          disabled={!isEdit}
                        />
                        <input
                          {...register('addressLine2')}
                          value={defaultData?.addressLine2}
                          onChange={(event) => {
                            const newValue = event.target.value
                            setDefaultData((prevData: any) => ({
                              ...prevData,
                              addressLine2: newValue,
                            }))
                            setValue('addressLine2', newValue)
                          }}
                          id="addressLine2"
                          type="text"
                          disabled={!isEdit}
                        />

                        <select
                          {...register('delivery_note')}
                          value={defaultData?.deliveryNote}
                          onChange={(event) => {
                            const newValue = event.target.value
                            setDefaultData((prevData: any) => ({
                              ...prevData,
                              deliveryNote: newValue,
                            }))
                            setValue('delivery_note', newValue)
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
              </>
            ) : (
              <form onSubmit={handleSubmit(onSubmitData)}>
                <h5 className="text-lg font-bold">기본 배송지 등록!</h5>

                <fieldset>
                  <div>
                    <label htmlFor="address_name">배송지명</label>
                    <input {...register('address_name')} id="address_name" type="text" placeholder="배송지명을 입력하세요" />
                  </div>

                  <div>
                    <label htmlFor="recipient_name">받는분</label>
                    <input {...register('recipient_name')} id="recipient_name" type="text" placeholder="받는분을 입력하세요?" />
                  </div>

                  <div>
                    <label htmlFor="phone_number">휴대폰 번호</label>
                    <input {...register('phone_number')} id="phone_number" type="text" placeholder="휴대폰 번호 입력하세요" />
                  </div>

                  <div>
                    <input {...register('postcode')} id="postcode" type="text" readOnly />
                    <button type="button" onClick={() => setIsPostcodeOpen(true)}>
                      찾기
                    </button>
                  </div>

                  <div>
                    <input {...register('addressLine1')} id="addressLine1" type="text" readOnly />
                    <input {...register('addressLine2')} id="addressLine2" type="text" />

                    <select {...register('delivery_note')} id="delivery_note">
                      <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
                      <option value="부재시 연락부탁드립니다">부재시 연락부탁드립니다</option>
                      <option value="배송전 미리 연락해주세요">배송전 미리 연락해주세요</option>
                    </select>
                  </div>
                </fieldset>
                <button type="submit">기본배송지 저장</button>
              </form>
            )}
          </>
        )}
      </div>
      {isPostcodeOpen && <DaumPostcode onComplete={handleComplete} autoClose={false} />}
    </>
  )
}
