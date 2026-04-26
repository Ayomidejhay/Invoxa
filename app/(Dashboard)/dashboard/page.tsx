'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
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
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

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
      const [invoiceRes, customerRes, productRes, itemsRes] =
        await Promise.all([
          supabase
            .from('invoices')
            .select('total, status, type, created_at, customers(name)'),

          supabase.from('customers').select('id'),

          supabase.from('products').select('id, name'),

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
        } else {
          outstandingRevenue += inv.total
        }

        if (inv.type === 'sale') salesCount++
        if (inv.type === 'rental') rentalCount++
      })

      // ---- Revenue trend ----
      const revenueArray = Object.keys(last30Days)
        .sort(
          (a, b) =>
            new Date(a).getTime() - new Date(b).getTime()
        )
        .map((date) => ({
          date,
          revenue: last30Days[date],
        }))

      // ---- Top Customers ----
      const customerMap: Record<string, number> = {}

      invoices.forEach((inv) => {
        if (inv.status !== 'paid') return

        // const name = inv.customers?.name || 'Unknown'
        const name = inv.customers?.[0]?.name || 'Unknown'

        customerMap[name] =
          (customerMap[name] || 0) + inv.total
      })

      const topCustomersArray = Object.entries(customerMap)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5)

      // ---- Top Products ----
      const productMap: Record<string, number> = {}

      items.forEach((item) => {
        const name = item.name || 'Product'

        productMap[name] =
          (productMap[name] || 0) + item.quantity
      })

      const topProductsArray = Object.entries(productMap)
        .map(([name, quantity]) => ({
          name,
          quantity,
        }))
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
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card title="Revenue" value={`₦${stats.totalRevenue.toLocaleString()}`} />
        <Card title="Outstanding" value={`₦${stats.outstandingRevenue.toLocaleString()}`} />
        <Card title="Invoices" value={stats.totalInvoices} />
        <Card title="Customers" value={stats.totalCustomers} />
        <Card title="Inventory" value={stats.totalProducts} />
        <Card title="Sales / Rentals" value={`${stats.salesCount} / ${stats.rentalCount}`} />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border">
          <h2 className="text-sm font-semibold mb-4">
            Revenue (Last 30 Days)
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#355834"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-5 rounded-xl border">
          <h2 className="text-sm font-semibold mb-4">
            Sales vs Rentals
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                <Cell fill="#355834" />
                <Cell fill="#8BB174" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="bg-white p-5 rounded-xl border">
          <h2 className="text-sm font-semibold mb-4">
            Top Customers
          </h2>

          <div className="space-y-3">
            {topCustomers.map((c, i) => (
              <div
                key={i}
                className="flex justify-between text-sm"
              >
                <span>{c.name}</span>
                <span className="font-medium">
                  ₦{c.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-5 rounded-xl border">
          <h2 className="text-sm font-semibold mb-4">
            Best Selling Products
          </h2>

          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div
                key={i}
                className="flex justify-between text-sm"
              >
                <span>{p.name}</span>
                <span className="font-medium">
                  {p.quantity} sold
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Card({
  title,
  value,
}: {
  title: string
  value: string | number
}) {
  return (
    <div className="bg-white p-5 rounded-xl border">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  )
}