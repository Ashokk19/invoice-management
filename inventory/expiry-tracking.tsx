"use client"

import { useState } from "react"
import { AlertTriangle, Calendar, Search, Package, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Calculate days until expiry
  const calculateDaysUntilExpiry = (expiryDate: string): number => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Determine status based on days until expiry
  const getStatus = (days: number): ExpiryItem["status"] => {
    if (days < 0) return "expired"
    if (days <= 7) return "expiring-soon"
    if (days <= 30) return "warning"
    return "good"
  }

  const [items] = useState<ExpiryItem[]>([
    {
      id: "1",
      name: "iPhone 15 Pro",
      sku: "IPH15P-128",
      type: "Electronics",
      expiryDate: "2024-01-20",
      daysUntilExpiry: calculateDaysUntilExpiry("2024-01-20"),
      stock: 25,
      status: getStatus(calculateDaysUntilExpiry("2024-01-20")),
    },
    {
      id: "2",
      name: "Samsung Galaxy S24",
      sku: "SGS24-256",
      type: "Electronics",
      expiryDate: "2024-01-25",
      daysUntilExpiry: calculateDaysUntilExpiry("2024-01-25"),
      stock: 15,
      status: getStatus(calculateDaysUntilExpiry("2024-01-25")),
    },
    {
      id: "3",
      name: "Organic Milk",
      sku: "OM-1L",
      type: "Food",
      expiryDate: "2024-02-15",
      daysUntilExpiry: calculateDaysUntilExpiry("2024-02-15"),
      stock: 50,
      status: getStatus(calculateDaysUntilExpiry("2024-02-15")),
    },
    {
      id: "4",
      name: "Vitamin C Tablets",
      sku: "VIT-C-100",
      type: "Health",
      expiryDate: "2025-12-31",
      daysUntilExpiry: calculateDaysUntilExpiry("2025-12-31"),
      stock: 100,
      status: getStatus(calculateDaysUntilExpiry("2025-12-31")),
    },
  ])

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || item.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status: ExpiryItem["status"], days: number) => {
    switch (status) {
      case "expired":
        return <Badge variant="destructive">Expired</Badge>
      case "expiring-soon":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Expiring Soon</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Warning</Badge>
      case "good":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Good</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusCounts = () => {
    return {
      expired: items.filter((item) => item.status === "expired").length,
      expiringSoon: items.filter((item) => item.status === "expiring-soon").length,
      warning: items.filter((item) => item.status === "warning").length,
      good: items.filter((item) => item.status === "good").length,
    }
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50 p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-50 to-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      {/* Enhanced grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <AlertTriangle className="w-8 h-8 mr-3 text-violet-600" />
                Proactive Expiry Tracking
              </h1>
              <p className="text-gray-600 font-medium mt-1">Monitor product expiry dates and prevent losses</p>
            </div>
          </div>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/20"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">Expired</CardTitle>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-gray-900">{statusCounts.expired}</div>
              <p className="text-xs text-gray-600 mt-1">Items past expiry date</p>
            </CardContent>
          </Card>

          <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">Expiring Soon</CardTitle>
              <Clock className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-gray-900">{statusCounts.expiringSoon}</div>
              <p className="text-xs text-gray-600 mt-1">Within 7 days</p>
            </CardContent>
          </Card>

          <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">Warning</CardTitle>
              <Calendar className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-gray-900">{statusCounts.warning}</div>
              <p className="text-xs text-gray-600 mt-1">Within 30 days</p>
            </CardContent>
          </Card>

          <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-600/20"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">Good</CardTitle>
              <Package className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-gray-900">{statusCounts.good}</div>
              <p className="text-xs text-gray-600 mt-1">More than 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search items by name, SKU, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-white/90"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  className="bg-white/70 backdrop-blur-lg border-white/90 hover:bg-white/80"
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "expired" ? "default" : "outline"}
                  onClick={() => setFilterStatus("expired")}
                  className="bg-white/70 backdrop-blur-lg border-white/90 hover:bg-white/80"
                >
                  Expired
                </Button>
                <Button
                  variant={filterStatus === "expiring-soon" ? "default" : "outline"}
                  onClick={() => setFilterStatus("expiring-soon")}
                  className="bg-white/70 backdrop-blur-lg border-white/90 hover:bg-white/80"
                >
                  Expiring Soon
                </Button>
                <Button
                  variant={filterStatus === "warning" ? "default" : "outline"}
                  onClick={() => setFilterStatus("warning")}
                  className="bg-white/70 backdrop-blur-lg border-white/90 hover:bg-white/80"
                >
                  Warning
                </Button>
                <Button
                  variant={filterStatus === "good" ? "default" : "outline"}
                  onClick={() => setFilterStatus("good")}
                  className="bg-white/70 backdrop-blur-lg border-white/90 hover:bg-white/80"
                >
                  Good
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expiry Items Table */}
        <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60">
          <CardHeader>
            <CardTitle className="text-gray-900">Expiry Tracking ({filteredItems.length})</CardTitle>
            <CardDescription className="text-gray-600">Monitor product expiry dates</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700 font-semibold">Item Name</TableHead>
                  <TableHead className="text-gray-700 font-semibold">SKU</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Type</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Expiry Date</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Days Until Expiry</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Stock</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-white/30">
                    <TableCell className="font-medium text-gray-900">{item.name}</TableCell>
                    <TableCell className="text-gray-700">{item.sku}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                        {item.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-700">{item.expiryDate}</TableCell>
                    <TableCell
                      className={`font-semibold ${
                        item.daysUntilExpiry < 0
                          ? "text-red-600"
                          : item.daysUntilExpiry <= 7
                            ? "text-orange-600"
                            : item.daysUntilExpiry <= 30
                              ? "text-yellow-600"
                              : "text-green-600"
                      }`}
                    >
                      {item.daysUntilExpiry < 0
                        ? `${Math.abs(item.daysUntilExpiry)} days ago`
                        : `${item.daysUntilExpiry} days`}
                    </TableCell>
                    <TableCell className="text-gray-900 font-semibold">{item.stock}</TableCell>
                    <TableCell>{getStatusBadge(item.status, item.daysUntilExpiry)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
