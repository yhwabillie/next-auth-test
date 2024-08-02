'use client'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { Button } from './Button'
import { FaCheck } from 'react-icons/fa'
import { deleteSelectedProductsByIdx } from '@/app/actions/upload-product/actions'
import { useRouter } from 'next/navigation'

interface ItemsType {
  [key: string]: boolean
}

interface IDataProps {
  data:
    | {
        idx: string
        name: string
        category: string
        original_price: number
        discount_rate: number | null
        imageUrl: string
        createdAt: Date
        updatedAt: Date
      }[]
    | undefined
}

export const ProductList = ({ data }: IDataProps) => {
  const router = useRouter()
  const checkAllRef = useRef<HTMLInputElement>(null)
  const [items, setItems] = useState<ItemsType>({})
  const [isAllChecked, setIsAllChecked] = useState(false)

  //체크박스 클릭시 isChecked값을 최종 배열에 저장 toggle
  //중복객체가 있을시 배열에서 제거
  //check: true, unchecked: false 값 할당
  //중복된 키값이 발견되면 새로운 값으로 업데이트
  const toggleItem = (key: string, isChecked: boolean) => {
    setItems((prev) => {
      const updatedItems = { ...prev }

      // 새로 들어온 값과 기존 값이 같다면 반대로 설정
      if (prev[key] === isChecked) {
        updatedItems[key] = !isChecked
      } else {
        // 새로 들어온 값으로 업데이트
        updatedItems[key] = isChecked
      }

      return updatedItems
    })
  }

  const updateAllValues = (isChecked: boolean) => {
    setItems((prevItems) => {
      const updatedItems = Object.keys(prevItems).reduce(
        (acc, key) => {
          acc[key] = isChecked
          return acc
        },
        {} as { [key: string]: boolean },
      )
      return updatedItems
    })
  }

  const deleteSelectedProducts = async () => {
    console.log('go Server===>', items)

    const result = Object.keys(items).reduce((acc: any, key: any) => {
      if (items[key] === true) {
        acc[key] = items[key]
      }
      return acc
    }, {})

    const response = await deleteSelectedProductsByIdx(result)
    router.refresh()

    setItems({})

    setIsAllChecked(false)
    if (!checkAllRef.current) return
    checkAllRef.current.checked = false
  }

  useEffect(() => {
    console.log('items===>', items)
    console.log('data 개수===>', data?.length)

    //data와 items(최종 결과 배열)의 개수가 같으면 allChecked
    //아닐경우 allChecked 해제
    if (Object.values(items).filter((item) => item === true).length === data?.length) {
      console.log('같음')

      if (Object.values(items).filter((item) => item === true).length === 0 || data?.length === 0) return
      setIsAllChecked(true)
      if (!checkAllRef.current) return
      checkAllRef.current.checked = true
    } else {
      setIsAllChecked(false)
      if (!checkAllRef.current) return
      checkAllRef.current.checked = false
    }
  }, [data, items])

  return (
    <>
      <div className="flex flex-row justify-end gap-2">
        <div className="w-[230px]">
          <Button label="전체 Excel 다운로드" disalbe={true} />
        </div>
        <div className="w-[150px]">
          <Button label="선택 삭제" clickEvent={deleteSelectedProducts} />
        </div>
      </div>
      <table className="mt-5 w-full border-collapse">
        <thead className="bg-gray-100">
          <tr className="h-10 border-b border-gray-300">
            <th className="box-border w-[5%]">
              <label htmlFor="check_all" className="mx-auto flex h-4 w-4 items-center justify-center border border-gray-500/50">
                <input
                  ref={checkAllRef}
                  id="check_all"
                  type="checkbox"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const isChecked = event.target.checked

                    if (Object.keys(items).length === 0 && isChecked) {
                      setIsAllChecked(true)

                      data?.forEach((item) => {
                        toggleItem(item.idx, true)
                      })
                    } else if (Object.keys(items).length > 0 && isChecked) {
                      console.log('?')

                      updateAllValues(true)
                    } else {
                      setIsAllChecked(false)
                      updateAllValues(false)
                    }
                  }}
                />
                {isAllChecked && <FaCheck />}
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
          {data?.map((item, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="w-[5%]">
                <label htmlFor={item.idx} className="mx-auto flex h-4 w-4 items-center justify-center border border-gray-500/50">
                  <input
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const isChecked = event.target.checked

                      toggleItem(`${item.idx}`, isChecked)

                      if (!checkAllRef.current) return
                      checkAllRef.current.checked = isChecked
                    }}
                    type="checkbox"
                    id={item.idx}
                  />
                  {items[`${item.idx}`] && <FaCheck />}
                </label>
              </td>
              <td className="box-border w-[50%] break-all p-2 text-left text-sm">{item.name}</td>
              <td className="box-border w-[15%] text-center text-sm">{item.category}</td>
              <td className="box-border w-[10%] text-center text-sm">{item.original_price.toLocaleString('ko-KR')}</td>
              <td className="box-border w-[10%] text-center text-sm">{`${item.discount_rate! * 100}%`}</td>
              <td className="box-border w-[10%] pr-2 text-right text-sm">
                {`${(item.original_price - item.original_price * item.discount_rate!).toLocaleString('ko-KR')}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
