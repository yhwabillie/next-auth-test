'use server'
import prisma from '@/lib/prisma'

export interface Product {
  idx: string
  name: string
  category: string
  original_price: number
  discount_rate: number | null
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

/** admin 상품 데이터 업로드
 * - 상품 데이터 fetch
 * @param {number} page - 페이지 번호
 * @param {number} limit - 페이지당 항목 수
 * @param {string | null} category - 필터링할 카테고리 (선택 사항)
 * @returns {Promise<{ products: Product[], totalProducts: number }>}
 * */
export const fetchProducts = async (
  page: number,
  limit: number,
  category: string | null,
): Promise<{ products: Product[]; totalProducts: number }> => {
  try {
    const skip = (page - 1) * limit
    const where = category ? { category } : {}

    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        where,
      }),
      prisma.product.count({
        where,
      }),
    ])

    return { products, totalProducts }
  } catch (error: any) {
    throw new Error(error)
  }
}

/** admin 상품 데이터 업로드
 * - 상품 카테고리 데이터 fetch
 */
export const fetchCategories = async (): Promise<string[]> => {
  try {
    const categories = await prisma.product.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
    })

    return categories.map((item) => item.category)
  } catch (error: any) {
    throw new Error(error)
  }
}

/** admin 상품 데이터 업로드
 * - 상품 데이터 CREATE
 * */
export const createProduct = async (data: Product) => {
  try {
    const products = await prisma.product.create({
      data: {
        name: data.name,
        category: data.category,
        original_price: data.original_price,
        discount_rate: data.discount_rate,
        imageUrl: data.imageUrl,
      },
    })

    return products
  } catch (error) {
    console.log(error)
  }
}

export const deleteSelectedProductsByIdx = async (products: any) => {
  // try {
  //   // 모든 삭제 작업을 병렬로 실행
  //   const deletePromises = Object.keys(products).map((productIdx) => {
  //     console.log(`Deleting product with ID: ${productIdx}`)
  //     return prisma.product.delete({
  //       where: {
  //         idx: productIdx,
  //       },
  //     })
  //   })
  //   await Promise.all(deletePromises)
  //   return { success: true }
  // } catch (error) {
  //   console.error('Error deleting selected products:', error)
  //   throw new Error('Failed to delete selected products')
  // }
  try {
    console.log(products)
    for (const product of Object.keys(products)) {
      await prisma.product.delete({
        where: {
          idx: product,
        },
      })
    }

    return { success: true }
  } catch (error) {
    console.log(error)
  }
}

export const createBulkProduct = async (products: Product[]) => {
  try {
    for (const product of products) {
      await createProduct(product)
    }
  } catch (error) {
    console.log(error)
  }
}
