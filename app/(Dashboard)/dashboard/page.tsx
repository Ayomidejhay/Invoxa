

'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useOrganization } from '../components/OrganizationProvider'
import { Card } from '@/app/components/ui/Card'
import { SkeletonStatCard } from '@/app/components/ui/Skeleton'

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
  const supabase = getSupabaseClient()
  const { organization } = useOrganization()

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
  const [typeData, setTypeData] = useState([
    { name: 'Sales', value: 0 },
    { name: 'Rentals', value: 0 },
  ])
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
          .select('total, status, type, created_at, customers(name)')
          .eq('organization_id', orgId),

        supabase.from('customers').select('id').eq('organization_id', orgId),

        supabase.from('products').select('id, name').eq('organization_id', orgId),

        // invoice_items has no organization_id column of its own — its RLS
        // policy already scopes rows to the caller's org via the parent
        // invoice, so no explicit filter is needed here.
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

      // ---- Revenue + counts ----
      invoices.forEach((inv) => {
        const date = new Date(inv.created_at).toLocaleDateString()

        if (inv.status === 'paid') {
          totalRevenue += inv.total
          last30Days[date] = (last30Days[date] || 0) + inv.total
        } else if (inv.status !== 'void') {
          // Void invoices are cancelled — they're neither earned nor owed.
          outstandingRevenue += inv.total
        }

        if (inv.type === 'sale') salesCount++
        if (inv.type === 'rental') rentalCount++
      })

      // ---- Revenue trend ----
      const revenueArray = Object.keys(last30Days)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .map((date) => ({
          date,
          revenue: last30Days[date],
        }))

      // ---- Top Customers ----
      const customerMap: Record<string, number> = {}

      invoices.forEach((inv) => {
        if (inv.status !== 'paid') return
        const name = inv.customers?.name || 'Unknown'
        customerMap[name] = (customerMap[name] || 0) + inv.total
      })

      const topCustomersArray = Object.entries(customerMap)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5)

      // ---- Top Products ----
      const productMap: Record<string, number> = {}

      items.forEach((item) => {
        const name = item.name || 'Product'
        productMap[name] = (productMap[name] || 0) + item.quantity
      })

      const topProductsArray = Object.entries(productMap)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)

      if (!isMounted) return

      setRevenueData(revenueArray)

      setTypeData([
        { name: 'Sales', value: salesCount },
        { name: 'Rentals', value: rentalCount },
      ])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization.id])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-dark">Dashboard</h1>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-dark">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Revenue" value={`₦${stats.totalRevenue.toLocaleString()}`} accent="primary" />
        <StatCard title="Outstanding" value={`₦${stats.outstandingRevenue.toLocaleString()}`} accent="rental" />
        <StatCard title="Invoices" value={stats.totalInvoices} />
        <StatCard title="Customers" value={stats.totalCustomers} />
        <StatCard title="Inventory" value={stats.totalProducts} />
        <StatCard title="Sales / Rentals" value={`${stats.salesCount} / ${stats.rentalCount}`} />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-sm font-semibold text-dark mb-4">Revenue (Paid Invoices)</h2>

          {revenueData.length === 0 ? (
            <EmptyChartState />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#355834" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-dark mb-4">Sales vs Rentals</h2>

          {stats.salesCount + stats.rentalCount === 0 ? (
            <EmptyChartState />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={typeData} dataKey="value" nameKey="name" outerRadius={100}>
                  {/* Same color language as the sale/rental badges everywhere else */}
                  <Cell fill="#355834" />
                  <Cell fill="#B7791F" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Customers */}
        <Card>
          <h2 className="text-sm font-semibold text-dark mb-4">Top Customers</h2>

          {topCustomers.length === 0 ? (
            <p className="text-sm text-muted">No paid invoices yet.</p>
          ) : (
            <div className="space-y-3">
              {topCustomers.map((c, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-dark">{c.name}</span>
                  <span className="font-mono font-medium text-dark">₦{c.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Top Products */}
        <Card>
          <h2 className="text-sm font-semibold text-dark mb-4">Best Selling Products</h2>

          {topProducts.length === 0 ? (
            <p className="text-sm text-muted">No invoice items yet.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-dark">{p.name}</span>
                  <span className="font-mono font-medium text-dark">{p.quantity} sold</span>
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
    <div className="bg-white p-5 rounded-2xl border border-border">
      <p className="text-sm text-muted">{title}</p>
      <p
        className={`text-xl font-semibold font-mono mt-1 ${
          accent === 'primary' ? 'text-deepgreen' : accent === 'rental' ? 'text-rental' : 'text-dark'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function EmptyChartState() {
  return (
    <div className="h-[300px] flex items-center justify-center text-sm text-muted">
      Not enough data yet
    </div>
  )
}