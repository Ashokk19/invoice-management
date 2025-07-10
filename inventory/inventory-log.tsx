"use client"

import { useState } from "react"
import { ScrollText, Search, Package, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface InventoryLogEntry {
  id: string
  itemName: string
  sku: string
  action: "added" | "updated" | "removed" | "stock_in" | "stock_out"
  quantity?: number
  previousQuantity?: number
  newQuantity?: number
  user: {
    name: string
    email: string
    avatar?: string
  }
  timestamp: string
  notes?: string
}

export default function InventoryLog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAction, setFilterAction] = useState<string>("all")

  const [logEntries] = useState<InventoryLogEntry[]>([
    {
      id: "1",
      itemName: "iPhone 15 Pro",
      sku: "IPH15P-128",
      action: "added",
      user: {
        name: "John Doe",
        email: "john@example.com",
        avatar: "/placeholder-user.jpg",
      },
      timestamp: "2024-01-15T10:30:00Z",
      notes: "Initial stock entry",
    },
    {
      id: "2",
      itemName: "Samsung Galaxy S24",
      sku: "SGS24-256",
      action: "stock_in",
      quantity: 25,
      previousQuantity: 15,
      newQuantity: 40,
      user: {
        name: "Jane Smith",
        email: "jane@example.com",
        avatar: "/placeholder-user.jpg",
      },
      timestamp: "2024-01-14T14:20:00Z",
      notes: "Received new shipment",
    },
    {
      id: "3",
      itemName: "Nike Air Max",
      sku: "NAM-90-BLK",
      action: "stock_out",
      quantity: 5,
      previousQuantity: 50,
      newQuantity: 45,
      user: {
        name: "Mike Johnson",
        email: "mike@example.com",
        avatar: "/placeholder-user.jpg",
      },
      timestamp: "2024-01-14T09:15:00Z",
      notes: "Sold to customer",
    },
    {
      id: "4",
      itemName: "MacBook Pro",
      sku: "MBP-14-M3",
      action: "updated",
      user: {
        name: "Sarah Wilson",
        email: "sarah@example.com",
        avatar: "/placeholder-user.jpg",
      },
      timestamp: "2024-01-13T16:45:00Z",
      notes: "Updated product description and price",
    },
    {
      id: "5",
      itemName: "Wireless Headphones",
      sku: "WH-XM4",
      action: "removed",
      user: {
        name: "David Brown",
        email: "david@example.com",
        avatar: "/placeholder-user.jpg",
      },
      timestamp: "2024-01-12T11:30:00Z",
      notes: "Discontinued product",
    },
  ])

  const filteredEntries = logEntries.filter((entry) => {
    const matchesSearch =
      entry.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.user.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterAction === "all" || entry.action === filterAction

    return matchesSearch && matchesFilter
  })

  const getActionBadge = (action: InventoryLogEntry["action"]) => {
    switch (action) {
      case "added":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Added</Badge>
      case "updated":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Updated</Badge>
      case "removed":
        return <Badge variant="destructive">Removed</Badge>
      case "stock_in":
        return <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-200">Stock In</Badge>
      case "stock_out":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">Stock Out</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getActionIcon = (action: InventoryLogEntry["action"]) => {
    switch (action) {
      case "added":
        return <Plus className="w-4 h-4 text-green-600" />
      case "updated":
        return <Package className="w-4 h-4 text-blue-600" />
      case "removed":
        return <Minus className="w-4 h-4 text-red-600" />
      case "stock_in":
        return <Plus className="w-4 h-4 text-violet-600" />
      case "stock_out":
        return <Minus className="w-4 h-4 text-orange-600" />
      default:
        return <Package className="w-4 h-4 text-gray-600" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
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
                <ScrollText className="w-8 h-8 mr-3 text-violet-600" />
                Inventory Log
              </h1>
              <p className="text-gray-600 font-medium mt-1">Track all inventory changes and user activities</p>
            </div>
          </div>
        </div>

        {/* Action Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-600/20"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">Added</CardTitle>
              <Plus className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-gray-900">{actionCounts.added}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">Updated</CardTitle>
              <Package className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-gray-900">{actionCounts.updated}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/20"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">Removed</CardTitle>
              <Minus className="w-4 h-4 text-red-600" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-gray-900">{actionCounts.removed}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-violet-600/20"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">Stock In</CardTitle>
              <Plus className="w-4 h-4 text-violet-600" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-gray-900">{actionCounts.stockIn}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700">Stock Out</CardTitle>
              <Minus className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-gray-900">{actionCounts.stockOut}</div>
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
                  placeholder="Search by item name, SKU, or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-white/90"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={filterAction === "all" ? "default" : "outline"}
                  onClick={() => setFilterAction("all")}
                  className="bg-white/70 backdrop-blur-lg border-white/90 hover:bg-white/80"
                >
                  All
                </Button>
                <Button
                  variant={filterAction === "added" ? "default" : "outline"}
                  onClick={() => setFilterAction("added")}
                  className="bg-white/70 backdrop-blur-lg border-white/90 hover:bg-white/80"
                >
                  Added
                </Button>
                <Button
                  variant={filterAction === "updated" ? "default" : "outline"}
                  onClick={() => setFilterAction("updated")}
                  className="bg-white/70 backdrop-blur-lg border-white/90 hover:bg-white/80"
                >
                  Updated
                </Button>
                <Button
                  variant={filterAction === "stock_in" ? "default" : "outline"}
                  onClick={() => setFilterAction("stock_in")}
                  className="bg-white/70 backdrop-blur-lg border-white/90 hover:bg-white/80"
                >
                  Stock In
                </Button>
                <Button
                  variant={filterAction === "stock_out" ? "default" : "outline"}
                  onClick={() => setFilterAction("stock_out")}
                  className="bg-white/70 backdrop-blur-lg border-white/90 hover:bg-white/80"
                >
                  Stock Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Log Entries Table */}
        <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60">
          <CardHeader>
            <CardTitle className="text-gray-900">Activity Log ({filteredEntries.length})</CardTitle>
            <CardDescription className="text-gray-600">All inventory changes and user activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700 font-semibold">Action</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Item</TableHead>
                  <TableHead className="text-gray-700 font-semibold">SKU</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Quantity Change</TableHead>
                  <TableHead className="text-gray-700 font-semibold">User</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Timestamp</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-white/30">
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getActionIcon(entry.action)}
                        {getActionBadge(entry.action)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{entry.itemName}</TableCell>
                    <TableCell className="text-gray-700">{entry.sku}</TableCell>
                    <TableCell>
                      {entry.quantity && (
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900">
                            {entry.action === "stock_in" ? "+" : "-"}
                            {entry.quantity}
                          </div>
                          {entry.previousQuantity !== undefined && entry.newQuantity !== undefined && (
                            <div className="text-gray-600">
                              {entry.previousQuantity} → {entry.newQuantity}
                            </div>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={entry.user.avatar || "/placeholder.svg"} alt={entry.user.name} />
                          <AvatarFallback>
                            {entry.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{entry.user.name}</div>
                          <div className="text-gray-600 text-xs">{entry.user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm">{formatTimestamp(entry.timestamp)}</TableCell>
                    <TableCell className="text-gray-600 text-sm max-w-xs truncate">{entry.notes}</TableCell>
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
