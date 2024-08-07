'use client'
import { updateAddress } from '@/app/actions/address/actions'
import { AddressFormSchema, AddressFormSchemaType } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const AddressUpdateForm = (props: any) => {
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(AddressFormSchema),
  })

  const handleSubmitAddress = async (data: any) => {
    console.log('submit=====>', data)

    try {
      const response = await updateAddress(props.userIdx!, props.updateData.idx, data)

      if (!response?.success) {
        toast.error('수정 실패')
      }

      props.fetchData()
      props.handleClose()
      toast.success('수정 성공')
    } catch (error) {}
  }

  useEffect(() => {
    setValue('addressLine1', props.updateData.addressLine1)
    setValue('postcode', props.updateData.postcode)
  }, [props.updateData])

  return (
    <div className="fixed left-0 top-0 z-10 flex h-full w-full justify-center overflow-y-auto overflow-x-hidden bg-black/70 py-10">
      <section className="box-border flex min-h-full w-[600px] flex-col justify-between rounded-2xl bg-white p-10 shadow-lg">
        <h2 className="mb-4 block text-center text-2xl font-semibold tracking-tighter">배송지 정보 수정</h2>
        <div className="mb-4 h-full">
          <form onSubmit={handleSubmit(handleSubmitAddress)}>
            <fieldset className="border-b border-gray-300">
              <div className="mb-2 py-4">
                <legend>배송지 이름</legend>
                <input
                  {...register('addressName')}
                  id="addressName"
                  value={props.updateData.addressName}
                  onChange={(event: any) => {
                    props.setUpdateData({ ...props.updateData, addressName: event.target.value })
                  }}
                  className="border border-black p-2"
                  type="text"
                  placeholder="배송지 이름을 작성해주세요"
                />
              </div>

              <div className="mb-2 py-4">
                <legend>수령인 이름</legend>
                <input
                  {...register('recipientName')}
                  value={props.updateData.recipientName}
                  onChange={(event: any) => {
                    props.setUpdateData({ ...props.updateData, recipientName: event.target.value })
                  }}
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
                  onChange={(event: any) => {
                    props.setUpdateData({ ...props.updateData, phoneNumber: event.target.value })
                  }}
                  value={props.updateData.phoneNumber}
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
                      onChange={(event: any) => {
                        props.setUpdateData({ ...props.updateData, postcode: event.target.value })
                      }}
                      defaultValue={props.updateData.postcode}
                      id="postcode"
                      type="text"
                      className="mr-2 w-[100px] border border-black p-2 focus:outline-none"
                      readOnly
                    />
                    <input
                      {...register('addressLine1')}
                      onChange={(event: any) => {
                        props.setUpdateData({ ...props.updateData, addressLine1: event.target.value })
                      }}
                      defaultValue={props.updateData.addressLine1}
                      id="addressLine1"
                      type="text"
                      className="mr-2 w-[400px] border border-black p-2 focus:outline-none"
                      readOnly
                    />
                    <button type="button" onClick={() => props.setIsPostcodeOpen(true)} className="bg-blue-400 p-2">
                      주소찾기
                    </button>
                  </div>
                  <input
                    {...register('addressLine2')}
                    onChange={(event: any) => {
                      props.setUpdateData({ ...props.updateData, addressLine2: event.target.value })
                    }}
                    value={props.updateData.addressLine2}
                    id="addressLine2"
                    type="text"
                    className="w-[400px] border border-black p-2"
                    placeholder="나머지 주소를 입력해주세요"
                  />
                </div>
              </div>
              <div className="mb-2 py-4">
                <legend>배송 요청 사항</legend>
                <select
                  {...register('deliveryNote')}
                  onChange={(event: any) => {
                    props.setUpdateData({ ...props.updateData, deliveryNote: event.target.value })
                  }}
                  value={props.updateData.deliveryNote}
                  id="deliveryNote"
                  className="w-[300px] border border-black p-2"
                >
                  <option value={'문 앞에 부탁드립니다'}>문 앞에 부탁드립니다.</option>
                  <option value={'부재시 연락 부탁드립니다'}>부재시 연락 부탁드립니다.</option>
                  <option value={'배송 전 미리 연락해주세요'}>배송 전 미리 연락해주세요.</option>
                </select>
              </div>
            </fieldset>
            <div className="flex flex-row gap-2">
              <button type="button" onClick={props.handleClose} className="w-[50%] bg-gray-500 p-2 text-white">
                취소
              </button>
              <button type="submit" className="w-[50%] bg-blue-500 p-2 text-white">
                저장
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
