'use client'
import { Product } from '@prisma/client'
import React, { useState, useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: any
  product: Product
  onSave: any
}

export const ProductItemModal: React.FC<ModalProps> = ({ isOpen, onClose, product, onSave }) => {
  const [editedProduct, setEditedProduct] = useState<Product>(product)

  useEffect(() => {
    setEditedProduct(product)
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setEditedProduct({
      ...editedProduct,
      [name]: name === 'discount_rate' || name === 'original_price' ? parseFloat(value) : value,
    })
  }

  const handleSave = () => {
    onSave(editedProduct)
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-11/12 rounded bg-white p-6 shadow-lg md:w-1/2 lg:w-1/3">
        <h2 className="mb-4 text-xl font-bold">Edit Product</h2>
        <div className="mb-4">
          <label className="mb-1 block">Product Name:</label>
          <input type="text" name="name" value={editedProduct.name} onChange={handleChange} className="w-full rounded border px-3 py-2" />
        </div>
        <div className="mb-4">
          <label className="mb-1 block">Price:</label>
          <input
            type="number"
            name="original_price"
            value={editedProduct.original_price}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block">Discount Rate:</label>
          <input
            type="number"
            name="discount_rate"
            value={editedProduct.discount_rate ? editedProduct.discount_rate : 0}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block">Image URL:</label>
          <input type="text" name="imageUrl" value={editedProduct.imageUrl} onChange={handleChange} className="w-full rounded border px-3 py-2" />
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 rounded bg-gray-500 px-4 py-2 text-white">
            Cancel
          </button>
          <button onClick={handleSave} className="rounded bg-blue-500 px-4 py-2 text-white">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
