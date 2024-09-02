'use client'

interface SectionHeaderProps {
  title: string
  desc: string
}

export const SectionHeader = ({ title, desc }: SectionHeaderProps) => {
  return (
    <header className="mx-4 mb-4 mt-2 rounded-lg bg-white p-6 drop-shadow-sm md:mx-0 md:w-full md:p-10">
      <h3 className="mb-1 block text-xl font-semibold tracking-tighter md:mb-2 md:text-2xl">{title}</h3>
      <p className="text-sm tracking-tighter md:text-[16px]">{desc}</p>
    </header>
  )
}
