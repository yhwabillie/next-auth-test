'use client'
import { UseFormRegister } from 'react-hook-form'

interface AddressAddFormProps {
  formRegister: {
    method: UseFormRegister<{
      addressName: string
      recipientName: string
      phoneNumber: string
      postcode: string
      addressLine1: string
      addressLine2: string
      deliveryNote: string
    }>
  }
  onSubmitForm: {
    function: (data: any) => Promise<void>
  }
  onActions: {
    onHideForm: () => void
    onShowPostcodeModal: () => void
  }
}

export const AddressAddForm: React.FC<AddressAddFormProps> = ({ formRegister, onSubmitForm, onActions }) => {
  return (
    <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black/70">
      <form onSubmit={onSubmitForm.function}>
        <section className="box-border flex h-auto w-[600px] flex-col rounded-2xl bg-white p-10 shadow-lg">
          <h2 className="mb-4 block text-center text-2xl font-semibold tracking-tighter">배송지 추가하기</h2>
          <div className="scroll-area mb-4 min-h-[300px] overflow-auto rounded-xl border border-gray-300 pl-3 drop-shadow-md">
            <fieldset className="border-b border-gray-300">
              <div className="mb-2 py-4">
                <legend>배송지 이름</legend>
                <input
                  {...formRegister.method('addressName')}
                  id="addressName"
                  className="border border-black p-2"
                  type="text"
                  placeholder="배송지 이름을 작성해주세요"
                />
              </div>

              <div className="mb-2 py-4">
                <legend>수령인 이름</legend>
                <input
                  {...formRegister.method('recipientName')}
                  id="recipientName"
                  className="border border-black p-2"
                  type="text"
                  placeholder="수령인 이름을 작성해주세요"
                />
              </div>

              <div className="mb-2 py-4">
                <legend>연락처</legend>
                <input
                  {...formRegister.method('phoneNumber')}
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
                      {...formRegister.method('postcode')}
                      id="postcode"
                      type="text"
                      className="mr-2 w-[100px] border border-black p-2 focus:outline-none"
                      readOnly
                    />
                    <input
                      {...formRegister.method('addressLine1')}
                      id="addressLine1"
                      type="text"
                      className="mr-2 w-[400px] border border-black p-2 focus:outline-none"
                      readOnly
                    />
                    <button onClick={onActions.onShowPostcodeModal} type="button" className="bg-blue-400 p-2">
                      주소찾기
                    </button>
                  </div>
                  <input
                    {...formRegister.method('addressLine2')}
                    id="addressLine2"
                    type="text"
                    className="w-[400px] border border-black p-2"
                    placeholder="나머지 주소를 입력해주세요"
                  />
                </div>
              </div>
              <div className="mb-2 py-4">
                <legend>배송 요청 사항</legend>
                <select {...formRegister.method('deliveryNote')} id="deliveryNote" className="w-[300px] border border-black p-2">
                  <option value={'문 앞에 부탁드립니다'}>문 앞에 부탁드립니다.</option>
                  <option value={'부재시 연락 부탁드립니다'}>부재시 연락 부탁드립니다.</option>
                  <option value={'배송 전 미리 연락해주세요'}>배송 전 미리 연락해주세요.</option>
                </select>
              </div>
            </fieldset>
          </div>

          <div className="flex flex-row gap-2">
            <button
              type="button"
              onClick={onActions.onHideForm}
              className="bg-3 text-md w-[50%] rounded-md bg-gray-400 px-3 py-4 font-semibold text-white drop-shadow-md transition-all duration-150 ease-in-out hover:bg-gray-600"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-3 text-md w-[50%] rounded-md bg-blue-400 px-3 py-4 font-semibold text-white drop-shadow-md transition-all duration-150 ease-in-out hover:bg-blue-600"
            >
              저장
            </button>
          </div>
        </section>
      </form>
    </div>
    // <section>
    //   <form onSubmit={onSubmitForm.function}>
    //     <fieldset className="border-b border-gray-300">
    //       <h5 className="mb-2 border-b-2 border-blue-500 pb-2 text-lg font-semibold">배송지 등록</h5>

    //       <div className="mb-2 py-4">
    //         <legend>배송지 이름</legend>
    //         <input
    //           {...formRegister.method('addressName')}
    //           id="addressName"
    //           className="border border-black p-2"
    //           type="text"
    //           placeholder="배송지 이름을 작성해주세요"
    //         />
    //       </div>

    //       <div className="mb-2 py-4">
    //         <legend>수령인 이름</legend>
    //         <input
    //           {...formRegister.method('recipientName')}
    //           id="recipientName"
    //           className="border border-black p-2"
    //           type="text"
    //           placeholder="수령인 이름을 작성해주세요"
    //         />
    //       </div>

    //       <div className="mb-2 py-4">
    //         <legend>연락처</legend>
    //         <input
    //           {...formRegister.method('phoneNumber')}
    //           id="phoneNumber"
    //           className="border border-black p-2"
    //           type="text"
    //           placeholder="연락처를 작성해주세요"
    //         />
    //       </div>

    //       <div className="mb-2 py-4">
    //         <legend>주소</legend>
    //         <div className="flex flex-col gap-3">
    //           <div>
    //             <input
    //               {...formRegister.method('postcode')}
    //               id="postcode"
    //               type="text"
    //               className="mr-2 w-[100px] border border-black p-2 focus:outline-none"
    //               readOnly
    //             />
    //             <input
    //               {...formRegister.method('addressLine1')}
    //               id="addressLine1"
    //               type="text"
    //               className="mr-2 w-[400px] border border-black p-2 focus:outline-none"
    //               readOnly
    //             />
    //             <button onClick={onActions.onShowPostcodeModal} type="button" className="bg-blue-400 p-2">
    //               주소찾기
    //             </button>
    //           </div>
    //           <input
    //             {...formRegister.method('addressLine2')}
    //             id="addressLine2"
    //             type="text"
    //             className="w-[400px] border border-black p-2"
    //             placeholder="나머지 주소를 입력해주세요"
    //           />
    //         </div>
    //       </div>
    //       <div className="mb-2 py-4">
    //         <legend>배송 요청 사항</legend>
    //         <select {...formRegister.method('deliveryNote')} id="deliveryNote" className="w-[300px] border border-black p-2">
    //           <option value={'문 앞에 부탁드립니다'}>문 앞에 부탁드립니다.</option>
    //           <option value={'부재시 연락 부탁드립니다'}>부재시 연락 부탁드립니다.</option>
    //           <option value={'배송 전 미리 연락해주세요'}>배송 전 미리 연락해주세요.</option>
    //         </select>
    //       </div>
    //     </fieldset>
    //     <div>
    //       <button className="w-full bg-blue-400 p-4">신규 배송지 추가</button>
    //     </div>
    //   </form>
    //   <button className="bg-green-400 p-2" onClick={onActions.onHideForm}>
    //     취소
    //   </button>
    // </section>
  )
}
