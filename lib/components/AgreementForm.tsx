'use client'
import { useForm } from 'react-hook-form'
import { AgreementSchema, AgreementSchemaType } from '../zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAgreementStore } from '../zustandStore'

export const AgreementForm = () => {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AgreementSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(AgreementSchema),
  })

  const router = useRouter()
  const agreements = useAgreementStore((state: any) => state.agreements)
  const { setAgreement } = useAgreementStore((state) => state)

  const handleOnClickNext = (data: AgreementSchemaType) => {
    setAgreement(data)
  }

  useEffect(() => {}, [watch])

  return (
    <form onSubmit={handleSubmit(handleOnClickNext)}>
      <section>
        <h2>전체 동의하기</h2>
        <input
          id="check_all"
          type="checkbox"
          name="check_all"
          checked={watch('service_agreement') && watch('privacy_agreement') && watch('selectable_agreement')}
          onChange={(event) => {
            const agreements = ['service_agreement', 'privacy_agreement', 'selectable_agreement']
            const isChecked = event.target.checked

            agreements.forEach((agreement: any) => setValue(agreement, isChecked))
          }}
        />
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque nihil aspern</p>

        <div>
          <section>
            <h3>이용약관</h3>
            <input {...register('service_agreement')} id="service_agreement" type="checkbox" name="service_agreement" />
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque nihil aspernatur necessitatibus. Cum dolore saepe veniam minus quia
              illo culpa dolores facilis mollitia. Modi possimus, praesentium ullam recusandae cupiditate odit!
            </p>
          </section>
          <section>
            <h3>개인정보 수집 및 이용</h3>
            <input {...register('privacy_agreement')} id="privacy_agreement" type="checkbox" name="privacy_agreement" />
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque nihil aspernatur necessitatibus. Cum dolore saepe veniam minus quia
              illo culpa dolores facilis mollitia. Modi possimus, praesentium ullam recusandae cupiditate odit!
            </p>
          </section>
          <section>
            <h3>(선택) 선택 수집사항</h3>
            <input {...register('selectable_agreement')} id="selectable_agreement" type="checkbox" name="selectable_agreement" />
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque nihil aspernatur necessitatibus. Cum dolore saepe veniam minus quia
              illo culpa dolores facilis mollitia. Modi possimus, praesentium ullam recusandae cupiditate odit!
            </p>
          </section>
        </div>
      </section>

      <button disabled={!(watch('service_agreement') && watch('privacy_agreement'))} onClick={() => router.push('/signUp/begin')}>
        다음
      </button>
    </form>
  )
}
