'use server'
import prisma from '@/lib/prisma'

interface FetchProductsParams {
  page: number
  pageSize: number
}

export const fetchProducts = async ({ page, pageSize }: FetchProductsParams) => {
  const skip = (page - 1) * pageSize
  const take = pageSize

  const [products, totalProducts] = await prisma.$transaction([
    prisma.product.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count(),
  ])

  return { products, totalProducts }
}
