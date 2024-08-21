'use client'
import { useForm } from 'react-hook-form'
import { AgreementSchema, AgreementSchemaType } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useAgreementStore } from '@/lib/zustandStore'
import { Button } from '@/lib/components/common/modules/Button'
import { HookFormCheckBox } from '@/lib/components/common/modules/HookFormCheckBox'
import clsx from 'clsx'

export const AgreementForm = () => {
  const { register, watch, setValue, handleSubmit } = useForm<AgreementSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(AgreementSchema),
    defaultValues: {
      service_agreement: false,
      privacy_agreement: false,
      selectable_agreement: false,
    },
  })

  const router = useRouter()
  const { setAgreement } = useAgreementStore((state) => state)

  const handleOnClickNext = (data: AgreementSchemaType) => {
    setAgreement(data)
  }

  return (
    <form onSubmit={handleSubmit(handleOnClickNext)} className="mx-auto mb-[90px] w-[400px] pr-8">
      <fieldset className="mb-10">
        <HookFormCheckBox
          id="check_all"
          label="전체 동의하기"
          checked={watch('service_agreement') && watch('privacy_agreement') && watch('selectable_agreement')}
          onChangeEvent={(event: React.ChangeEvent<HTMLInputElement>) => {
            const agreements = ['service_agreement', 'privacy_agreement', 'selectable_agreement']
            const isChecked = event.target.checked

            agreements.forEach((agreement: any) => setValue(agreement, isChecked))
          }}
        />
        <p className="break-all pl-8 font-normal tracking-tighter text-gray-600/70">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque nihil aspernLorem ipsum dolor sit amet consectetur, adipisicing elit.
          Itaque nihil aspern
        </p>
      </fieldset>

      <fieldset>
        <div className="mb-5">
          <HookFormCheckBox
            id="service_agreement"
            label="[필수] 서비스 이용 약관"
            register={register('service_agreement')}
            checked={watch('service_agreement')}
            onChangeEvent={(event: React.ChangeEvent<HTMLInputElement>) => {
              const isChecked = event.target.checked
              setValue('service_agreement', isChecked)
            }}
          />
          <div className="mt-2 pl-8">
            <p
              className={clsx(
                'scroll-area text-md h-[150px] overflow-y-scroll break-all rounded-lg border bg-white py-3 pl-3 pr-1 font-normal tracking-tighter text-gray-600/70 shadow-md',
                {
                  'border-gray-600/70': !!!watch('service_agreement'),
                  'border-blue-600/70': !!watch('service_agreement'),
                },
              )}
            >
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque nihil aspernLorem ipsum dolor sit amet consectetur, adipisicing elit.
              Itaque nihil aspern Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque nihil aspernLorem ipsum dolor sit amet consectetur,
              adipisicing elit. Itaque nihil aspern Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque nihil aspernLorem ipsum dolor sit
              amet consectetur, adipisicing elit. Itaque nihil aspern
            </p>
          </div>
        </div>
        <div className="mb-5">
          <HookFormCheckBox
            id="privacy_agreement"
            label="[필수] 개인 정보 이용 약관"
            register={register('privacy_agreement')}
            checked={watch('privacy_agreement')}
            onChangeEvent={(event: React.ChangeEvent<HTMLInputElement>) => {
              const isChecked = event.target.checked
              setValue('privacy_agreement', isChecked)
            }}
          />
          <div className="mt-2 pl-8">
            <p
              className={clsx(
                'scroll-area text-md h-[150px] overflow-y-scroll break-all rounded-lg border bg-white py-3 pl-3 pr-1 font-normal tracking-tighter text-gray-600/70 shadow-md',
                {
                  'border-gray-600/70': !!!watch('service_agreement'),
                  'border-blue-600/70': !!watch('service_agreement'),
                },
              )}
            >
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque nihil aspernLorem ipsum dolor sit amet consectetur, adipisicing elit.
              Itaque nihil aspern Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque nihil aspernLorem ipsum dolor sit amet consectetur,
              adipisicing elit. Itaque nihil aspern Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque nihil aspernLorem ipsum dolor sit
              amet consectetur, adipisicing elit. Itaque nihil aspern
            </p>
          </div>
        </div>
        <div>
          <HookFormCheckBox
            id="selectable_agreement"
            label="[선택] 마케팅 동의 선택적 약관"
            register={register('selectable_agreement')}
            checked={watch('selectable_agreement')}
            onChangeEvent={(event: React.ChangeEvent<HTMLInputElement>) => {
              const isChecked = event.target.checked
              setValue('selectable_agreement', isChecked)
            }}
          />
          <div className="mt-2 pl-8">
            <p
              className={clsx(
                'scroll-area h-[150px] overflow-y-scroll break-all rounded-lg border bg-white py-3 pl-3 pr-1 font-normal tracking-tighter text-gray-600/70 shadow-md',
                {
                  'border-gray-600/70': !!!watch('service_agreement'),
                  'border-blue-600/70': !!watch('service_agreement'),
                },
              )}
            >
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque nihil aspernLorem ipsum dolor sit amet consectetur, adipisicing elit.
              Itaque nihil aspern Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque nihil aspernLorem ipsum dolor sit amet consectetur,
              adipisicing elit. Itaque nihil aspern Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque nihil aspernLorem ipsum dolor sit
              amet consectetur, adipisicing elit. Itaque nihil aspern
            </p>
          </div>
        </div>
      </fieldset>

      <div className="fixed bottom-0 left-[50%] w-full translate-x-[-50%] bg-gray-100 py-5">
        <div className="mx-auto box-border w-[400px] md:w-[500px]">
          <Button
            label="다음"
            disalbe={!(watch('service_agreement') && watch('privacy_agreement'))}
            clickEvent={() => router.push('/signUp/begin')}
          />
        </div>
      </div>
    </form>
  )
}
