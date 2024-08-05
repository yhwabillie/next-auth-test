'use server'
import { TabMenu } from '@/lib/components/individual/TabMenu'

export default async function Page() {
  return (
    <section>
      <h2 className="sr-only">마이쇼핑</h2>
      <div>
        <h3>MY SHOPPING</h3>
        <TabMenu />
      </div>
    </section>
  )
}
