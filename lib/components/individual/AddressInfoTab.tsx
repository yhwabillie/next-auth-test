'use client'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { useAddressDataStore } from '@/lib/zustandStore'
import { TabContentSkeleton } from './TabContentSkeleton'
import { FaPlus } from 'react-icons/fa'
import { setDefaultAddress } from '@/app/actions/address/actions'
import { toast } from 'sonner'
import { EmptyTab } from './EmptyTab'

export const AddressInfoTab = () => {
  const { data: session } = useSession()
  const userIdx = session?.user?.idx
  const { fetchData, showModal, setEditAddress, handleRemoveAddress, setUserIdx, loading, data, isEmpty } = useAddressDataStore()

  /**
   * 클릭한 주소 수정 폼 열기
   */
  const handleEditAddressClick = (item: any) => {
    const target = data.filter((dataItem) => dataItem.idx === item.idx)

    setEditAddress(target[0])
    showModal('editAddress')
  }

  useEffect(() => {
    setUserIdx(userIdx!)
    fetchData()
  }, [])

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

  if (loading) return <TabContentSkeleton />

  return (
    <>
      {isEmpty ? (
        <EmptyTab
          sub_title="입력된 배송정보가 없습니다"
          title="🚚 배송지를 추가해주세요."
          type="btn"
          label="배송지 추가하기"
          clickEvent={() => showModal('addNewAddress')}
        />
      ) : (
        <>
          <button
            onClick={() => showModal('addNewAddress')}
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
                        onClick={() => handleEditAddressClick(item)}
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
                  <strong className="block text-2xl">🚚 배송지를 추가해주세요.</strong>
                </p>
              )}

              <ul>
                {etc_address.map((item, index) => (
                  <li key={index} className="relative mb-5 rounded-lg bg-blue-200/30 p-5 drop-shadow-sm last:mb-0">
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
                        onClick={() => handleEditAddressClick(item)}
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
                      <button
                        type="button"
                        onClick={() => handleClickSetDefault(item.idx)}
                        className="block w-[120px] rounded-md border border-gray-400 bg-gray-100 p-2 text-xs font-bold text-gray-700 hover:bg-pink-200"
                      >
                        기본배송지로 선택
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}
    </>
  )
}
