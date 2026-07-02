

// 'use client'

// import { useEffect, useState } from 'react'
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from 'recharts'
// import { getSupabaseClient } from '@/lib/supabase/client'
// import { useOrganization } from '../components/OrganizationProvider'
// import { Card } from '@/app/components/ui/Card'
// import { SkeletonStatCard } from '@/app/components/ui/Skeleton'
// import { formatCurrency } from '../../../lib/format'

// type Stats = {
//   totalRevenue: number
//   outstandingRevenue: number
//   totalInvoices: number
//   salesCount: number
//   rentalCount: number
//   totalCustomers: number
//   totalProducts: number
// }

// type RevenuePoint = {
//   date: string
//   revenue: number
// }

// type TopCustomer = {
//   name: string
//   total: number
// }

// type TopProduct = {
//   name: string
//   quantity: number
// }

// export default function DashboardPage() {
//   const supabase = getSupabaseClient()
//   const { organization } = useOrganization()

//   const [stats, setStats] = useState<Stats>({
//     totalRevenue: 0,
//     outstandingRevenue: 0,
//     totalInvoices: 0,
//     salesCount: 0,
//     rentalCount: 0,
//     totalCustomers: 0,
//     totalProducts: 0,
//   })

//   const [revenueData, setRevenueData] = useState<RevenuePoint[]>([])
//   const [typeData, setTypeData] = useState([
//     { name: 'Sales', value: 0 },
//     { name: 'Rentals', value: 0 },
//   ])
//   const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([])
//   const [topProducts, setTopProducts] = useState<TopProduct[]>([])

//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     let isMounted = true

//     const fetchData = async () => {
//       const orgId = organization.id

//       const [invoiceRes, customerRes, productRes, itemsRes] = await Promise.all([
//         supabase
//           .from('invoices')
//           .select('total, status, type, created_at, customers(name)')
//           .eq('organization_id', orgId),

//         supabase.from('customers').select('id').eq('organization_id', orgId),

//         supabase.from('products').select('id, name').eq('organization_id', orgId),

//         // invoice_items has no organization_id column of its own — its RLS
//         // policy already scopes rows to the caller's org via the parent
//         // invoice, so no explicit filter is needed here.
//         supabase.from('invoice_items').select('quantity, name'),
//       ])

//       const invoices = invoiceRes.data || []
//       const customers = customerRes.data || []
//       const products = productRes.data || []
//       const items = itemsRes.data || []

//       let totalRevenue = 0
//       let outstandingRevenue = 0
//       let salesCount = 0
//       let rentalCount = 0

//       const last30Days: Record<string, number> = {}

//       // ---- Revenue + counts ----
//       invoices.forEach((inv) => {
//         const date = new Date(inv.created_at).toLocaleDateString()

//         if (inv.status === 'paid') {
//           totalRevenue += inv.total
//           last30Days[date] = (last30Days[date] || 0) + inv.total
//         } else if (inv.status !== 'void') {
//           // Void invoices are cancelled — they're neither earned nor owed.
//           outstandingRevenue += inv.total
//         }

//         if (inv.type === 'sale') salesCount++
//         if (inv.type === 'rental') rentalCount++
//       })

//       // ---- Revenue trend ----
//       const revenueArray = Object.keys(last30Days)
//         .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
//         .map((date) => ({
//           date,
//           revenue: last30Days[date],
//         }))

//       // ---- Top Customers ----
//       const customerMap: Record<string, number> = {}

//       invoices.forEach((inv) => {
//         if (inv.status !== 'paid') return
//         const name = inv.customers?.name || 'Unknown'
//         customerMap[name] = (customerMap[name] || 0) + inv.total
//       })

//       const topCustomersArray = Object.entries(customerMap)
//         .map(([name, total]) => ({ name, total }))
//         .sort((a, b) => b.total - a.total)
//         .slice(0, 5)

//       // ---- Top Products ----
//       const productMap: Record<string, number> = {}

//       items.forEach((item) => {
//         const name = item.name || 'Product'
//         productMap[name] = (productMap[name] || 0) + item.quantity
//       })

//       const topProductsArray = Object.entries(productMap)
//         .map(([name, quantity]) => ({ name, quantity }))
//         .sort((a, b) => b.quantity - a.quantity)
//         .slice(0, 5)

//       if (!isMounted) return

//       setRevenueData(revenueArray)

//       setTypeData([
//         { name: 'Sales', value: salesCount },
//         { name: 'Rentals', value: rentalCount },
//       ])

//       setTopCustomers(topCustomersArray)
//       setTopProducts(topProductsArray)

//       setStats({
//         totalRevenue,
//         outstandingRevenue,
//         totalInvoices: invoices.length,
//         salesCount,
//         rentalCount,
//         totalCustomers: customers.length,
//         totalProducts: products.length,
//       })

//       setLoading(false)
//     }

//     fetchData()

//     return () => {
//       isMounted = false
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [organization.id])

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <h1 className="text-xl font-semibold text-dark">Dashboard</h1>
//         <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
//           {Array.from({ length: 6 }).map((_, i) => <SkeletonStatCard key={i} />)}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-xl font-semibold text-dark">Dashboard</h1>

//       {/* KPI Cards */}
//       <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
//         <StatCard title="Revenue" value={formatCurrency(stats.totalRevenue)} accent="primary" />
//         <StatCard title="Outstanding" value={formatCurrency(stats.outstandingRevenue)} accent="rental" />
//         <StatCard title="Invoices" value={stats.totalInvoices} />
//         <StatCard title="Customers" value={stats.totalCustomers} />
//         <StatCard title="Inventory" value={stats.totalProducts} />
//         <StatCard title="Sales / Rentals" value={`${stats.salesCount} / ${stats.rentalCount}`} />
//       </div>

//       {/* Charts */}
//       <div className="grid md:grid-cols-2 gap-6">
//         <Card>
//           <h2 className="text-sm font-semibold text-dark mb-4">Revenue (Paid Invoices)</h2>

//           {revenueData.length === 0 ? (
//             <EmptyChartState />
//           ) : (
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={revenueData}>
//                 <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
//                 <YAxis stroke="#94A3B8" fontSize={12} />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="revenue" stroke="#355834" strokeWidth={2} dot={false} />
//               </LineChart>
//             </ResponsiveContainer>
//           )}
//         </Card>

//         <Card>
//           <h2 className="text-sm font-semibold text-dark mb-4">Sales vs Rentals</h2>

//           {stats.salesCount + stats.rentalCount === 0 ? (
//             <EmptyChartState />
//           ) : (
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie data={typeData} dataKey="value" nameKey="name" outerRadius={100}>
//                   {/* Same color language as the sale/rental badges everywhere else */}
//                   <Cell fill="#355834" />
//                   <Cell fill="#B7791F" />
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           )}
//         </Card>
//       </div>

//       {/* Insights */}
//       <div className="grid md:grid-cols-2 gap-6">
//         {/* Top Customers */}
//         <Card>
//           <h2 className="text-sm font-semibold text-dark mb-4">Top Customers</h2>

//           {topCustomers.length === 0 ? (
//             <p className="text-sm text-muted">No paid invoices yet.</p>
//           ) : (
//             <div className="space-y-3">
//               {topCustomers.map((c, i) => (
//                 <div key={i} className="flex justify-between text-sm">
//                   <span className="text-dark">{c.name}</span>
//                   <span className="font-mono font-medium text-dark">₦{c.total.toLocaleString()}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </Card>

//         {/* Top Products */}
//         <Card>
//           <h2 className="text-sm font-semibold text-dark mb-4">Best Selling Products</h2>

//           {topProducts.length === 0 ? (
//             <p className="text-sm text-muted">No invoice items yet.</p>
//           ) : (
//             <div className="space-y-3">
//               {topProducts.map((p, i) => (
//                 <div key={i} className="flex justify-between text-sm">
//                   <span className="text-dark">{p.name}</span>
//                   <span className="font-mono font-medium text-dark">{p.quantity} sold</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </Card>
//       </div>
//     </div>
//   )
// }

// function StatCard({
//   title,
//   value,
//   accent,
// }: {
//   title: string
//   value: string | number
//   accent?: 'primary' | 'rental'
// }) {
//   return (
//     <div className="bg-white p-5 rounded-2xl border border-border">
//       <p className="text-sm text-muted">{title}</p>
//       <p
//         className={`text-xl font-semibold font-mono mt-1 ${
//           accent === 'primary' ? 'text-deepgreen' : accent === 'rental' ? 'text-rental' : 'text-dark'
//         }`}
//       >
//         {value}
//       </p>
//     </div>
//   )
// }

// function EmptyChartState() {
//   return (
//     <div className="h-[300px] flex items-center justify-center text-sm text-muted">
//       Not enough data yet
//     </div>
//   )
// }

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/app/context/ThemeContext'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useOrganization } from '../components/OrganizationProvider'
import { Card } from '@/app/components/ui/Card'
import { SkeletonStatCard } from '@/app/components/ui/Skeleton'
import { formatCurrency } from '@/lib/format'
import OnboardingChecklist from './components/OnboardingChecklist'

type Stats = {
  totalRevenue: number
  outstandingRevenue: number
  totalInvoices: number
  salesCount: number
  rentalCount: number
  totalCustomers: number
  totalProducts: number
}

type RevenuePoint = {
  date: string
  revenue: number
}

type TopCustomer = {
  name: string
  total: number
}

type TopProduct = {
  name: string
  quantity: number
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = getSupabaseClient()
  const { organization } = useOrganization()
  const { theme } = useTheme()

  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    outstandingRevenue: 0,
    totalInvoices: 0,
    salesCount: 0,
    rentalCount: 0,
    totalCustomers: 0,
    totalProducts: 0,
  })

  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([])
  const [recentInvoices, setRecentInvoices] = useState<any[]>([])
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      const orgId = organization.id

      const [invoiceRes, customerRes, productRes, itemsRes] = await Promise.all([
        supabase
          .from('invoices')
          .select('id, invoice_number, total, amount_paid, status, type, created_at, customers(name)')
          .eq('organization_id', orgId),

        supabase.from('customers').select('id').eq('organization_id', orgId),

        supabase.from('products').select('id, name').eq('organization_id', orgId),

        supabase.from('invoice_items').select('quantity, name'),
      ])

      const invoices = invoiceRes.data || []
      const customers = customerRes.data || []
      const products = productRes.data || []
      const items = itemsRes.data || []

      let totalRevenue = 0
      let outstandingRevenue = 0
      let salesCount = 0
      let rentalCount = 0

      const last30Days: Record<string, number> = {}

      invoices.forEach((inv) => {
        if (inv.status === 'void') return

        const date = new Date(inv.created_at).toLocaleDateString()
        const paid = inv.amount_paid || 0
        const remaining = inv.total - paid

        totalRevenue += paid
        outstandingRevenue += remaining
        if (paid > 0) {
          last30Days[date] = (last30Days[date] || 0) + paid
        }

        if (inv.type === 'sale') salesCount++
        if (inv.type === 'rental') rentalCount++
      })

      const revenueArray = Object.keys(last30Days)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .map((date) => ({
          date,
          revenue: last30Days[date],
        }))

      const customerMap: Record<string, number> = {}
      invoices.forEach((inv) => {
        if (!inv.amount_paid) return
        const cust = inv.customers
        const name = Array.isArray(cust) ? cust[0]?.name : cust?.name || 'Unknown'
        customerMap[name] = (customerMap[name] || 0) + inv.amount_paid
      })

      const topCustomersArray = Object.entries(customerMap)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5)

      const productMap: Record<string, number> = {}
      items.forEach((item) => {
        const name = item.name || 'Product'
        productMap[name] = (productMap[name] || 0) + item.quantity
      })

      const topProductsArray = Object.entries(productMap)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)

      const sortedInvoices = [...invoices]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)

      if (!isMounted) return

      setRevenueData(revenueArray)
      setRecentInvoices(sortedInvoices)
      setTopCustomers(topCustomersArray)
      setTopProducts(topProductsArray)

      setStats({
        totalRevenue,
        outstandingRevenue,
        totalInvoices: invoices.length,
        salesCount,
        rentalCount,
        totalCustomers: customers.length,
        totalProducts: products.length,
      })

      setLoading(false)
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [organization.id])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-dark dark:text-white">Dashboard</h1>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-100 dark:bg-[#202023] border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl h-[98px] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const maxVal = Math.max(stats.salesCount, stats.rentalCount) || 1
  const saleHeight = `${Math.max((stats.salesCount / maxVal) * 150, 10)}px`
  const rentalHeight = `${Math.max((stats.rentalCount / maxVal) * 150, 10)}px`

  return (
    <div className="space-y-6 text-dark dark:text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-dark dark:text-white">Dashboard</h1>
        <span className="text-xs text-zinc-500 dark:text-zinc-400 tracking-wider uppercase font-mono">{organization.name} workspace</span>
      </div>

      <OnboardingChecklist
        productCount={stats.totalProducts}
        customerCount={stats.totalCustomers}
        invoiceCount={stats.totalInvoices}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Revenue collected" value={formatCurrency(stats.totalRevenue, organization.currency)} accent="primary" />
        <StatCard title="Outstanding" value={formatCurrency(stats.outstandingRevenue, organization.currency)} accent="rental" />
        <StatCard title="Invoices" value={stats.totalInvoices} />
        <StatCard title="Customers" value={stats.totalCustomers} />
        <StatCard title="Inventory" value={stats.totalProducts} />
        <StatCard title="Sales / Rentals" value={`${stats.salesCount} / ${stats.rentalCount}`} />
      </div>

      {/* Charts & Mockup Panels */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Sales vs rentals bar view */}
        <Card>
          <h2 className="text-sm font-semibold text-dark dark:text-white mb-4">Sales vs rentals</h2>
          {stats.salesCount + stats.rentalCount === 0 ? (
            <EmptyChartState />
          ) : (
            <div className="flex h-[200px] items-end justify-center gap-16 pb-4 pt-4">
              <div className="flex flex-col items-center gap-3">
                <div
                  style={{ height: saleHeight }}
                  className="w-10 bg-[#1E3A8A] rounded transition-all duration-500 hover:opacity-80 shadow-[0_0_15px_rgba(30,58,138,0.2)]"
                />
                <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Sale {stats.salesCount}</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div
                  style={{ height: rentalHeight }}
                  className="w-10 bg-[#C05621] rounded transition-all duration-500 hover:opacity-80 shadow-[0_0_15px_rgba(192,86,33,0.2)]"
                />
                <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Rental {stats.rentalCount}</span>
              </div>
            </div>
          )}
        </Card>

        {/* Recent Invoices list */}
        <Card>
          <h2 className="text-sm font-semibold text-dark dark:text-white mb-4">Recent invoices</h2>
          {recentInvoices.length === 0 ? (
            <EmptyChartState />
          ) : (
            <div className="space-y-2.5">
              {recentInvoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => router.push(`/invoice/${inv.id}`)}
                  className="relative flex items-center justify-between bg-slate-50 dark:bg-[#1A1A1C] hover:bg-slate-100 dark:hover:bg-zinc-800/80 p-3 pl-5 rounded-xl border border-slate-200 dark:border-zinc-800/60 cursor-pointer transition-all"
                >
                  <div
                    className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-md ${
                      inv.type === 'sale' ? 'bg-[#1E3A8A]' : 'bg-[#C05621]'
                    }`}
                  />
                  <div className="flex items-center gap-6">
                    <span className="font-mono font-bold text-dark dark:text-zinc-100 text-sm">{inv.invoice_number}</span>
                    <span className="text-zinc-550 dark:text-zinc-400 text-sm hidden sm:inline">
                      {Array.isArray(inv.customers)
                        ? inv.customers[0]?.name
                        : inv.customers?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        inv.status === 'paid'
                          ? 'bg-green-500'
                          : inv.status === 'partial'
                          ? 'bg-purple-500'
                          : inv.status === 'draft'
                          ? 'bg-zinc-450 dark:bg-zinc-500'
                          : inv.status === 'overdue'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue Trend line chart */}
        <Card>
          <h2 className="text-sm font-semibold text-dark dark:text-white mb-4">Revenue trend (Paid Invoices)</h2>
          {revenueData.length === 0 ? (
            <EmptyChartState />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueData}>
                <XAxis dataKey="date" stroke="#71717A" fontSize={11} />
                <YAxis stroke="#71717A" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#202023' : '#ffffff', borderColor: theme === 'dark' ? '#3F3F46' : '#e2e8f0', color: theme === 'dark' ? '#ffffff' : '#0f172a' }} />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Top Customers list */}
        <Card>
          <h2 className="text-sm font-semibold text-dark dark:text-white mb-4">Top Customers</h2>
          {topCustomers.length === 0 ? (
            <p className="text-sm text-zinc-500 py-12 text-center">No paid invoices yet.</p>
          ) : (
            <div className="space-y-3 pt-2">
              {topCustomers.map((c, i) => (
                <div key={i} className="flex justify-between text-sm border-b border-slate-200 dark:border-zinc-800/50 pb-2 last:border-0 last:pb-0">
                  <span className="text-zinc-650 dark:text-zinc-200">{c.name}</span>
                  <span className="font-mono font-bold text-dark dark:text-white">{formatCurrency(c.total, organization.currency)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  accent,
}: {
  title: string
  value: string | number
  accent?: 'primary' | 'rental'
}) {
  return (
    <div className="bg-white dark:bg-[#202023] p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm transition-colors duration-200">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{title}</p>
      <p
        className={`text-lg sm:text-xl font-bold font-mono mt-1 truncate tracking-tight ${
          accent === 'primary' 
            ? 'text-blue-500' 
            : accent === 'rental' 
              ? 'text-orange-500' 
              : 'text-dark dark:text-white'
        }`}
        title={String(value)}
      >
        {value}
      </p>
    </div>
  )
}

function EmptyChartState() {
  return (
    <div className="h-[200px] flex items-center justify-center text-sm text-zinc-500">
      Not enough data yet
    </div>
  )
}