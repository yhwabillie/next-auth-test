import { create } from 'zustand'
import { toast } from 'sonner'
import { fetchProducts, ProductType, toggleProductToCart, toggleWishStatus } from '@/app/actions/products/actions'
import { debounce } from '../debounce'

interface ProductsStore {
  //data idx
  userIdx: string
  setUserIdx: (userIdx: string) => void

  //session update
  sessionUpdate: ((data: any) => void) | null
  setSessionUpdate: (updateMethod: (data: any) => void) => void

  //autoComplete
  searchQuery: string
  autoCompleteSuggestions: ProductType[]
  setSearchQuery: (query: string) => void
  fetchAutoCompleteSuggestions: (query: string) => void
  selectSearchResult: (selectedProduct: ProductType) => void

  //category
  data: ProductType[]
  filteredData: ProductType[]
  searchResult: ProductType[]
  isEmpty: boolean
  category: string[]
  selectedCategory: string
  totalProducts: number
  currentPage: number
  hasMore: boolean
  loading: boolean
  setCategoryFilter: (category: string) => void
  fetchData: (page: number, pageSize: number) => Promise<void>
  loadMoreData: (page: number, pageSize: number) => Promise<void>
  resetStore: () => void
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  //data idx
  userIdx: '',
  setUserIdx: (userIdx: string) => set({ userIdx }),

  //session update
  sessionUpdate: null,
  setSessionUpdate: (updateMethod) => set({ sessionUpdate: updateMethod }),

  //auto complete
  searchQuery: '',
  autoCompleteSuggestions: [],
  setSearchQuery: (query: string) => {
    set({ searchQuery: query })
    get().fetchAutoCompleteSuggestions(query) // 자동완성 결과 가져오기
  },
  // 카테고리와 이름을 기준으로 자동완성 결과 가져오기
  fetchAutoCompleteSuggestions: debounce(async (query: string) => {
    if (!query.trim()) {
      set({ autoCompleteSuggestions: [] })
      return
    }

    const { userIdx, data } = get()
    set({ loading: true })

    try {
      // 이름과 카테고리로 검색어 필터링
      const suggestions = data.filter(
        (product) => product.name.toLowerCase().includes(query.toLowerCase()) || product.category.toLowerCase().includes(query.toLowerCase()),
      )

      set({ autoCompleteSuggestions: suggestions })
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      toast.error('자동완성 데이터를 가져오는 중 오류가 발생했습니다.')
    } finally {
      set({ loading: false })
    }
  }, 300),

  selectSearchResult: (selectedProduct: ProductType) => {
    const { data, setCategoryFilter } = get()

    // 선택된 제품만 필터링
    const filteredData = data.filter((product) => product.idx === selectedProduct.idx)

    // 검색 결과를 고정시키고 다른 로직이 실행되지 않도록 설정
    set({
      searchResult: filteredData,
    })
  },

  //category
  data: [],
  filteredData: [],
  searchResult: [],
  isEmpty: false,
  category: [],
  selectedCategory: '전체',
  totalProducts: 0,
  currentPage: 1,
  hasMore: true,
  loading: false,

  // 카테고리 필터링
  setCategoryFilter: (category: string) => {
    const { data } = get()
    const filteredData = category === '전체' ? data : data.filter((product) => product.category === category)
    set({
      selectedCategory: category,
      filteredData,
      currentPage: 1, // 필터 변경 시 페이지 초기화
      hasMore: true, // 새로 필터링하면 더 가져올 데이터가 있을 수 있음
    })
  },

  fetchData: async (page: number, pageSize: number): Promise<void> => {
    const { userIdx } = get()

    set({ loading: true })

    try {
      const { products, totalProducts } = await fetchProducts({ userIdx, page, pageSize })

      set({
        data: products,
        filteredData: products,
        category: Array.from(new Set(products.map((product) => product.category))),
        totalProducts,
        isEmpty: products.length === 0,
      })
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('상품 데이터를 가져오는 중 오류가 발생했습니다.')
    } finally {
      set({ loading: false })
    }
  },

  // 무한 스크롤을 위한 데이터 로드
  loadMoreData: async (page: number, pageSize: number) => {
    const { userIdx, selectedCategory, data } = get()

    set({ loading: true })

    try {
      const { products } = await fetchProducts({ userIdx, page, pageSize })

      // 추가된 데이터를 기존 데이터에 병합
      const mergedData = [...data, ...products]
      const filteredData = selectedCategory === '전체' ? mergedData : mergedData.filter((product) => product.category === selectedCategory)

      set({
        data: mergedData,
        filteredData,
        isEmpty: products.length === 0,
      })
    } catch (error) {
      console.error('Error fetching more products:', error)
      toast.error('추가 데이터를 가져오는 중 오류가 발생했습니다.')
    } finally {
      set({ loading: false })
    }
  },

  // 스토어 초기화 (필요에 따라 사용)
  resetStore: () =>
    set({
      data: [],
      filteredData: [],
      category: [],
      selectedCategory: '전체',
      currentPage: 1,
      hasMore: true,
      loading: false,
    }),
}))
