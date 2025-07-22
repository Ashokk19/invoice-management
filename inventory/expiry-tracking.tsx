"use client"

import { useState } from "react"
import { AlertTriangle, Calendar, Search, Filter, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import AppSidebar from "@/components/app-sidebar"

interface ExpiryItem {
  id: string
  name: string
  sku: string
  type: string
  expiryDate: string
  daysUntilExpiry: number
  stock: number
  status: "expired" | "expiring-soon" | "warning" | "good"
}

export default function ExpiryTracking() {
  const [items] = useState<ExpiryItem[]>([
    { id: "1", name: "Coffee Beans Premium", sku: "CBP001", type: "Food", expiryDate: "2024-06-15", daysUntilExpiry: -30, stock: 100, status: "expired" },
    { id: "2", name: "Organic Milk",        sku: "OM001",  type: "Food", expiryDate: "2024-01-20", daysUntilExpiry: 5,   stock: 25,  status: "expiring-soon" },
    { id: "3", name: "Protein Bars",        sku: "PB001",  type: "Food", expiryDate: "2024-02-15", daysUntilExpiry: 31,  stock: 50,  status: "warning" },
    { id: "4", name: "iPhone 15 Pro",       sku: "IPH15P001", type: "Electronics", expiryDate: "2025-12-31", daysUntilExpiry: 365, stock: 25, status: "good" },
    { id: "5", name: "Energy Drinks",       sku: "ED001",  type: "Food", expiryDate: "2024-01-25", daysUntilExpiry: 10,  stock: 75,  status: "expiring-soon" },
    { id: "6", name: "Vitamins",            sku: "VIT001", type: "Health", expiryDate: "2024-03-01", daysUntilExpiry: 45,  stock: 30,  status: "warning" },
  ])

  const [searchTerm,   setSearchTerm]   = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredItems = items.filter(item => {
    const matchesSearch = [item.name, item.sku, item.type]
        .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    expired:        items.filter(i => i.status==="expired").length,
    expiringSoon:   items.filter(i => i.status==="expiring-soon").length,
    warning:        items.filter(i => i.status==="warning").length,
    good:           items.filter(i => i.status==="good").length,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "expired":        return <Badge variant="destructive">Expired</Badge>
      case "expiring-soon":  return <Badge className="bg-orange-600 text-black">Expiring Soon</Badge>
      case "warning":        return <Badge className="bg-yellow-600 text-black">Warning</Badge>
      case "good":           return <Badge className="bg-green-600 text-black">Good</Badge>
      default:               return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
      <div className="min-h-screen flex overflow-hidden relative bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50">
        {/* Sidebar */}
        <div className="w-72 bg-white/30 backdrop-blur-lg border-r border-white/80 shadow-2xl z-10">
          <AppSidebar />
        </div>

        {/* Main */}
        <div className="flex-1 p-8 relative z-10">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Proactive Expiry Tracking</h1>
          <p className="text-gray-600 mb-6">Monitor product expiry dates and prevent waste</p>

          {/* Status Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-6">
            {[
              { title: "Expired Items", count: statusCounts.expired,      icon: AlertTriangle, color: "red",    desc: "Immediate attention required" },
              { title: "Expiring Soon", count: statusCounts.expiringSoon, icon: Clock,         color: "orange", desc: "Within 7 days" },
              { title: "Warning",       count: statusCounts.warning,      icon: AlertTriangle, color: "yellow", desc: "Within 30 days" },
              { title: "Good",          count: statusCounts.good,         icon: Package,       color: "green",  desc: "More than 30 days" },
            ].map(({ title, count, icon: Icon, color, desc }) => (
                <Card
                    key={title}
                    className={`
        h-48 flex flex-col justify-between px-6 py-4 overflow-hidden
        rounded-2xl shadow-lg relative
        bg-${color}-500
        border-0
        `}
                    style={{
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                    }}
                >
                  <CardHeader className="relative z-10 flex flex-row justify-between items-start pb-2">
                    <CardTitle className={`text-base font-semibold text-gray-700`}>{title}</CardTitle>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                  </CardHeader>
                  <CardContent className="relative z-10 flex flex-col justify-end flex-grow">
                    <div className={`text-3xl font-bold text-${color}-600`}>{count}</div>
                    <p className="text-xs text-gray-600 mt-2">{desc}</p>
                  </CardContent>
                </Card>
            ))}
          </div>



          {/* Search + Filter */}
          <Card className="mb-6 bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 rounded-lg">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 relative">
                  <Input
                      placeholder="Search by name, SKU or type..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-3 pr-10 py-2 bg-white/50 border border-white/60 rounded-lg"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>
                <div className="relative">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-44 pl-10 pr-3 py-2 bg-white/50 border border-white/60 rounded-lg">
                      <Filter className="absolute left-3 text-gray-500 w-5 h-5" />
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expiry Table */}
          <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-violet-600" />
                Expiry Tracking ({filteredItems.length})
              </CardTitle>
              <CardDescription>Monitor product expiry dates and take proactive action</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Days Until Expiry</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map(item => (
                        <TableRow key={item.id} className="hover:bg-white/20 transition-colors">
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                          <TableCell><Badge className="bg-violet-100 text-violet-700">{item.type}</Badge></TableCell>
                          <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                        <span className={`font-semibold ${
                            item.daysUntilExpiry < 0
                                ? "text-red-600"
                                : item.daysUntilExpiry <= 7
                                    ? "text-orange-600"
                                    : item.daysUntilExpiry <= 30
                                        ? "text-yellow-600"
                                        : "text-green-600"
                        }`}>
                          {item.daysUntilExpiry < 0
                              ? `${Math.abs(item.daysUntilExpiry)} days ago`
                              : `${item.daysUntilExpiry} days`}
                        </span>
                          </TableCell>
                          <TableCell><Badge className="bg-gray-100 text-gray-700">{item.stock}</Badge></TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
