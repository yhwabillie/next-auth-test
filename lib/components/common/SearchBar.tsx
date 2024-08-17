'use client'
import { ProductType } from '@/app/actions/products/actions'
import { useProductsStore } from '@/lib/stores/productsStore'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { IoSearch } from 'react-icons/io5'

export const SearchBar = () => {
  const router = useRouter()
  const [isFocus, setIsFocus] = useState(false)
  const [inputValue, setInputValue] = useState('') // 검색어를 상태로 관리
  const { setSearchQuery, selectSearchResult, autoCompleteSuggestions, loading } = useProductsStore()

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    setSearchQuery(event.target.value)
  }

  const handleSearch = () => {
    const query = inputValue.trim()

    if (query) {
      router.push(`/search?query=${query}`)
      setIsFocus(false)
      setInputValue('') // 검색어 초기화
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setIsFocus(true)

    if (event.key === 'Enter') {
      // 상태가 업데이트된 이후에 검색을 실행하도록 비동기 처리
      setTimeout(() => {
        handleSearch()
        setInputValue('') // 검색어 초기화
      }, 0)
    }
  }

  const handleSuggestionClick = (suggestion: ProductType) => {
    selectSearchResult(suggestion)
    setSearchQuery(suggestion.name)
    setIsFocus(false)
    router.push(`/search?query=${suggestion.name}`)

    setInputValue('') // 검색어 초기화
  }

  return (
    <fieldset className="relative z-20 w-full">
      <div
        className={clsx(
          'relative mx-auto flex h-[38px] w-[400px] items-center justify-between rounded-[19px] border-[1px] border-blue-400 bg-blue-400 py-3 pl-6 pr-3 shadow-md',
          {
            '!border-white': isFocus,
          },
        )}
      >
        <input
          value={inputValue}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocus(true)}
          onChange={handleInputChange}
          type="search"
          title="검색어"
          placeholder="제품, 카테고리 검색"
          className="w-[calc(100%-32px)] bg-blue-400 text-white placeholder:text-white/50 focus:outline-0"
        />
        <button type="button" className="bg-blue-400 pl-3" onClick={handleSearch}>
          <IoSearch className="text-xl text-white" />
        </button>

        {isFocus && (
          <div className="absolute left-0 top-[40px] flex w-full flex-col justify-between rounded-2xl bg-blue-300 px-4 pb-2 pt-4 text-sm shadow-md">
            <div className="min-h-[120px]">
              {loading && <p>Loading...</p>}
              {/* 자동완성 결과 */}
              {autoCompleteSuggestions.length > 0 && !loading && (
                <ul className="pb-4">
                  {autoCompleteSuggestions.map((suggestion, index) => (
                    <li
                      key={suggestion.idx}
                      onMouseDown={() => handleSuggestionClick(suggestion)} // 클릭 시 focus 유지
                      className="autocomplete-item cursor-pointer p-1 hover:bg-gray-200"
                    >
                      <strong>{suggestion.name}</strong> - <span className="text-sm text-gray-600">{suggestion.category}</span>
                    </li>
                  ))}
                </ul>
              )}

              {autoCompleteSuggestions.length === 0 && !loading && (
                <p className="text-center font-semibold">
                  '제품이름' 혹은 '카테고리'를 검색하여 <br /> 자동완성기능을 이용해보세요
                </p>
              )}
            </div>

            <div className="flex items-center justify-end border-t border-white/50 px-2 pt-2">
              <button type="button" className="text-xs font-semibold text-black" onClick={() => setIsFocus(false)}>
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </fieldset>
  )
}
