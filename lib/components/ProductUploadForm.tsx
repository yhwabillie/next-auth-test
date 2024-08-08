'use client'
import { createBulkProduct, Product } from '@/app/actions/upload-product/actions'
import { useEffect, useState } from 'react'
import { Button } from './Button'
import { FieldValues, useForm } from 'react-hook-form'
import { useProductStore } from '../zustandStore'
import * as XLSX from 'xlsx'

export const ProductUploadForm = () => {
  const [updateLoading, setUpdateLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const { productState } = useProductStore()
  const { setProductState } = useProductStore((state) => state)
  const { register, setValue, getValues, resetField } = useForm<FieldValues>({
    mode: 'onChange',
  })

  const handleClickSaveData = () => {
    if (file) {
      const reader = new FileReader()

      reader.onload = async (e) => {
        const data = e.target?.result

        if (data) {
          const workbook = XLSX.read(data, { type: 'binary' })

          //SheetName
          const sheetName = workbook.SheetNames[0]

          //Worksheet
          const workSheet = workbook.Sheets[sheetName]

          //Json
          const json: Product[] = XLSX.utils.sheet_to_json(workSheet)

          try {
            setUpdateLoading(true) // 로딩

            await createBulkProduct(JSON.parse(JSON.stringify(json)))
            console.log('출발지==>', JSON.parse(JSON.stringify(json)))
            setProductState(true)

            setFileName('')
            resetField('upload')
          } catch (error) {
            console.log(error)
            setUpdateLoading(false) // 로딩 상태 해제
          } finally {
            setUpdateLoading(false) // 로딩 상태 해제
          }
        }
      }

      reader.readAsArrayBuffer(file)
    }
  }

  return (
    <section aria-labelledby="upload-form-heading">
      <h4 id="upload-form-heading" className="sr-only">
        상품 데이터 업로드 폼
      </h4>
      <fieldset className="mb-5 flex flex-row justify-center">
        <input
          className="text-md box-border h-[50px] w-[400px] rounded-bl-md rounded-tl-md border border-gray-500/50 p-3 px-5 text-gray-500/40 shadow-md placeholder:text-gray-500/40 focus:outline-0"
          type="text"
          value={fileName}
          readOnly
          placeholder="업로드할 엑셀 파일을 선택하세요"
        />
        <label
          htmlFor="upload"
          className="text-md box-border h-[50px] w-[70px] cursor-pointer rounded-br-md rounded-tr-md border-gray-500/50 bg-blue-400 pt-[13px] text-center text-white shadow-md transition-all duration-150 ease-in-out hover:bg-blue-500"
        >
          선택
        </label>
        <input
          {...register('upload')}
          id="upload"
          onChange={(event: any) => {
            if (event.target.files.length === 1) {
              setFileName(event.target.files[0].name)
              setFile(event.target.files[0])
            } else {
              setFileName('')
              setFile(null)
            }
          }}
          type="file"
          accept=".xlsx, .xls"
        />
      </fieldset>
      <div className="mb-20 flex justify-center gap-2">
        <div className="w-[200px]">
          <Button
            label="데이터 업로드"
            clickEvent={handleClickSaveData}
            spinner={updateLoading}
            disalbe={file === null || getValues('upload') === undefined || getValues('upload') === null || updateLoading}
          />
        </div>
        <div className="w-[200px]">
          <Button
            label="선택 데이터 리셋"
            clickEvent={() => {
              setFileName('')
              setValue('upload', null)
            }}
            disalbe={file === null || getValues('upload') === undefined || getValues('upload') === null}
          />
        </div>
      </div>
    </section>
  )
}
