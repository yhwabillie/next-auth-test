import { useProductsStore } from '@/lib/stores/productsStore'
import clsx from 'clsx'
import { MdOutlineSmartToy } from 'react-icons/md'

interface CategoryProps {
  setCategoryFilter: (category: string) => void
  selectedCategory: string
}

export const Category = ({ setCategoryFilter, selectedCategory }: CategoryProps) => {
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

          <li className="mx-auto w-fit">
            <button onClick={() => setCategoryFilter('데코/조명')} className="mx-auto block">
              <p
                className={clsx('mx-auto mb-1 flex h-[42px] w-[42px] items-center justify-center rounded-lg border shadow-sm', {
                  'border-blue-600/50 bg-blue-100': selectedCategory === '데코/조명',
                })}
              >
                <MdOutlineSmartToy
                  className={clsx('text-4xl', {
                    'text-blue-600': selectedCategory === '데코/조명',
                  })}
                />
              </p>
              <p
                className={clsx('text-center text-sm', {
                  'text-blue-600': selectedCategory === '데코/조명',
                })}
              >
                데코/조명
              </p>
            </button>
          </li>
          <li className="mx-auto w-fit">
            <button onClick={() => setCategoryFilter('디지털/핸드폰')} className="mx-auto block">
              <p
                className={clsx('mx-auto mb-1 flex h-[42px] w-[42px] items-center justify-center rounded-lg border shadow-sm', {
                  'border-blue-600/50 bg-blue-100': selectedCategory === '디지털/핸드폰',
                })}
              >
                <MdOutlineSmartToy
                  className={clsx('text-4xl', {
                    'text-blue-600': selectedCategory === '디지털/핸드폰',
                  })}
                />
              </p>
              <p
                className={clsx('text-center text-sm', {
                  'text-blue-600': selectedCategory === '디지털/핸드폰',
                })}
              >
                디지털/핸드폰
              </p>
            </button>
          </li>
          <li className="mx-auto w-fit">
            <button onClick={() => setCategoryFilter('캐릭터인형')} className="mx-auto block">
              <p
                className={clsx('mx-auto mb-1 flex h-[42px] w-[42px] items-center justify-center rounded-lg border shadow-sm', {
                  'border-blue-600/50 bg-blue-100': selectedCategory === '캐릭터인형',
                })}
              >
                <MdOutlineSmartToy
                  className={clsx('text-4xl', {
                    'text-blue-600': selectedCategory === '캐릭터인형',
                  })}
                />
              </p>
              <p
                className={clsx('text-center text-sm', {
                  'text-blue-600': selectedCategory === '캐릭터인형',
                })}
              >
                캐릭터인형
              </p>
            </button>
          </li>
          <li className="mx-auto w-fit">
            <button onClick={() => setCategoryFilter('생활용품')} className="mx-auto block">
              <p
                className={clsx('mx-auto mb-1 flex h-[42px] w-[42px] items-center justify-center rounded-lg border shadow-sm', {
                  'border-blue-600/50 bg-blue-100': selectedCategory === '생활용품',
                })}
              >
                <MdOutlineSmartToy
                  className={clsx('text-4xl', {
                    'text-blue-600': selectedCategory === '생활용품',
                  })}
                />
              </p>
              <p
                className={clsx('text-center text-sm', {
                  'text-blue-600': selectedCategory === '생활용품',
                })}
              >
                생활용품
              </p>
            </button>
          </li>
        </>
      </ul>
    </>
  )
}
