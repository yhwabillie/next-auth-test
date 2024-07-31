'use server'
import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server'

// model Product {
//     idx            String   @id @default(uuid())
//     name           String
//     category       String
//     original_price Int // 정가
//     discount_rate  Float? // 할인율 (0~100, 선택적)
//     imageUrl       String
//     createdAt      DateTime @default(now())
//     updatedAt      DateTime @updatedAt
//   }

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

export const createBulkProduct = async (products: ICreateProductProps[]) => {
  try {
    for (const product of products) {
      await createProduct(product)
    }
  } catch (error) {
    console.log(error)
  }
}

export const getProducts = async () => {
  try {
    const products = await prisma.product.findMany()
    return products
  } catch (error) {
    console.log(error)
  }
}
