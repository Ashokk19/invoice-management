"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Search, RotateCcw, Eye, Download } from "lucide-react"
import { format } from "date-fns"
import AppSidebar from "@/components/app-sidebar"
import { toast } from "sonner"

interface SalesReturn {
  id: string
  returnNumber: string
  customer: string
  invoiceNumber: string
  returnDate: string
  reason: string
  status: "Pending" | "Approved" | "Rejected" | "Processed"
  items: Array<{
    itemName: string
    quantity: number
    returnQuantity: number
    rate: number
    amount: number
  }>
  totalAmount: number
  refundAmount: number
  refundMethod: "Cash" | "Bank Transfer" | "Credit Note"
}

export default function SalesReturns() {
  const [returns, setReturns] = useState<SalesReturn[]>([
    {
      id: "RET001",
      returnNumber: "RET-2024-001",
      customer: "Rajesh Kumar",
      invoiceNumber: "INV-2024-001",
      returnDate: "2024-01-25",
      reason: "Defective product",
      status: "Processed",
      items: [{ itemName: "Product A", quantity: 10, returnQuantity: 2, rate: 1000, amount: 2000 }],
      totalAmount: 2000,
      refundAmount: 2000,
      refundMethod: "Bank Transfer",
    },
    {
      id: "RET002",
      returnNumber: "RET-2024-002",
      customer: "Priya Sharma",
      invoiceNumber: "INV-2024-002",
      returnDate: "2024-01-28",
      reason: "Wrong item delivered",
      status: "Pending",
      items: [{ itemName: "Product B", quantity: 5, returnQuantity: 1, rate: 2000, amount: 2000 }],
      totalAmount: 2000,
      refundAmount: 2000,
      refundMethod: "Credit Note",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [formData, setFormData] = useState({
    customer: "",
    invoiceNumber: "",
    reason: "",
    refundMethod: "Credit Note" as "Cash" | "Bank Transfer" | "Credit Note",
    items: [{ itemName: "", returnQuantity: 0, rate: 0 }],
  })

  const filteredReturns = returns.filter(
    (returnItem) =>
      returnItem.returnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateReturn = () => {
    const newReturn: SalesReturn = {
      id: `RET${String(returns.length + 1).padStart(3, "0")}`,
      returnNumber: `RET-2024-${String(returns.length + 1).padStart(3, "0")}`,
      customer: formData.customer,
      invoiceNumber: formData.invoiceNumber,
      returnDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : new Date().toISOString().split("T")[0],
      reason: formData.reason,
      status: "Pending",
      items: formData.items.map((item) => ({
        ...item,
        quantity: item.returnQuantity,
        amount: item.returnQuantity * item.rate,
      })),
      totalAmount: formData.items.reduce((sum, item) => sum + item.returnQuantity * item.rate, 0),
      refundAmount: formData.items.reduce((sum, item) => sum + item.returnQuantity * item.rate, 0),
      refundMethod: formData.refundMethod,
    }
    setReturns([...returns, newReturn])
    setIsDialogOpen(false)
    toast.success("Sales return created successfully!")
  }

  const updateStatus = (id: string, status: "Pending" | "Approved" | "Rejected" | "Processed") => {
    setReturns(returns.map((returnItem) => (returnItem.id === id ? { ...returnItem, status } : returnItem)))
    toast.success(`Return status updated to ${status}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processed":
        return "bg-green-100 text-green-800"
      case "Approved":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalReturns = filteredReturns.length
  const totalRefundAmount = filteredReturns.reduce((sum, returnItem) => sum + returnItem.refundAmount, 0)
  const pendingReturns = filteredReturns.filter((returnItem) => returnItem.status === "Pending").length

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
      <div className="w-72 bg-white/30 backdrop-blur-lg border-r border-white/50 shadow-2xl z-10">
        <AppSidebar currentPath="/sales/returns" />
      </div>
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
              Sales Returns
            </h1>
            <p className="text-gray-600 mt-1">Manage product returns and refunds</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Return
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl border-white/20">
              <DialogHeader>
                <DialogTitle>Create Sales Return</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer">Customer</Label>
                    <Select
                      value={formData.customer}
                      onValueChange={(value) => setFormData({ ...formData, customer: value })}
                    >
                      <SelectTrigger className="bg-white/50 border-white/20">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rajesh Kumar">Rajesh Kumar</SelectItem>
                        <SelectItem value="Priya Sharma">Priya Sharma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="invoice">Invoice Number</Label>
                    <Input
                      id="invoice"
                      value={formData.invoiceNumber}
                      onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                      placeholder="INV-2024-001"
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                </div>
                <div>
                  <Label>Return Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start bg-white/50 border-white/20">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="reason">Return Reason</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Reason for return"
                    className="bg-white/50 border-white/20"
                  />
                </div>
                <div>
                  <Label htmlFor="refundMethod">Refund Method</Label>
                  <Select
                    value={formData.refundMethod}
                    onValueChange={(value: any) => setFormData({ ...formData, refundMethod: value })}
                  >
                    <SelectTrigger className="bg-white/50 border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Note">Credit Note</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateReturn} className="bg-gradient-to-r from-violet-500 to-purple-600">
                    Create Return
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Returns</p>
                  <p className="text-2xl font-bold text-gray-900">{totalReturns}</p>
                </div>
                <RotateCcw className="w-8 h-8 text-violet-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Refund Amount</p>
                  <p className="text-2xl font-bold text-red-600">₹{totalRefundAmount.toLocaleString()}</p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">₹</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Returns</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingReturns}</p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">⏳</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search returns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border-white/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Returns Table */}
        <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Sales Returns ({filteredReturns.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Refund Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.map((returnItem) => (
                  <TableRow key={returnItem.id}>
                    <TableCell>
                      <div className="font-medium">{returnItem.returnNumber}</div>
                    </TableCell>
                    <TableCell>{returnItem.customer}</TableCell>
                    <TableCell>{returnItem.invoiceNumber}</TableCell>
                    <TableCell>{format(new Date(returnItem.returnDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <div className="max-w-32 truncate" title={returnItem.reason}>
                        {returnItem.reason}
                      </div>
                    </TableCell>
                    <TableCell>₹{returnItem.refundAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Select
                        value={returnItem.status}
                        onValueChange={(value: any) => updateStatus(returnItem.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                          <SelectItem value="Processed">Processed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3" />
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
