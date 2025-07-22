"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Edit, Trash2, Eye, FileText, Package, DollarSign, Clock } from "lucide-react"
import AppSidebar from "@/components/app-sidebar"
import { toast } from "sonner"

interface PurchaseOrder {
  id: string
  vendorName: string
  vendorId: string
  orderDate: string
  expectedDate: string
  status: "Draft" | "Sent" | "Confirmed" | "Partially Received" | "Received" | "Cancelled"
  totalAmount: number
  items: Array<{
    name: string
    quantity: number
    rate: number
    amount: number
  }>
  notes: string
  createdAt: string
}

const mockOrders: PurchaseOrder[] = [
  {
    id: "PO001",
    vendorName: "ABC Suppliers",
    vendorId: "VEN001",
    orderDate: "2024-01-15",
    expectedDate: "2024-01-25",
    status: "Confirmed",
    totalAmount: 25000,
    items: [
      { name: "Office Chairs", quantity: 10, rate: 2000, amount: 20000 },
      { name: "Desk Lamps", quantity: 5, rate: 1000, amount: 5000 },
    ],
    notes: "Urgent delivery required",
    createdAt: "2024-01-15",
  },
  {
    id: "PO002",
    vendorName: "XYZ Trading Co.",
    vendorId: "VEN002",
    orderDate: "2024-01-18",
    expectedDate: "2024-01-28",
    status: "Sent",
    totalAmount: 15000,
    items: [{ name: "Laptops", quantity: 2, rate: 7500, amount: 15000 }],
    notes: "Include warranty",
    createdAt: "2024-01-18",
  },
]

export default function PurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null)
  const [formData, setFormData] = useState({
    vendorName: "",
    vendorId: "",
    orderDate: "",
    expectedDate: "",
    notes: "",
    items: [{ name: "", quantity: 1, rate: 0, amount: 0 }],
  })

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-800"
      case "Sent":
        return "bg-blue-100 text-blue-800"
      case "Confirmed":
        return "bg-green-100 text-green-800"
      case "Partially Received":
        return "bg-yellow-100 text-yellow-800"
      case "Received":
        return "bg-emerald-100 text-emerald-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSubmit = () => {
    const totalAmount = formData.items.reduce((sum, item) => sum + item.amount, 0)

    if (editingOrder) {
      setOrders(
        orders.map((order) =>
          order.id === editingOrder.id ? { ...order, ...formData, totalAmount, items: formData.items } : order,
        ),
      )
      toast.success("Purchase order updated successfully!")
    } else {
      const newOrder: PurchaseOrder = {
        id: `PO${String(orders.length + 1).padStart(3, "0")}`,
        ...formData,
        status: "Draft",
        totalAmount,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setOrders([...orders, newOrder])
      toast.success("Purchase order created successfully!")
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      vendorName: "",
      vendorId: "",
      orderDate: "",
      expectedDate: "",
      notes: "",
      items: [{ name: "", quantity: 1, rate: 0, amount: 0 }],
    })
    setEditingOrder(null)
    setIsDialogOpen(false)
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", quantity: 1, rate: 0, amount: 0 }],
    })
  }

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = formData.items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value }
        if (field === "quantity" || field === "rate") {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate
        }
        return updatedItem
      }
      return item
    })
    setFormData({ ...formData, items: updatedItems })
  }

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index),
      })
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">

      <div className="w-72 bg-white/30 backdrop-blur-lg border-r border-white/50 shadow-2xl z-10">
        <AppSidebar currentPath="/purchase/orders"/>
      </div>

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent mb-2">
            Purchase Orders
          </h1>
          <p className="text-gray-600">Create and manage purchase orders for your vendors</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
              <FileText className="h-4 w-4 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-violet-700">{orders.length}</div>
              <p className="text-xs text-gray-500">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">
                {orders.filter((o) => ["Sent", "Confirmed"].includes(o.status)).length}
              </div>
              <p className="text-xs text-gray-500">Awaiting delivery</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                ₹{orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">Order value</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Received</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">
                {orders.filter((o) => o.status === "Received").length}
              </div>
              <p className="text-xs text-gray-500">Completed orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 border-white/20"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-white/50 border-white/20">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="partially received">Partially Received</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingOrder ? "Edit Purchase Order" : "Create Purchase Order"}</DialogTitle>
                    <DialogDescription>
                      {editingOrder ? "Update purchase order details" : "Create a new purchase order"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vendorName">Vendor Name *</Label>
                        <Input
                          id="vendorName"
                          value={formData.vendorName}
                          onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                          placeholder="Select or enter vendor"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vendorId">Vendor ID</Label>
                        <Input
                          id="vendorId"
                          value={formData.vendorId}
                          onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                          placeholder="VEN001"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="orderDate">Order Date *</Label>
                        <Input
                          id="orderDate"
                          type="date"
                          value={formData.orderDate}
                          onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="expectedDate">Expected Date</Label>
                        <Input
                          id="expectedDate"
                          type="date"
                          value={formData.expectedDate}
                          onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Items Section */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <Label>Order Items</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addItem}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {formData.items.map((item, index) => (
                          <div key={index} className="grid grid-cols-5 gap-2 items-end">
                            <div>
                              <Label>Item Name</Label>
                              <Input
                                value={item.name}
                                onChange={(e) => updateItem(index, "name", e.target.value)}
                                placeholder="Item name"
                              />
                            </div>
                            <div>
                              <Label>Quantity</Label>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 0)}
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <Label>Rate</Label>
                              <Input
                                type="number"
                                value={item.rate}
                                onChange={(e) => updateItem(index, "rate", Number.parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                              />
                            </div>
                            <div>
                              <Label>Amount</Label>
                              <Input value={item.amount.toFixed(2)} readOnly className="bg-gray-50" />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(index)}
                              disabled={formData.items.length === 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total Amount:</span>
                          <span className="text-lg font-bold text-green-700">
                            ₹{formData.items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Additional notes or instructions"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit}>{editingOrder ? "Update Order" : "Create Order"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>

        {/* Orders Table */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle>Purchase Orders ({filteredOrders.length})</CardTitle>
            <CardDescription>Manage your purchase orders and track delivery status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Details</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.id}</div>
                        <div className="text-sm text-gray-500">{order.items.length} items</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.vendorName}</div>
                        <div className="text-sm text-gray-500">{order.vendorId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Order: {order.orderDate}</div>
                        <div className="text-gray-500">Expected: {order.expectedDate}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-green-700">₹{order.totalAmount.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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
