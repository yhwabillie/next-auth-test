'use client'

interface SectionHeaderProps {
  title: string
  desc: string
}

export const SectionHeader = ({ title, desc }: SectionHeaderProps) => {
  return (
    <header className="mb-4 mt-2 rounded-lg bg-white p-6 drop-shadow-sm md:p-10">
      <h3 className="mb-2 block text-2xl font-semibold">{title}</h3>
      <p className="tracking-tighter">{desc}</p>
    </header>
  )
}
