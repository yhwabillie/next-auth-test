'use server'
import prisma from '@/lib/prisma'

export interface ICreateProductProps {
  name: string
  category: string
  original_price: number
  discount_rate?: number
  imageUrl: string
}

export const createProduct = async (data: ICreateProductProps) => {
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

export const createBulkProduct = async (products: ICreateProductProps[]) => {
  try {
    for (const product of products) {
      await createProduct(product)
    }
  } catch (error) {
    console.log(error)
  }
}

export const fetchAllProducts = async () => {
  try {
    const data = await prisma.product.findMany({
      select: {
        idx: true,
        name: true,
        category: true,
      },
    })

    if (!data) {
      throw new Error('data not found')
    }

    console.log('=======>', data)

    return data
  } catch (error: any) {
    throw new Error(error)
  }
}
