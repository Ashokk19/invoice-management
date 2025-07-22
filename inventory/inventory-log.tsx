"use client"

import { useState } from "react"
import { ScrollText, Search, Filter, Plus, Minus, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AppSidebar from "../components/app-sidebar"

interface LogEntry {
  id: string
  itemName: string
  sku: string
  action: "added" | "updated" | "removed" | "stock_in" | "stock_out"
  user: {
    name: string
    email: string
    avatar?: string
  }
  timestamp: string
  details: {
    quantityBefore?: number
    quantityAfter?: number
    quantityChanged?: number
    notes?: string
  }
}

export default function InventoryLog() {
  const [logEntries] = useState<LogEntry[]>([
    {
      id: "1",
      itemName: "iPhone 15 Pro",
      sku: "IPH15P001",
      action: "added",
      user: {
        name: "John Smith",
        email: "john@company.com",
        avatar: "/placeholder-user.jpg",
      },
      timestamp: "2024-01-15T10:30:00Z",
      details: {
        quantityAfter: 25,
        notes: "Initial stock entry",
      },
    },
    {
      id: "2",
      itemName: "Samsung Galaxy S24",
      sku: "SGS24001",
      action: "stock_in",
      user: {
        name: "Sarah Johnson",
        email: "sarah@company.com",
        avatar: "/placeholder-user.jpg",
      },
      timestamp: "2024-01-15T09:15:00Z",
      details: {
        quantityBefore: 10,
        quantityAfter: 25,
        quantityChanged: 15,
        notes: "Received new shipment",
      },
    },
    {
      id: "3",
      itemName: "Coffee Beans Premium",
      sku: "CBP001",
      action: "stock_out",
      user: {
        name: "Mike Davis",
        email: "mike@company.com",
        avatar: "/placeholder-user.jpg",
      },
      timestamp: "2024-01-15T08:45:00Z",
      details: {
        quantityBefore: 120,
        quantityAfter: 100,
        quantityChanged: -20,
        notes: "Sold to customer #12345",
      },
    },
    {
      id: "4",
      itemName: "Nike Air Max",
      sku: "NAM001",
      action: "updated",
      user: {
        name: "Emily Wilson",
        email: "emily@company.com",
        avatar: "/placeholder-user.jpg",
      },
      timestamp: "2024-01-14T16:20:00Z",
      details: {
        notes: "Updated product description and pricing",
      },
    },
    {
      id: "5",
      itemName: "Protein Bars",
      sku: "PB001",
      action: "removed",
      user: {
        name: "David Brown",
        email: "david@company.com",
        avatar: "/placeholder-user.jpg",
      },
      timestamp: "2024-01-14T14:10:00Z",
      details: {
        quantityBefore: 0,
        notes: "Discontinued product",
      },
    },
    {
      id: "6",
      itemName: "MacBook Pro",
      sku: "MBP001",
      action: "added",
      user: {
        name: "Lisa Anderson",
        email: "lisa@company.com",
        avatar: "/placeholder-user.jpg",
      },
      timestamp: "2024-01-14T11:30:00Z",
      details: {
        quantityAfter: 10,
        notes: "New product launch",
      },
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")

  const filteredEntries = logEntries.filter((entry) => {
    const matchesSearch =
      entry.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.user.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAction = actionFilter === "all" || entry.action === actionFilter
    const matchesUser = userFilter === "all" || entry.user.email === userFilter

    return matchesSearch && matchesAction && matchesUser
  })

  const getActionBadge = (action: string) => {
    switch (action) {
      case "added":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <Plus className="w-3 h-3 mr-1" />
            Added
          </Badge>
        )
      case "updated":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Edit className="w-3 h-3 mr-1" />
            Updated
          </Badge>
        )
      case "removed":
        return (
          <Badge variant="destructive">
            <Minus className="w-3 h-3 mr-1" />
            Removed
          </Badge>
        )
      case "stock_in":
        return (
          <Badge className="bg-violet-500 hover:bg-violet-600">
            <Plus className="w-3 h-3 mr-1" />
            Stock In
          </Badge>
        )
      case "stock_out":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">
            <Minus className="w-3 h-3 mr-1" />
            Stock Out
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getActionCounts = () => {
    return {
      added: logEntries.filter((entry) => entry.action === "added").length,
      updated: logEntries.filter((entry) => entry.action === "updated").length,
      removed: logEntries.filter((entry) => entry.action === "removed").length,
      stockIn: logEntries.filter((entry) => entry.action === "stock_in").length,
      stockOut: logEntries.filter((entry) => entry.action === "stock_out").length,
    }
  }

  const actionCounts = getActionCounts()
  const uniqueUsers = Array.from(new Set(logEntries.map((entry) => entry.user.email)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50 flex relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-50 to-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-50 to-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse delay-500"></div>
      </div>

      {/* Enhanced grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Sidebar - Increased width */}
      <div className="w-72 bg-white/40 backdrop-blur-3xl border-r border-white/80 shadow-2xl relative z-10">
        <AppSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Log</h1>
          <p className="text-gray-600 font-medium">Track all inventory changes and user activities</p>
        </div>

        {/* Activity Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/20"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">Added</CardTitle>
              <Plus className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-green-600">{actionCounts.added}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/20"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">Updated</CardTitle>
              <Edit className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-blue-600">{actionCounts.updated}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/20"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">Removed</CardTitle>
              <Minus className="w-4 h-4 text-red-600" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-red-600">{actionCounts.removed}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-violet-600/20"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">Stock In</CardTitle>
              <Plus className="w-4 h-4 text-violet-600" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-violet-600">{actionCounts.stockIn}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/20"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">Stock Out</CardTitle>
              <Minus className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-orange-600">{actionCounts.stockOut}</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-6 bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by item name, SKU, or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-white/60"
                />
              </div>
              <div className="flex gap-2 items-center">
                <Filter className="w-4 h-4 text-gray-500" />
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-40 bg-white/50 border-white/60">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="added">Added</SelectItem>
                    <SelectItem value="updated">Updated</SelectItem>
                    <SelectItem value="removed">Removed</SelectItem>
                    <SelectItem value="stock_in">Stock In</SelectItem>
                    <SelectItem value="stock_out">Stock Out</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger className="w-40 bg-white/50 border-white/60">
                    <SelectValue placeholder="Filter by user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {uniqueUsers.map((email) => (
                      <SelectItem key={email} value={email}>
                        {logEntries.find((entry) => entry.user.email === email)?.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Log Table */}
        <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ScrollText className="w-5 h-5 mr-2 text-violet-600" />
              Activity Log ({filteredEntries.length} entries)
            </CardTitle>
            <CardDescription>Complete history of inventory changes and user activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Quantity Change</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-white/20">
                      <TableCell>
                        <div>
                          <div className="font-medium">{entry.itemName}</div>
                          <div className="text-sm text-gray-500 font-mono">{entry.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getActionBadge(entry.action)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={entry.user.avatar || "/placeholder.svg"} alt={entry.user.name} />
                            <AvatarFallback>
                              {entry.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{entry.user.name}</div>
                            <div className="text-xs text-gray-500">{entry.user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {entry.details.quantityChanged !== undefined ? (
                          <div className="space-y-1">
                            <div
                              className={`font-semibold ${
                                entry.details.quantityChanged > 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {entry.details.quantityChanged > 0 ? "+" : ""}
                              {entry.details.quantityChanged}
                            </div>
                            {entry.details.quantityBefore !== undefined &&
                              entry.details.quantityAfter !== undefined && (
                                <div className="text-xs text-gray-500">
                                  {entry.details.quantityBefore} → {entry.details.quantityAfter}
                                </div>
                              )}
                          </div>
                        ) : entry.details.quantityAfter !== undefined ? (
                          <div className="font-semibold text-green-600">Initial: {entry.details.quantityAfter}</div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-sm text-gray-600">{entry.details.notes || "-"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(entry.timestamp).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleTimeString()}</div>
                        </div>
                      </TableCell>
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
