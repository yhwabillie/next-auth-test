'use client'
import { createBulkProduct, ICreateProductProps } from '@/app/actions/upload-product/actions'
import { useEffect, useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import { ProductList } from './ProductList'
import { useRouter } from 'next/navigation'

export const ProductUploadForm = () => {
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [jsonData, setJsonData] = useState('')
  const router = useRouter()

  const previewData = () => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target?.result
        if (data) {
          console.log('data===>', data)
          const workbook = XLSX.read(data, { type: 'binary' })

          //SheetName
          const sheetName = workbook.SheetNames[0]

          //Worksheet
          const workSheet = workbook.Sheets[sheetName]

          //Json
          const json = XLSX.utils.sheet_to_json(workSheet)
          setJsonData(JSON.stringify(json, null, 2))
        }
      }

      reader.readAsArrayBuffer(file)
    }
  }

  const saveData = () => {
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const data = e.target?.result

        if (data) {
          console.log('data===>', data)
          const workbook = XLSX.read(data, { type: 'binary' })

          //SheetName
          const sheetName = workbook.SheetNames[0]

          //Worksheet
          const workSheet = workbook.Sheets[sheetName]

          //Json
          const json: ICreateProductProps[] = XLSX.utils.sheet_to_json(workSheet)

          try {
            await createBulkProduct(JSON.parse(JSON.stringify(json)))
            router.refresh()
          } catch (error) {
            console.log(error)
          }
        }
      }

      reader.readAsArrayBuffer(file)
    }
  }

  return (
    <>
      <p>{fileName}</p>
      <pre>{jsonData}</pre>
      <button onClick={previewData}>프리뷰 버튼</button>
      <button onClick={saveData}>데이터 업로드 버튼</button>

      <fieldset>
        <label htmlFor="upload">업로드 버튼</label>
        <input
          id="upload"
          onChange={(e) => {
            setFile(e.target.files ? e.target.files[0] : null)
          }}
          type="file"
          accept=".xlsx, .xls"
          className="cursor-pointer"
        />
      </fieldset>
    </>
  )
}
