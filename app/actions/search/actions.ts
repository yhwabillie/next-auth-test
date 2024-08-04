'use server'
import prisma from '@/lib/prisma'
import { Product } from '../upload-product/actions'

interface SearchProductsParams {
  query: string
  page: number
  pageSize: number
}

export const searchProducts = async ({ query, page, pageSize }: SearchProductsParams): Promise<{ products: Product[]; totalProducts: number }> => {
  const skip = (page - 1) * pageSize
  const take = pageSize

  const [products, totalProducts] = await prisma.$transaction([
    prisma.product.findMany({
      where: {
        OR: [{ name: { contains: query, mode: 'insensitive' } }, { category: { contains: query, mode: 'insensitive' } }],
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({
      where: {
        OR: [{ name: { contains: query, mode: 'insensitive' } }, { category: { contains: query, mode: 'insensitive' } }],
      },
    }),
  ])

  return { products, totalProducts }
}
