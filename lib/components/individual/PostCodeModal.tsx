'use client'
import DaumPostcodeEmbed from 'react-daum-postcode'
import { Button } from '../Button'
import { useAddressStore } from '@/lib/zustandStore'

export const PostCodeModal = () => {
  const { updateData, setIsPostcodeOpen } = useAddressStore()

  const handleComplete = (data: any) => {
    updateData(data)
    setIsPostcodeOpen(false)
  }

  return (
    <div className="fixed left-0 top-0 z-10 flex h-full w-full justify-center overflow-y-auto overflow-x-hidden bg-black/70 py-10">
      <section className="box-border flex min-h-full w-[600px] flex-col justify-between rounded-2xl bg-white p-10 shadow-lg">
        <h2 className="mb-4 block text-center text-2xl font-semibold tracking-tighter">주소 검색</h2>
        <div className="mb-4 h-full">
          <DaumPostcodeEmbed className="h-full" onComplete={handleComplete} autoClose={false} />
        </div>

        <Button
          label="닫기!"
          clickEvent={() => {
            setIsPostcodeOpen(false)
          }}
        />
      </section>
    </div>
  )
}
