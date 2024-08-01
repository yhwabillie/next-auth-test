'use client'

import clsx from 'clsx'
import { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { Button } from './Button'
import { FaCheck } from 'react-icons/fa'
import { deleteProducts } from '@/app/actions/upload-product/actions'
import { useRouter } from 'next/navigation'

export const ProductList = (props: any) => {
  const router = useRouter()
  const [isAllChecked, setIsAllChecked] = useState(false)
  const {
    register,
    watch,
    reset,
    handleSubmit,
    setFocus,
    setValue,
    getValues,
    resetField,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    // resolver: zodResolver(SignInSchema),
    defaultValues: {},
  })

  const deleteData = async () => {
    const allValues = watch()
    const excludedId = 'check_all'
    const filteredValues = Object.keys(allValues)
      .filter((key) => key !== excludedId && allValues[key])
      .reduce<any>((obj, key) => {
        obj[key] = allValues[key]
        return obj
      }, {})

    console.log(filteredValues)

    try {
      await deleteProducts(filteredValues)
      router.refresh()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="flex flex-row justify-end gap-2">
        <div className="w-[230px]">
          <Button label="전체 Excel 다운로드" disalbe={true} />
        </div>
        <div className="w-[150px]">
          <Button label="선택 삭제" clickEvent={deleteData} />
        </div>
      </div>
      <table className="mt-5 w-full border-collapse">
        <thead className="bg-gray-100">
          <tr className="h-10 border-b border-gray-300">
            <th className="box-border w-[5%]">
              <label className="mx-auto flex h-4 w-4 items-center justify-center border border-gray-500/50">
                <input
                  {...register('check_all')}
                  type="checkbox"
                  onChange={() => {
                    const newValue = !isAllChecked
                    const values = Object.keys(getValues())

                    values.forEach((value) => {
                      setValue(value, newValue)
                    })

                    setIsAllChecked(newValue)
                  }}
                />
                {watch('check_all') && <FaCheck />}
              </label>
            </th>
            <th className="w-[50%] text-center text-sm">이름</th>
            <th className="w-[10%] text-center text-sm">카테고리</th>
            <th className="w-[10%] text-center text-sm">정가</th>
            <th className="w-[10%] text-center text-sm">할인</th>
            <th className="w-[15%] text-center text-sm">판매가</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((item: any, index: number) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="w-[5%]">
                <label htmlFor={item.idx} className="mx-auto flex h-4 w-4 items-center justify-center border border-gray-500/50">
                  <input
                    {...register(`${item.idx}`)}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const isChecked = event.target.checked
                      setValue(`${item.idx}`, isChecked)
                    }}
                    type="checkbox"
                    id={item.idx}
                  />
                  {watch(`${item.idx}`) && <FaCheck />}
                </label>
              </td>
              <td className="box-border w-[50%] break-all p-2 text-left text-sm">{item.name}</td>
              <td className="box-border w-[15%] text-center text-sm">{item.category}</td>
              <td className="box-border w-[10%] text-center text-sm">{item.original_price.toLocaleString('ko-KR')}</td>
              <td className="box-border w-[10%] text-center text-sm">{`${item.discount_rate * 100}%`}</td>
              <td className="box-border w-[10%] pr-2 text-right text-sm">
                {`${(item.original_price - item.original_price * item.discount_rate).toLocaleString('ko-KR')}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
