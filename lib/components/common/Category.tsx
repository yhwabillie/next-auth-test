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
      <ul className="mx-auto box-border grid grid-cols-6 gap-3 px-8 pt-10 md:w-fit md:grid-cols-8 md:rounded-lg md:bg-white md:p-5 lg:grid-cols-10 xl:grid-cols-12">
        <li onClick={() => setCategoryFilter('전체')}>
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
          <button onClick={() => setCategoryFilter('뷰티')}>
            <p
              className={clsx('mx-auto mb-1 flex h-[42px] w-[42px] items-center justify-center rounded-lg border shadow-sm', {
                'border-blue-600/50 bg-blue-100': selectedCategory === '뷰티',
              })}
            >
              <MdOutlineSmartToy
                className={clsx('text-4xl', {
                  'text-blue-600': selectedCategory === '뷰티',
                })}
              />
            </p>
            <p
              className={clsx('text-center text-sm', {
                'text-blue-600': selectedCategory === '뷰티',
              })}
            >
              뷰티
            </p>
          </button>
        </li>
        <li className="mx-auto w-fit">
          <button onClick={() => setCategoryFilter('가전/디지털')}>
            <p
              className={clsx('mx-auto mb-1 flex h-[42px] w-[42px] items-center justify-center rounded-lg border shadow-sm', {
                'border-blue-600/50 bg-blue-100': selectedCategory === '가전/디지털',
              })}
            >
              <MdOutlineSmartToy
                className={clsx('text-4xl', {
                  'text-blue-600': selectedCategory === '가전/디지털',
                })}
              />
            </p>
            <p
              className={clsx('text-center text-sm', {
                'text-blue-600': selectedCategory === '가전/디지털',
              })}
            >
              가전/디지털
            </p>
          </button>
        </li>
        <li className="mx-auto w-fit">
          <button onClick={() => setCategoryFilter('식품')}>
            <p
              className={clsx('mx-auto mb-1 flex h-[42px] w-[42px] items-center justify-center rounded-lg border shadow-sm', {
                'border-blue-600/50 bg-blue-100': selectedCategory === '식품',
              })}
            >
              <MdOutlineSmartToy
                className={clsx('text-4xl', {
                  'text-blue-600': selectedCategory === '식품',
                })}
              />
            </p>
            <p
              className={clsx('text-center text-sm', {
                'text-blue-600': selectedCategory === '식품',
              })}
            >
              식품
            </p>
          </button>
        </li>
        <li className="mx-auto w-fit">
          <button onClick={() => setCategoryFilter('인테리어')}>
            <p
              className={clsx('mx-auto mb-1 flex h-[42px] w-[42px] items-center justify-center rounded-lg border shadow-sm', {
                'border-blue-600/50 bg-blue-100': selectedCategory === '인테리어',
              })}
            >
              <MdOutlineSmartToy
                className={clsx('text-4xl', {
                  'text-blue-600': selectedCategory === '인테리어',
                })}
              />
            </p>
            <p
              className={clsx('text-center text-sm', {
                'text-blue-600': selectedCategory === '인테리어',
              })}
            >
              인테리어
            </p>
          </button>
        </li>
        <li className="mx-auto w-fit">
          <button onClick={() => setCategoryFilter('스포츠/레저')}>
            <p
              className={clsx('mx-auto mb-1 flex h-[42px] w-[42px] items-center justify-center rounded-lg border shadow-sm', {
                'border-blue-600/50 bg-blue-100': selectedCategory === '스포츠/레저',
              })}
            >
              <MdOutlineSmartToy
                className={clsx('text-4xl', {
                  'text-blue-600': selectedCategory === '스포츠/레저',
                })}
              />
            </p>
            <p
              className={clsx('text-center text-sm', {
                'text-blue-600': selectedCategory === '스포츠/레저',
              })}
            >
              스포츠/레저
            </p>
          </button>
        </li>
        {/* <li className="mx-auto w-fit">
          <button onClick={() => setCategoryFilter('생활용품')}>
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
        <li className="mx-auto w-fit">
          <button onClick={() => setCategoryFilter('생활용품')}>
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
        <li className="mx-auto w-fit">
          <button onClick={() => setCategoryFilter('생활용품')}>
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
        <li className="mx-auto w-fit">
          <button onClick={() => setCategoryFilter('생활용품')}>
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
        <li className="mx-auto w-fit">
          <button onClick={() => setCategoryFilter('생활용품')}>
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
        <li className="mx-auto w-fit">
          <button onClick={() => setCategoryFilter('생활용품')}>
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
        </li> */}
      </ul>
    </>
  )
}
