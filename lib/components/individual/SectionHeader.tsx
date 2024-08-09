'use client'

interface SectionHeaderProps {
  title: string
  desc: string
}

export const SectionHeader = ({ title, desc }: SectionHeaderProps) => {
  return (
    <header className="mt-5 rounded-lg bg-white p-10 drop-shadow-sm">
      <h3 className="mb-2 block text-2xl font-semibold">{title}</h3>
      <p className="tracking-tighter">{desc}</p>
    </header>
  )
}
