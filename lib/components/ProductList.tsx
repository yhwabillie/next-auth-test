'use client'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Button } from './Button'
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaCheck } from 'react-icons/fa'
import { deleteSelectedProductsByIdx, fetchCategories, fetchProducts, UpdateProduct, updateProduct } from '@/app/actions/upload-product/actions'
import { useProductStore } from '../zustandStore'
import { toast } from 'sonner'
import { LoadingSpinner } from './LoadingSpinner'
import { Product } from '@prisma/client'
import * as XLSX from 'xlsx'
import { ProductItemModal } from './ProductItemModal'

interface CheckedItem {
  [key: string]: boolean
}

export const ProductList = () => {
  const checkAllRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const pageLimit = 10
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [data, setData] = useState<Product[]>([])
  const [checkedItems, setCheckedItems] = useState<CheckedItem>({})
  const [isAllChecked, setIsAllChecked] = useState(false)

  const { productState } = useProductStore()
  const { setProductState } = useProductStore((state) => state)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  /**
   * - checkedItems 객체 내의 값들이 모두 true인지 확인하여 모든 아이템이 체크되었는지 확인
   * - 모든 아이템이 체크되었으면 checkAllRef를 업데이트
   * - checkAllRef : 전체 체크 input element ref
   * - checkedItems : DB에 최종 저장되는 결과 state
   */
  const updateCheckAllStatus = () => {
    const checkedItemsArray = Object.values(checkedItems)
    const checkedCount = checkedItemsArray.filter((item) => item === true).length
    const totalItems = data?.length ?? 0

    if (checkedCount === totalItems && totalItems > 0) {
      setIsAllChecked(true)
      if (checkAllRef.current) {
        checkAllRef.current.checked = true
      }
    } else {
      setIsAllChecked(false)
      if (checkAllRef.current) {
        checkAllRef.current.checked = false
      }
    }
  }

  /**
   * - 상품 리스트에서 삭제된 항목 제거
   * - 선택된 제품 idx가 같은 데이터를 data 배열에서 삭제
   * @param {Product[]} array - 최초 fetch data 배열
   * @param {Record<string, boolean>} selectedItems - 선택된 제품 idx와 그 상태를 가진 객체
   * @returns {Product[]} - 선택된 제품이 제거된 새로운 데이터 배열
   */
  const removeMatchingProducts = (array: Product[], selectedItems: Record<string, boolean>): Product[] => {
    return array.filter((item) => !selectedItems.hasOwnProperty(item.idx))
  }

  /**
   * 선택된 item을 삭제하고 상태를 업데이트하는 event handler 함수
   */
  const handleDeleteSelected = async () => {
    console.log('서버로 저장되는 데이터===>', checkedItems)

    //item이 체크되면 true값을 할당, 값이 true인 것을 필터링
    const selectedItems = Object.keys(checkedItems).reduce((acc: CheckedItem, key: string) => {
      if (checkedItems[key]) {
        acc[key] = checkedItems[key]
      }
      return acc
    }, {})

    console.log('잔여 데이터에서 빼야하는 데이터===>', selectedItems)
    setDeleteLoading(true) // 로딩 시작

    //DB mutate
    try {
      await deleteSelectedProductsByIdx(selectedItems)
      console.log('서버에서 삭제 성공')

      // 상태 초기화 및 업데이트
      setCheckedItems({})

      data?.forEach((item: Product) => {
        updateCheckedItem(item.idx, false)
      })

      console.log('잔여 데이터', data)
      setIsAllChecked(false)

      if (!checkAllRef.current) return
      checkAllRef.current.checked = false

      console.log('최종 잔여 데이터', removeMatchingProducts(data, selectedItems))
      setData(removeMatchingProducts(data, selectedItems))
    } catch (error) {
      console.error('Failed to delete selected products:', error)
      toast.error('선택한 제품을 삭제하는 데 실패했습니다. 다시 시도해주세요.')
    } finally {
      setDeleteLoading(false) // 로딩 상태 해제
    }

    //삭제후 DB를 다시 fetch, 로딩 시작
    fetchData(currentPage, selectedCategory)
    setLoading(true)
  }

  /**
   * - 개별 체크박스 클릭 시 isChecked 값을 checkItems state에 저장 (toggle)
   * - 신규 isChecked와 기존 isChecked의 값이 같다면 반대 값으로 업데이트 (idx 비교)
   * - 같지 않으면 신규 값으로 업데이트
   * @param {string} key - 체크박스의 제품 키값
   * @param {boolean} isChecked - 체크 여부
   */
  const toggleCheckedItem = (key: string, isChecked: boolean) => {
    setCheckedItems((prev) => {
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

  /**
   * - 개별 체크박스 클릭 시 isChecked 값을 checkItems state에 저장 (toggle)
   * - 무조건 할당된 isChecked value를 신규값으로 업데이트
   * @param {string} key - 체크박스의 제품 키값
   * @param {boolean} isChecked - 체크 여부
   */
  const updateCheckedItem = (key: string, isChecked: boolean) => {
    setCheckedItems((prev) => {
      const updatedItems = { ...prev }

      updatedItems[key] = isChecked

      return updatedItems
    })
  }

  /**
   * isChecked 값을 모든 checkedItems 항목에 대해 업데이트
   * @param {boolean} isChecked - 체크 여부
   */
  const updateAllValues = (isChecked: boolean) => {
    setCheckedItems((prevItems) => {
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

  /**
   * products DB 데이터 GET
   * @param {number} page - 현재 페이지
   * @param {string | null} category - 필터링할 카테고리 (선택 사항)
   */
  const fetchData = async (page: number, category: string | null) => {
    try {
      const { products, totalProducts } = await fetchProducts(page, pageLimit, category)
      setData(products)
      setTotalPages(Math.ceil(totalProducts / pageLimit))
      setCurrentPage(page)
    } catch (error: any) {
      console.error('Failed to fetch products:', error) // 디버그용
      toast.error('데이터 fetch에 실패했습니다, 다시 시도해주세요.') // 사용자 알림용
    } finally {
      setLoading(false)
    }
  }

  /**
   * 현재 페이지 변경
   * @param page - 현재 페이지
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  /**
   * 현재 페이지를 기준으로 앞뒤로 1 페이지 버튼만 표시
   */
  const renderPaginationButtons = () => {
    const pageButtons = []

    // 맨 앞으로 화살표 버튼
    if (currentPage > 1) {
      pageButtons.push(
        <button key="first" className="h-10 w-10 bg-pink-400" onClick={() => handlePageChange(1)}>
          <FaAngleDoubleLeft />
        </button>,
      )
    }

    // 이전 화살표 버튼 (1번째 페이지가 아닐 경우 show)
    if (currentPage > 1) {
      pageButtons.push(
        <button key="prev" className="h-10 w-10 bg-gray-400" onClick={() => handlePageChange(currentPage - 1)}>
          <FaAngleLeft />
        </button>,
      )
    }

    // 이전 페이지 버튼 (1번째 페이지가 아닐 경우 show)
    if (currentPage > 1) {
      pageButtons.push(
        <button key={currentPage - 1} className="h-10 w-10 bg-blue-400" onClick={() => handlePageChange(currentPage - 1)}>
          {currentPage - 1}
        </button>,
      )
    }

    // 현재 페이지 버튼 (항상 show)
    pageButtons.push(
      <button key="current" className="h-10 w-10 bg-blue-600" disabled>
        {currentPage}
      </button>,
    )

    // 다음 페이지 버튼 (마지막 페이지가 아닐 경우 show)
    if (currentPage < totalPages) {
      pageButtons.push(
        <button key={currentPage + 1} className="h-10 w-10 bg-blue-400" onClick={() => handlePageChange(currentPage + 1)}>
          {currentPage + 1}
        </button>,
      )
    }

    // 다음 화살표 버튼 (마지막 페이지가 아닐 경우 show)
    if (currentPage < totalPages) {
      pageButtons.push(
        <button key="next" className="h-10 w-10 bg-gray-400" onClick={() => handlePageChange(currentPage + 1)}>
          <FaAngleRight />
        </button>,
      )
    }

    // 맨 뒤로 화살표 버튼
    if (currentPage < totalPages) {
      pageButtons.push(
        <button key="last" className="h-10 w-10 bg-pink-400" onClick={() => handlePageChange(totalPages)}>
          <FaAngleDoubleRight />
        </button>,
      )
    }

    return pageButtons
  }

  /**
   * 카테고리 데이터 가져오기
   */
  const fetchCategoryData = async () => {
    try {
      const categories = await fetchCategories()
      setCategories(categories)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  /**
   * 선택된 카테고리를 상태로 설정하고, 페이지를 첫 페이지로 리셋
   * @param {ChangeEvent<HTMLSelectElement>} event
   */
  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value)
    setCurrentPage(1)
  }

  /**
   * 상품 리스트를 엑셀 파일로 다운로드
   * - 프론트에서 필터된 상태를 반영하여 파일 생성
   * - 다운로드 연월일 시간을 파일 이름에 적용하여 버전 구별
   */
  const handleDownload = () => {
    // 필요한 칼럼을 제외한 새로운 객체 배열 생성
    const filteredProducts = data.map(({ idx, imageUrl, createdAt, updatedAt, ...rest }) => ({
      제품명: rest.name,
      카테고리: rest.category,
      정가: rest.original_price,
      할인율: rest.discount_rate,
    }))

    const worksheet = XLSX.utils.json_to_sheet(filteredProducts)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url

    const date = new Date()
    const formattedDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
    const formattedTime = `${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`
    a.download = `products_${formattedDate}_${formattedTime}${selectedCategory ? `_${selectedCategory}` : ''}.xlsx`

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  /**
   * 선택한 제품 클릭 handler event
   * - 선택한 제품의 상세 정보를 레이어 모달창 show
   * - 제품 정보를 편집할 수 있는 입력 필드와 저장 및 취소 버튼을 포함
   * @param {Product} product - 클릭된 제품 데이터
   */
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  /**
   * 함수는 모달을 닫고, 선택된 제품 정보를 초기화
   */
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  /**
   * 업데이트된 제품 정보를 서버에 저장하고, 성공적으로 저장되면 상태를 업데이트
   */
  const saveProduct = async (updatedProduct: UpdateProduct) => {
    try {
      const savedProduct = await updateProduct(updatedProduct)
      setData((prevProducts) => prevProducts.map((product) => (product.idx === savedProduct.idx ? savedProduct : product)))
      closeModal()
    } catch (error) {
      console.error('Failed to update product:', error)
    }
  }

  useEffect(() => {
    fetchData(currentPage, selectedCategory)
    fetchCategoryData()

    if (productState) {
      setLoading(true)
    }

    if (currentPage) {
      setLoading(true)
    }

    //엑셀 데이터에서 DB 업로드 분기 - 리셋
    setProductState(false)
  }, [productState, currentPage, selectedCategory])

  useEffect(() => {
    // fetch data와 checkedItems의 개수가 같으면 모두 체크
    updateCheckAllStatus()
  }, [checkedItems])

  return (
    <>
      <div className="flex flex-row justify-end gap-2">
        <div className="w-[230px]">
          <Button label="전체 Excel 다운로드" clickEvent={handleDownload} disalbe={!(data.length > 0)} />
        </div>
        <div className="w-[150px]">
          <Button label="선택 삭제" clickEvent={handleDeleteSelected} spinner={deleteLoading} disalbe={deleteLoading || !(data.length > 0)} />
        </div>
      </div>
      <select onChange={handleCategoryChange} value={selectedCategory || ''}>
        <option value="">전체</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <table className="mt-5 w-full border-collapse">
            <thead className="bg-gray-100">
              <tr className="h-10 border-b border-t border-gray-300">
                <th className="box-border w-[5%]">
                  <label
                    htmlFor="check_all"
                    className="mx-auto flex h-4 w-4 cursor-pointer items-center justify-center border border-gray-500/50 bg-white"
                  >
                    <input
                      ref={checkAllRef}
                      id="check_all"
                      type="checkbox"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        const isChecked = event.target.checked
                        const checkedItemsCount = Object.keys(checkedItems).length

                        if (isChecked) {
                          if (checkedItemsCount === 0) {
                            setIsAllChecked(true)

                            data.forEach((item: Product) => {
                              toggleCheckedItem(item.idx, true)
                            })
                          } else if (checkedItemsCount > 0) {
                            data.forEach((item: Product) => {
                              updateCheckedItem(item.idx, true)
                            })
                          }
                        } else {
                          setIsAllChecked(false)
                          updateAllValues(false)
                        }
                      }}
                    />
                    {isAllChecked && <FaCheck className="cursor-pointer text-blue-600" />}
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
              {data.map((item: Product, index: any) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="w-[5%]">
                    <label htmlFor={item.idx} className="mx-auto flex h-4 w-4 cursor-pointer items-center justify-center border border-gray-500/50">
                      <input
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          const isChecked = event.target.checked

                          toggleCheckedItem(`${item.idx}`, isChecked)

                          if (!checkAllRef.current) return
                          checkAllRef.current.checked = isChecked
                        }}
                        type="checkbox"
                        id={item.idx}
                      />
                      {checkedItems[`${item.idx}`] && <FaCheck className="cursor-pointer text-blue-600" />}
                    </label>
                  </td>
                  <td onClick={() => handleProductClick(item)} className="box-border w-[50%] break-all p-2 text-left text-sm">
                    {item.name}
                  </td>
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
          <div className="flex flex-row items-center justify-center gap-3 py-10">{renderPaginationButtons()}</div>
        </>
      )}

      {selectedProduct && <ProductItemModal isOpen={isModalOpen} onClose={closeModal} product={selectedProduct} onSave={saveProduct} />}
    </>
  )
}
