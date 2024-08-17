import { useProductsStore } from '@/lib/stores/productsStore'
import clsx from 'clsx'
import { MdOutlineSmartToy } from 'react-icons/md'

interface CategoryProps {
  category: string[]
  setCategoryFilter: (category: string) => void
  selectedCategory: string
}

export const Category = ({ category, setCategoryFilter, selectedCategory }: CategoryProps) => {
  return (
    <>
      <h3 className="sr-only">카테고리</h3>
      <ul className="mb-4 grid grid-cols-12 gap-5 rounded-xl bg-white p-5 shadow-sm">
        <>
          <li onClick={() => setCategoryFilter('전체')} className="mx-auto w-fit">
            <button className="mx-auto block">
              <p
                className={clsx('mx-auto mb-1 flex h-[42px] w-[42px] items-center justify-center rounded-lg border shadow-sm', {
                  'border-blue-600/50 bg-blue-100': selectedCategory === '전체',
                })}
              >
                <MdOutlineSmartToy
                  className={clsx('text-4xl', {
                    'text-blue-600': selectedCategory === '전체',
                  })}
                />
              </p>
              <p
                className={clsx('text-center text-sm', {
                  'text-blue-600': selectedCategory === '전체',
                })}
              >
                전체
              </p>
            </button>
          </li>

          {category.map((item, index) => (
            <li key={index} className="mx-auto w-fit">
              <button onClick={() => setCategoryFilter(item)} className="mx-auto block">
                <p
                  className={clsx('mx-auto mb-1 flex h-[42px] w-[42px] items-center justify-center rounded-lg border shadow-sm', {
                    'border-blue-600/50 bg-blue-100': selectedCategory === item,
                  })}
                >
                  <MdOutlineSmartToy
                    className={clsx('text-4xl', {
                      'text-blue-600': selectedCategory === item,
                    })}
                  />
                </p>
                <p
                  className={clsx('text-center text-sm', {
                    'text-blue-600': selectedCategory === item,
                  })}
                >
                  {item}
                </p>
              </button>
            </li>
          ))}
        </>
      </ul>
    </>
  )
}
