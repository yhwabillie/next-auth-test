'use client'

import clsx from 'clsx'
import { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'

export const ProductList = (props: any) => {
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

  console.log(isAllChecked)

  return (
    <table className="mt-5">
      <thead>
        <tr>
          <th>
            <label className="block h-4 w-4 border border-blue-500">
              <input
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
            </label>
          </th>
          <th>이름</th>
          <th>카테고리</th>
          <th>정가</th>
          <th>할인</th>
          <th>판매가</th>
          {/* <th>이미지 URL</th> */}
        </tr>
      </thead>
      <tbody>
        {props.data.map((item: any, index: number) => (
          <tr key={index}>
            <td>
              <label
                htmlFor={item.idx}
                className={clsx('block h-4 w-4 border', {
                  'border-red-500': watch(`${item.idx}`),
                  'border-blue-500': !watch(`${item.idx}`),
                })}
              >
                <input
                  {...register(`${item.idx}`)}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const isChecked = event.target.checked
                    setValue(`${item.idx}`, isChecked)
                  }}
                  type="checkbox"
                  id={item.idx}
                />
              </label>
            </td>
            <td>{item.name}</td>
            <th>{item.category}</th>
            <td>{item.original_price.toLocaleString('ko-KR')}</td>
            <td>{`${item.discount_rate * 100}%`}</td>
            <td>{`${(item.original_price - item.original_price * item.discount_rate).toLocaleString('ko-KR')}원`}</td>
            {/* <td>{item.imageUrl}</td> */}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
