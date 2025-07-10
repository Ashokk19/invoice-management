"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Download, Eye, Receipt } from "lucide-react"
import { toast } from "sonner"
import AppSidebar from "../components/app-sidebar"

interface Payment {
  id: string
  paymentNumber: string
  invoiceNumber: string
  customerName: string
  customerEmail: string
  paymentDate: string
  amount: number
  paymentMethod: "Cash" | "Bank Transfer" | "Credit Card" | "UPI" | "Cheque" | "Online"
  status: "Completed" | "Pending" | "Failed" | "Refunded"
  transactionId?: string
  bankName?: string
  chequeNumber?: string
  notes?: string
}

export default function PaymentLog() {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "1",
      paymentNumber: "PAY-2024-001",
      invoiceNumber: "INV-2024-001",
      customerName: "Rajesh Kumar",
      customerEmail: "rajesh@example.com",
      paymentDate: "2024-01-20",
      amount: 25000,
      paymentMethod: "Bank Transfer",
      status: "Completed",
      transactionId: "TXN123456789",
      bankName: "HDFC Bank",
      notes: "Payment received on time",
    },
    {
      id: "2",
      paymentNumber: "PAY-2024-002",
      invoiceNumber: "INV-2024-002",
      customerName: "Priya Sharma",
      customerEmail: "priya@example.com",
      paymentDate: "2024-01-22",
      amount: 18500,
      paymentMethod: "UPI",
      status: "Completed",
      transactionId: "UPI987654321",
    },
    {
      id: "3",
      paymentNumber: "PAY-2024-003",
      invoiceNumber: "INV-2024-003",
      customerName: "Amit Patel",
      customerEmail: "amit@example.com",
      paymentDate: "2024-01-25",
      amount: 15000,
      paymentMethod: "Cheque",
      status: "Pending",
      chequeNumber: "CHQ001234",
      bankName: "SBI Bank",
    },
    {
      id: "4",
      paymentNumber: "PAY-2024-004",
      invoiceNumber: "INV-2024-004",
      customerName: "Sneha Reddy",
      customerEmail: "sneha@example.com",
      paymentDate: "2024-01-28",
      amount: 12000,
      paymentMethod: "Credit Card",
      status: "Failed",
      notes: "Card declined - insufficient funds",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [methodFilter, setMethodFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.transactionId && payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || payment.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesMethod =
      methodFilter === "all" || payment.paymentMethod.toLowerCase().replace(" ", "_") === methodFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesMethod
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      case "Refunded":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "Cash":
        return "bg-green-50 text-green-700"
      case "Bank Transfer":
        return "bg-blue-50 text-blue-700"
      case "Credit Card":
        return "bg-purple-50 text-purple-700"
      case "UPI":
        return "bg-orange-50 text-orange-700"
      case "Cheque":
        return "bg-gray-50 text-gray-700"
      case "Online":
        return "bg-indigo-50 text-indigo-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  const calculateTotals = () => {
    const totalPayments = filteredPayments.length
    const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)
    const completedAmount = filteredPayments
      .filter((p) => p.status === "Completed")
      .reduce((sum, payment) => sum + payment.amount, 0)
    const pendingAmount = filteredPayments
      .filter((p) => p.status === "Pending")
      .reduce((sum, payment) => sum + payment.amount, 0)
    const completedCount = filteredPayments.filter((p) => p.status === "Completed").length

    return { totalPayments, totalAmount, completedAmount, pendingAmount, completedCount }
  }

  const { totalPayments, totalAmount, completedAmount, pendingAmount, completedCount } = calculateTotals()

  const handleRecordPayment = () => {
    toast.success("Payment recorded successfully!")
    setIsDialogOpen(false)
  }

  const handleDownloadReceipt = (paymentId: string) => {
    toast.success("Payment receipt downloaded successfully!")
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <AppSidebar currentPath="/sales/payments" />

      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
              Payment Log
            </h1>
            <p className="text-gray-600 mt-1">Track and manage all payment transactions</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white/50 backdrop-blur-sm border-white/20">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-violet-500 to-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Record Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl border-white/20">
                <DialogHeader>
                  <DialogTitle>Record New Payment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Invoice Number *</Label>
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
                      <Label>Payment Amount *</Label>
                      <Input type="number" placeholder="Enter amount" className="bg-white/50 border-white/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Payment Method *</Label>
                      <Select>
                        <SelectTrigger className="bg-white/50 border-white/20">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Payment Date *</Label>
                      <Input type="date" className="bg-white/50 border-white/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Transaction ID</Label>
                      <Input placeholder="Enter transaction ID" className="bg-white/50 border-white/20" />
                    </div>
                    <div>
                      <Label>Bank/Reference</Label>
                      <Input placeholder="Bank name or reference" className="bg-white/50 border-white/20" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleRecordPayment} className="bg-violet-500">
                      Record Payment
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-violet-700">{totalPayments}</p>
                <p className="text-sm text-gray-600">Total Payments</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-700">₹{totalAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Amount</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">₹{completedAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-700">₹{pendingAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-700">{completedCount}</p>
                <p className="text-sm text-gray-600">Success Rate</p>
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
                    placeholder="Search payments..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-40 bg-white/50 border-white/20">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-violet-700">Payment Transactions ({filteredPayments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div key={payment.id} className="p-4 bg-white/30 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{payment.paymentNumber}</h3>
                        <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                        <Badge className={getMethodColor(payment.paymentMethod)}>{payment.paymentMethod}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Customer</p>
                          <p className="font-medium">{payment.customerName}</p>
                          <p className="text-gray-500">{payment.customerEmail}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Invoice & Amount</p>
                          <p className="font-medium">{payment.invoiceNumber}</p>
                          <p className="font-bold text-lg text-green-700">₹{payment.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Payment Details</p>
                          <p>{payment.paymentDate}</p>
                          {payment.transactionId && <p className="text-gray-500 text-xs">{payment.transactionId}</p>}
                        </div>
                        <div>
                          <p className="text-gray-600">Reference</p>
                          {payment.bankName && <p className="font-medium">{payment.bankName}</p>}
                          {payment.chequeNumber && <p className="text-gray-500">{payment.chequeNumber}</p>}
                        </div>
                      </div>
                      {payment.notes && <p className="text-sm text-gray-600 mt-2 italic">{payment.notes}</p>}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" className="bg-white/50 border-white/20">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadReceipt(payment.id)}
                        className="bg-white/50 border-white/20"
                      >
                        <Receipt className="w-4 h-4" />
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
