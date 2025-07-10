"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Download, Send, Search } from "lucide-react"
import { toast } from "sonner"
import AppSidebar from "../components/app-sidebar"

interface Invoice {
  id: string
  invoiceNumber: string
  customerName: string
  customerEmail: string
  invoiceDate: string
  dueDate: string
  amount: number
  paidAmount: number
  status: "Draft" | "Sent" | "Paid" | "Overdue" | "Cancelled"
  items: number
  paymentMethod?: string
  notes?: string
}

export default function InvoiceHistory() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      customerName: "Rajesh Kumar",
      customerEmail: "rajesh@example.com",
      invoiceDate: "2024-01-15",
      dueDate: "2024-02-14",
      amount: 25000,
      paidAmount: 25000,
      status: "Paid",
      items: 3,
      paymentMethod: "Bank Transfer",
      notes: "Payment received on time",
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      customerName: "Priya Sharma",
      customerEmail: "priya@example.com",
      invoiceDate: "2024-01-20",
      dueDate: "2024-02-19",
      amount: 18500,
      paidAmount: 0,
      status: "Sent",
      items: 2,
    },
    {
      id: "3",
      invoiceNumber: "INV-2024-003",
      customerName: "Amit Patel",
      customerEmail: "amit@example.com",
      invoiceDate: "2024-01-10",
      dueDate: "2024-01-25",
      amount: 32000,
      paidAmount: 0,
      status: "Overdue",
      items: 5,
    },
    {
      id: "4",
      invoiceNumber: "INV-2024-004",
      customerName: "Sneha Reddy",
      customerEmail: "sneha@example.com",
      invoiceDate: "2024-01-25",
      dueDate: "2024-02-24",
      amount: 15000,
      paidAmount: 0,
      status: "Draft",
      items: 1,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status.toLowerCase() === statusFilter.toLowerCase()

    let matchesDate = true
    if (dateFilter !== "all") {
      const invoiceDate = new Date(invoice.invoiceDate)
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      switch (dateFilter) {
        case "today":
          matchesDate = invoiceDate.toDateString() === now.toDateString()
          break
        case "week":
          matchesDate = invoiceDate >= sevenDaysAgo
          break
        case "month":
          matchesDate = invoiceDate >= thirtyDaysAgo
          break
      }
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800"
      case "Sent":
        return "bg-blue-100 text-blue-800"
      case "Overdue":
        return "bg-red-100 text-red-800"
      case "Draft":
        return "bg-gray-100 text-gray-800"
      case "Cancelled":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateTotals = () => {
    const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0)
    const totalPaid = filteredInvoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0)
    const totalOutstanding = totalAmount - totalPaid
    const paidCount = filteredInvoices.filter((inv) => inv.status === "Paid").length
    const overdueCount = filteredInvoices.filter((inv) => inv.status === "Overdue").length

    return { totalAmount, totalPaid, totalOutstanding, paidCount, overdueCount }
  }

  const { totalAmount, totalPaid, totalOutstanding, paidCount, overdueCount } = calculateTotals()

  const handleViewInvoice = (invoiceId: string) => {
    toast.success("Opening invoice details...")
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success("Invoice PDF downloaded successfully!")
  }

  const handleSendInvoice = (invoice: Invoice) => {
    const message = `Hi ${invoice.customerName}, your invoice ${invoice.invoiceNumber} for ₹${invoice.amount.toFixed(2)} is ready. Please find the details attached.`
    toast.success("Invoice sent successfully!")
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <AppSidebar currentPath="/sales/history" />

      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
              Invoice History
            </h1>
            <p className="text-gray-600 mt-1">View and manage all your invoices</p>
          </div>
          <Button className="bg-gradient-to-r from-violet-500 to-purple-600">Create New Invoice</Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-violet-700">₹{totalAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Amount</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">₹{totalPaid.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Paid</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-700">₹{totalOutstanding.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Outstanding</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-700">{paidCount}</p>
                <p className="text-sm text-gray-600">Paid Invoices</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-700">{overdueCount}</p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search invoices..."
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40 bg-white/50 border-white/20">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Invoice List */}
        <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-violet-700">Invoices ({filteredInvoices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="p-4 bg-white/30 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
                        <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Customer</p>
                          <p className="font-medium">{invoice.customerName}</p>
                          <p className="text-gray-500">{invoice.customerEmail}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Amount</p>
                          <p className="font-bold text-lg text-violet-700">₹{invoice.amount.toLocaleString()}</p>
                          {invoice.paidAmount > 0 && (
                            <p className="text-green-600 text-sm">Paid: ₹{invoice.paidAmount.toLocaleString()}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-gray-600">Dates</p>
                          <p>Invoice: {invoice.invoiceDate}</p>
                          <p>Due: {invoice.dueDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Details</p>
                          <p>{invoice.items} items</p>
                          {invoice.paymentMethod && <p className="text-green-600">{invoice.paymentMethod}</p>}
                        </div>
                      </div>
                      {invoice.notes && <p className="text-sm text-gray-600 mt-2 italic">{invoice.notes}</p>}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewInvoice(invoice.id)}
                        className="bg-white/50 border-white/20"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        className="bg-white/50 border-white/20"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendInvoice(invoice)}
                        className="bg-white/50 border-white/20"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
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
