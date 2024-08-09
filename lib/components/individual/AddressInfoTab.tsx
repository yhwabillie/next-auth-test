'use client'
import { createNewAddress, fetchAddressList, hasDefaultAddress, removeAddress, setDefaultAddress } from '@/app/actions/address/actions'
import { AddressFormSchema, AddressFormSchemaType } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import DaumPostcodeEmbed from 'react-daum-postcode'
import { IoIosArrowDown } from 'react-icons/io'
import { useForm } from 'react-hook-form'
import { Button } from '../Button'
import { useAddressFormStore, useAddressStore, useDefaultAddressStore, useModalStore } from '@/lib/zustandStore'
import { toast } from 'sonner'
import { AddressUpdateForm } from './AddressUpdateForm'
import { TabContentSkeleton } from './TabContentSkeleton'
import { EmptyAddress } from './EmptyAddress'
import { AddressAddForm } from './AddressAddForm'
import { FaCaretDown, FaPlus } from 'react-icons/fa'

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
  const { showFormComponent } = useAddressFormStore()
  const { modalState, setModalState } = useModalStore()
  const { setDefaultState } = useDefaultAddressStore()

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
      setDefaultState(fetchedCartList.length === 0)
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

  const handleFindPostcode = () => setIsPostcodeOpen(true)
  const handleClickShowForm = () => setShowForm(true)

  const handleClickHideForm = () => {
    setShowForm(false)
    reset()
  }

  useEffect(() => {
    fetchData()

    setValue('postcode', postcode)
    setValue('addressLine1', addressLine1)
  }, [postcode, addressLine1])

  if (loading) return <TabContentSkeleton />

  const default_address = data.filter((item) => item.isDefault === true)
  const etc_address = data.filter((item) => item.isDefault === false)

  function formatPhoneNumber(phoneNumber: number) {
    // 숫자만 추출
    const cleaned = ('' + phoneNumber).replace(/\D/g, '')

    // 길이에 따라 포맷팅
    let match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/)

    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`
    }

    return phoneNumber // 유효하지 않으면 원래 값 반환
  }

  return (
    <>
      {isEmpty ? (
        <EmptyAddress
          handleClick={{
            handleShowForm: () => {
              showFormComponent()
              setModalState(true)
            },
          }}
        />
      ) : (
        <>
          <button
            onClick={showFormComponent}
            className="mb-2 ml-auto flex w-[200px] items-center justify-center gap-2 rounded-lg bg-blue-400 p-4 text-white drop-shadow-md transition-all duration-150 ease-in-out hover:bg-blue-500"
          >
            <FaPlus className="text-lg" />
            <span className="text-sm font-semibold">배송지 신규입력</span>
          </button>

          <section className="mb-16 last:mb-0">
            <div className="">
              <h5 className="mb-3 block w-fit rounded-md bg-gray-100 p-2 text-xs font-bold text-gray-500">기본 배송지</h5>

              {default_address.length === 0 && (
                <p className="mb-10 text-center text-gray-500">
                  <span className="mb-2 block">입력된 기본 배송정보가 없습니다</span>
                  <strong className="block text-2xl">🚚 기본 배송지를 추가해주세요.</strong>
                </p>
              )}

              <ul className="mb-10 rounded-lg bg-blue-200/70 p-5 drop-shadow-sm">
                {default_address.map((item, index) => (
                  <li key={index} className="relative">
                    <strong className="mb-1 block">{`${item.addressName} (${item.recipientName})`}</strong>
                    <p className="mb-2 font-medium text-gray-500">{formatPhoneNumber(item.phoneNumber)}</p>
                    <p className="mb-4 tracking-tighter">{`(${item.postcode}) ${item.addressLine1} ${item.addressLine2}`}</p>
                    <div className="relative mb-4 w-fit">
                      <IoIosArrowDown className="absolute right-2 top-[50%] z-0 translate-y-[-50%] text-xl" />
                      <select disabled className="w-[300px] rounded-md border border-gray-400 px-4 py-3 text-sm disabled:bg-gray-100">
                        <option className="text-gray-500">{item.deliveryNote}</option>
                      </select>
                    </div>
                    <div className="flex flex-row gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setshowUpdateForm(true)

                          const target = data.filter((datItem) => datItem.idx === item.idx)
                          updateData(target[0])
                        }}
                        className="block w-[60px] rounded-md border border-gray-400 bg-green-100 p-2 text-xs font-bold text-gray-700 hover:bg-green-200"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveAddress(item.idx)}
                        className="block w-[60px] rounded-md border border-gray-400 bg-pink-100 p-2 text-xs font-bold text-gray-700 hover:bg-pink-200"
                      >
                        삭제
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="mb-3 block w-fit rounded-md bg-gray-100 p-2 text-xs font-bold text-gray-500">기타 배송지</h5>

              {etc_address.length === 0 && (
                <p className="mb-10 rounded-lg bg-gray-100 px-10 py-14 text-center text-gray-500">
                  <span className="mb-2 block">입력된 기타 배송정보가 없습니다</span>
                  <strong className="block text-2xl">🚚 기타 배송지를 추가해주세요.</strong>
                </p>
              )}

              <ul>
                {etc_address.map((item, index) => (
                  <li key={index} className="relative mb-5 rounded-lg bg-blue-200/30 p-5 drop-shadow-sm">
                    <strong className="mb-1 block">{`${item.addressName} (${item.recipientName})`}</strong>
                    <p className="mb-2 font-medium text-gray-500">{formatPhoneNumber(item.phoneNumber)}</p>
                    <p className="mb-4 tracking-tighter">{`(${item.postcode}) ${item.addressLine1} ${item.addressLine2}`}</p>
                    <div className="relative mb-4 w-fit">
                      <IoIosArrowDown className="absolute right-2 top-[50%] z-0 translate-y-[-50%] text-xl" />
                      <select disabled className="w-[300px] rounded-md border border-gray-400 px-4 py-3 text-sm disabled:bg-gray-100">
                        <option className="text-gray-500">{item.deliveryNote}</option>
                      </select>
                    </div>
                    <div className="flex flex-row gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setshowUpdateForm(true)

                          const target = data.filter((datItem) => datItem.idx === item.idx)
                          updateData(target[0])
                        }}
                        className="block w-[60px] rounded-md border border-gray-400 bg-green-100 p-2 text-xs font-bold text-gray-700 hover:bg-green-200"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveAddress(item.idx)}
                        className="block w-[60px] rounded-md border border-gray-400 bg-pink-100 p-2 text-xs font-bold text-gray-700 hover:bg-pink-200"
                      >
                        삭제
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}

      {/* {showForm && (
        <AddressAddForm
          formRegister={{ method: register }}
          onSubmitForm={{ function: handleSubmit(handleSubmitAddress) }}
          onActions={{ onHideForm: handleClickHideForm, onShowPostcodeModal: handleFindPostcode }}
        />
      )} */}

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
