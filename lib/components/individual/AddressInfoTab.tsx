'use client'
import { createNewAddress, fetchAddressList, hasDefaultAddress, removeAddress, setDefaultAddress } from '@/app/actions/address/actions'
import { AddressFormSchema, AddressFormSchemaType } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import DaumPostcodeEmbed from 'react-daum-postcode'
import { FieldValues, useForm } from 'react-hook-form'
import { Button } from '../Button'
import { useModalStore } from '@/lib/zustandStore'
import { toast } from 'sonner'
import { AddressUpdateForm } from './AddressUpdateForm'

export const AddressInfoTab = () => {
  const { data: session, update, status } = useSession()
  const [data, setData] = useState<any[]>([])
  const [updateData, setUpdateData] = useState<any[]>([])

  const [loading, setLoading] = useState(true)
  const userIdx = session?.user?.idx
  const [showForm, setShowForm] = useState(false)
  const [showUpdateForm, setshowUpdateForm] = useState(false)
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)
  const { setModalState } = useModalStore((state) => state)
  const { register, setValue, handleSubmit, reset } = useForm<AddressFormSchemaType>({
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
   * 주소 API
   */

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

    // updateData 상태 업데이트
    setUpdateData((prevData) => ({
      ...prevData,
      postcode: data.zonecode,
      addressLine1: fullAddress,
    }))

    setModalState(false)
    setIsPostcodeOpen(false)
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

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <>
      <h4 className="mb-5 text-2xl font-bold">배송정보</h4>
      <button className="bg-green-400 p-2" onClick={() => setShowForm(true)}>
        배송지 추가
      </button>

      {showForm && (
        <>
          <form onSubmit={handleSubmit(handleSubmitAddress)}>
            <fieldset className="border-b border-gray-300">
              <h5 className="mb-2 border-b-2 border-blue-500 pb-2 text-lg font-semibold">배송지 등록</h5>

              <div className="mb-2 py-4">
                <legend>배송지 이름</legend>
                <input
                  {...register('addressName')}
                  id="addressName"
                  className="border border-black p-2"
                  type="text"
                  placeholder="배송지 이름을 작성해주세요"
                />
              </div>

              <div className="mb-2 py-4">
                <legend>수령인 이름</legend>
                <input
                  {...register('recipientName')}
                  id="recipientName"
                  className="border border-black p-2"
                  type="text"
                  placeholder="수령인 이름을 작성해주세요"
                />
              </div>

              <div className="mb-2 py-4">
                <legend>연락처</legend>
                <input
                  {...register('phoneNumber')}
                  id="phoneNumber"
                  className="border border-black p-2"
                  type="text"
                  placeholder="연락처를 작성해주세요"
                />
              </div>

              <div className="mb-2 py-4">
                <legend>주소</legend>
                <div className="flex flex-col gap-3">
                  <div>
                    <input
                      {...register('postcode')}
                      id="postcode"
                      type="text"
                      className="mr-2 w-[100px] border border-black p-2 focus:outline-none"
                      readOnly
                    />
                    <input
                      {...register('addressLine1')}
                      id="addressLine1"
                      type="text"
                      className="mr-2 w-[400px] border border-black p-2 focus:outline-none"
                      readOnly
                    />
                    <button
                      onClick={() => {
                        setModalState(true)
                        setIsPostcodeOpen(true)
                      }}
                      type="button"
                      className="bg-blue-400 p-2"
                    >
                      주소찾기
                    </button>
                  </div>
                  <input
                    {...register('addressLine2')}
                    id="addressLine2"
                    type="text"
                    className="w-[400px] border border-black p-2"
                    placeholder="나머지 주소를 입력해주세요"
                  />
                </div>
              </div>
              <div className="mb-2 py-4">
                <legend>배송 요청 사항</legend>
                <select {...register('deliveryNote')} id="deliveryNote" className="w-[300px] border border-black p-2">
                  <option value={'문 앞에 부탁드립니다'}>문 앞에 부탁드립니다.</option>
                  <option value={'부재시 연락 부탁드립니다'}>부재시 연락 부탁드립니다.</option>
                  <option value={'배송 전 미리 연락해주세요'}>배송 전 미리 연락해주세요.</option>
                </select>
              </div>
            </fieldset>
            <div>
              <button className="w-full bg-blue-400 p-4">신규 배송지 추가</button>
            </div>
          </form>
          <button
            className="bg-green-400 p-2"
            onClick={() => {
              setShowForm(false)
              reset()
            }}
          >
            취소
          </button>
        </>
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
                  setUpdateData(target[0])
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
          setUpdateData={setUpdateData}
          handleClose={() => {
            setshowUpdateForm(false)
            setUpdateData([])
          }}
          setIsPostcodeOpen={setIsPostcodeOpen}
          userIdx={userIdx}
          fetchData={fetchData}
        />
      )}

      {isPostcodeOpen && (
        <div className="fixed left-0 top-0 z-10 flex h-full w-full justify-center overflow-y-auto overflow-x-hidden bg-black/70 py-10">
          <section className="box-border flex min-h-full w-[600px] flex-col justify-between rounded-2xl bg-white p-10 shadow-lg">
            <h2 className="mb-4 block text-center text-2xl font-semibold tracking-tighter">주소 검색</h2>
            <div className="mb-4 h-full">
              <DaumPostcodeEmbed className="h-full" onComplete={handleComplete} autoClose={false} />
            </div>

            <Button
              label="닫기"
              clickEvent={() => {
                setModalState(false)
                setIsPostcodeOpen(false)
              }}
            />
          </section>
        </div>
      )}
    </>
  )
}
