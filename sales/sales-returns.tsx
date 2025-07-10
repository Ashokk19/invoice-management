"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Eye, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import AppSidebar from "../components/app-sidebar"

interface SalesReturn {
  id: string
  returnNumber: string
  originalInvoiceNumber: string
  customerName: string
  customerEmail: string
  returnDate: string
  reason: string
  status: "Pending" | "Approved" | "Processed" | "Refunded" | "Rejected"
  items: ReturnItem[]
  totalAmount: number
  refundAmount: number
  notes?: string
}

interface ReturnItem {
  id: string
  itemName: string
  originalQuantity: number
  returnQuantity: number
  rate: number
  amount: number
  condition: "Good" | "Damaged" | "Defective"
}

export default function SalesReturns() {
  const [returns, setReturns] = useState<SalesReturn[]>([
    {
      id: "1",
      returnNumber: "RET-2024-001",
      originalInvoiceNumber: "INV-2024-001",
      customerName: "Rajesh Kumar",
      customerEmail: "rajesh@example.com",
      returnDate: "2024-01-25",
      reason: "Product defective",
      status: "Approved",
      totalAmount: 5000,
      refundAmount: 5000,
      items: [
        {
          id: "1",
          itemName: "Laptop Stand",
          originalQuantity: 2,
          returnQuantity: 1,
          rate: 2500,
          amount: 2500,
          condition: "Defective",
        },
      ],
      notes: "Customer reported manufacturing defect",
    },
    {
      id: "2",
      returnNumber: "RET-2024-002",
      originalInvoiceNumber: "INV-2024-002",
      customerName: "Priya Sharma",
      customerEmail: "priya@example.com",
      returnDate: "2024-01-28",
      reason: "Wrong item delivered",
      status: "Pending",
      totalAmount: 3000,
      refundAmount: 0,
      items: [
        {
          id: "2",
          itemName: "Wireless Mouse",
          originalQuantity: 1,
          returnQuantity: 1,
          rate: 1500,
          amount: 1500,
          condition: "Good",
        },
      ],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedReturn, setSelectedReturn] = useState<SalesReturn | null>(null)

  // New return form state
  const [newReturn, setNewReturn] = useState({
    invoiceNumber: "",
    reason: "",
    items: [] as ReturnItem[],
    notes: "",
  })

  const filteredReturns = returns.filter((returnItem) => {
    const matchesSearch =
      returnItem.returnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.originalInvoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || returnItem.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Processed":
        return "bg-blue-100 text-blue-800"
      case "Refunded":
        return "bg-purple-100 text-purple-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateTotals = () => {
    const totalReturns = filteredReturns.length
    const totalAmount = filteredReturns.reduce((sum, ret) => sum + ret.totalAmount, 0)
    const totalRefunded = filteredReturns.reduce((sum, ret) => sum + ret.refundAmount, 0)
    const pendingCount = filteredReturns.filter((ret) => ret.status === "Pending").length

    return { totalReturns, totalAmount, totalRefunded, pendingCount }
  }

  const { totalReturns, totalAmount, totalRefunded, pendingCount } = calculateTotals()

  const updateReturnStatus = (returnId: string, newStatus: string) => {
    setReturns(
      returns.map((ret) =>
        ret.id === returnId
          ? {
              ...ret,
              status: newStatus as any,
              refundAmount: newStatus === "Refunded" ? ret.totalAmount : ret.refundAmount,
            }
          : ret,
      ),
    )
    toast.success(`Return status updated to ${newStatus}`)
  }

  const handleCreateReturn = () => {
    // This would typically validate and create a new return
    toast.success("Sales return created successfully!")
    setIsDialogOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <AppSidebar currentPath="/sales/returns" />

      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
              Sales Returns
            </h1>
            <p className="text-gray-600 mt-1">Track and manage product returns and refunds</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-violet-500 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                New Return
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl border-white/20">
              <DialogHeader>
                <DialogTitle>Create Sales Return</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Original Invoice Number *</Label>
                    <Select>
                      <SelectTrigger className="bg-white/50 border-white/20">
                        <SelectValue placeholder="Select invoice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INV-2024-001">INV-2024-001</SelectItem>
                        <SelectItem value="INV-2024-002">INV-2024-002</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Return Reason *</Label>
                    <Select>
                      <SelectTrigger className="bg-white/50 border-white/20">
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="defective">Product Defective</SelectItem>
                        <SelectItem value="wrong_item">Wrong Item Delivered</SelectItem>
                        <SelectItem value="damaged">Damaged in Transit</SelectItem>
                        <SelectItem value="not_satisfied">Customer Not Satisfied</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Additional notes about the return..."
                    className="bg-white/50 border-white/20"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateReturn} className="bg-violet-500">
                    Create Return
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-violet-700">{totalReturns}</p>
                <p className="text-sm text-gray-600">Total Returns</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-700">₹{totalAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Return Amount</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">₹{totalRefunded.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Refunded</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search returns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 border-white/20"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-white/50 border-white/20">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Returns List */}
        <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-violet-700">Returns ({filteredReturns.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReturns.map((returnItem) => (
                <div key={returnItem.id} className="p-4 bg-white/30 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{returnItem.returnNumber}</h3>
                        <Badge className={getStatusColor(returnItem.status)}>{returnItem.status}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Customer</p>
                          <p className="font-medium">{returnItem.customerName}</p>
                          <p className="text-gray-500">{returnItem.customerEmail}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Original Invoice</p>
                          <p className="font-medium">{returnItem.originalInvoiceNumber}</p>
                          <p className="text-gray-500">{returnItem.returnDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Amount</p>
                          <p className="font-bold text-lg text-red-700">₹{returnItem.totalAmount.toLocaleString()}</p>
                          {returnItem.refundAmount > 0 && (
                            <p className="text-green-600 text-sm">
                              Refunded: ₹{returnItem.refundAmount.toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-gray-600">Reason</p>
                          <p className="font-medium">{returnItem.reason}</p>
                          <p className="text-gray-500">{returnItem.items.length} items</p>
                        </div>
                      </div>
                      {returnItem.notes && <p className="text-sm text-gray-600 mt-2 italic">{returnItem.notes}</p>}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReturn(returnItem)}
                        className="bg-white/50 border-white/20"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {returnItem.status === "Pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateReturnStatus(returnItem.id, "Approved")}
                          className="bg-green-50 border-green-200 text-green-600"
                        >
                          Approve
                        </Button>
                      )}
                      {returnItem.status === "Approved" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateReturnStatus(returnItem.id, "Refunded")}
                          className="bg-blue-50 border-blue-200 text-blue-600"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Refund
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
