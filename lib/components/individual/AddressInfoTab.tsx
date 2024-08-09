'use client'
import { createNewAddress, fetchAddressList, hasDefaultAddress, removeAddress, setDefaultAddress } from '@/app/actions/address/actions'
import { AddressFormSchema, AddressFormSchemaType } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import DaumPostcodeEmbed from 'react-daum-postcode'
import { useForm } from 'react-hook-form'
import { Button } from '../Button'
import { useAddressStore, useModalStore } from '@/lib/zustandStore'
import { toast } from 'sonner'
import { AddressUpdateForm } from './AddressUpdateForm'
import { TabContentSkeleton } from './TabContentSkeleton'
import { EmptyAddress } from './EmptyAddress'
import { AddressAddForm } from './AddressAddForm'

export const AddressInfoTab = () => {
  const { data: session, update, status } = useSession()
  const [data, setData] = useState<any[]>([])
  // const [updateData, setUpdateData] = useState<any[]>([])

  const { setIsPostcodeOpen, updateData, postcode, addressLine1 } = useAddressStore()
  const [loading, setLoading] = useState(true)
  const userIdx = session?.user?.idx
  const [showForm, setShowForm] = useState(false)
  const [showUpdateForm, setshowUpdateForm] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    getValues,
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

      setData(fetchedCartList)
      setIsEmpty(fetchedCartList.length === 0)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  /**
   * 클릭한 주소 삭제
   */
  const handleRemoveAddress = async (addressIdx: string) => {
    try {
      const response = await removeAddress(addressIdx, userIdx!)

      if (!response) {
        toast.error('주소 삭제에 실패했습니다.')
      }

      fetchData()
      toast.success('주소를 삭제했습니다.')
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 신규 배송지 추가
   */
  const handleSubmitAddress = async (data: any) => {
    console.log(data, '///')
    try {
      const response = await createNewAddress(userIdx!, data, isEmpty)
      console.log(response)
      fetchData()
      reset()
      setShowForm(false)
      toast.success('배송지가 추가되었습니다.')
    } catch (error) {
    } finally {
    }
  }

  /**
   * 클릭한 배송지를 기본 배송지로 변경
   */
  const handleClickSetDefault = async (addressIdx: string) => {
    try {
      const response = await setDefaultAddress(userIdx!, addressIdx)

      if (!response?.success) {
        toast.error('주소 삭제에 실패했습니다.')
      }

      fetchData()
      toast.success('기본 배송지가 변경되었습니다.')
    } catch (error) {}
  }

  const handleClickShowForm = () => setShowForm(true)

  const handleClickHideForm = () => {
    setShowForm(false)
    reset()
  }

  const handleFindPostcode = () => {
    setIsPostcodeOpen(true)
  }

  useEffect(() => {
    fetchData()

    setValue('postcode', postcode)
    setValue('addressLine1', addressLine1)
  }, [postcode, addressLine1])

  if (loading) return <TabContentSkeleton />

  return (
    <>
      {data.length === 0 && <EmptyAddress handleClick={{ handleShowForm: handleClickShowForm }} />}

      {showForm && (
        <AddressAddForm
          setValue={{ method: setValue }}
          register={{ method: register }}
          onSubmit={{ handleSubmitData: handleSubmit(handleSubmitAddress) }}
          onClickHandlers={{ handleShowForm: handleClickHideForm, handleShowModal: handleFindPostcode }}
        />
      )}

      {data.map((item, index) => (
        <div key={index} className="mb-16 last:mb-0">
          <fieldset key={index} className="mb-5">
            <h5 className="mb-4 border-b-2 border-blue-500 pb-2 text-lg font-semibold">{item.isDefault ? '기본 배송지' : `기타 배송지 ${index}`}</h5>
            <div className="mb-2 py-2">
              <legend>배송지 이름</legend>
              <input type="text" value={item.addressName} className="border border-black p-2" readOnly />
            </div>
            <div className="mb-2 py-2">
              <legend>수령자</legend>
              <input type="text" value={item.recipientName} className="border border-black p-2" readOnly />
            </div>
            <div className="mb-2 py-2">
              <legend>연락처</legend>
              <input type="text" value={item.phoneNumber} className="border border-black p-2" readOnly />
            </div>
            <div className="py-2">
              <legend>주소</legend>
              <input type="text" value={item.addressLine1} className="mb-2 w-full border border-black p-2" readOnly />
              <input type="text" value={item.addressLine2} className="w-full border border-black p-2" readOnly />
            </div>
          </fieldset>
          <ul className="flex flex-row gap-4">
            <li>
              <button
                type="button"
                onClick={() => {
                  setshowUpdateForm(true)

                  const target = data.filter((datItem) => datItem.idx === item.idx)
                  updateData(target[0])
                }}
                className="w-[100px] bg-blue-400 p-4"
              >
                수정하기
              </button>
            </li>
            <li>
              <button type="button" onClick={() => handleRemoveAddress(item.idx)} className="w-[100px] bg-pink-400 p-4">
                삭제하기
              </button>
            </li>
            {!item.isDefault && (
              <li>
                <button type="button" onClick={() => handleClickSetDefault(item.idx)} className="w-[200px] bg-green-400 p-4">
                  기본배송지로 선택
                </button>
              </li>
            )}
          </ul>
        </div>
      ))}

      {showUpdateForm && (
        <AddressUpdateForm
          updateData={updateData}
          setUpdateData={updateData}
          handleClose={() => {
            setshowUpdateForm(false)
            updateData([])
          }}
          setIsPostcodeOpen={setIsPostcodeOpen}
          userIdx={userIdx}
          fetchData={fetchData}
        />
      )}
    </>
  )
}
