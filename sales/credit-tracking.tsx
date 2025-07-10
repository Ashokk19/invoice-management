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
import { Plus, Search, Download, Send, Eye } from "lucide-react"
import { toast } from "sonner"
import AppSidebar from "../components/app-sidebar"

interface CreditNote {
  id: string
  creditNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  originalInvoiceNumber: string
  creditDate: string
  amount: number
  usedAmount: number
  remainingAmount: number
  status: "Active" | "Partially Used" | "Fully Used" | "Expired"
  reason: string
  expiryDate?: string
  notes?: string
}

export default function CreditTracking() {
  const [credits, setCredits] = useState<CreditNote[]>([
    {
      id: "1",
      creditNumber: "CR-2024-001",
      customerName: "Rajesh Kumar",
      customerEmail: "rajesh@example.com",
      customerPhone: "+91 9876543210",
      originalInvoiceNumber: "INV-2024-001",
      creditDate: "2024-01-20",
      amount: 5000,
      usedAmount: 2000,
      remainingAmount: 3000,
      status: "Partially Used",
      reason: "Product return",
      expiryDate: "2024-07-20",
      notes: "Credit issued for defective laptop stand",
    },
    {
      id: "2",
      creditNumber: "CR-2024-002",
      customerName: "Priya Sharma",
      customerEmail: "priya@example.com",
      customerPhone: "+91 9876543211",
      originalInvoiceNumber: "INV-2024-002",
      creditDate: "2024-01-25",
      amount: 3000,
      usedAmount: 0,
      remainingAmount: 3000,
      status: "Active",
      reason: "Overpayment",
      expiryDate: "2024-07-25",
    },
    {
      id: "3",
      creditNumber: "CR-2024-003",
      customerName: "Amit Patel",
      customerEmail: "amit@example.com",
      customerPhone: "+91 9876543212",
      originalInvoiceNumber: "INV-2024-003",
      creditDate: "2024-01-15",
      amount: 2500,
      usedAmount: 2500,
      remainingAmount: 0,
      status: "Fully Used",
      reason: "Promotional credit",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredCredits = credits.filter((credit) => {
    const matchesSearch =
      credit.creditNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.originalInvoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || credit.status.toLowerCase().replace(" ", "_") === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Partially Used":
        return "bg-yellow-100 text-yellow-800"
      case "Fully Used":
        return "bg-gray-100 text-gray-800"
      case "Expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateTotals = () => {
    const totalCredits = filteredCredits.length
    const totalAmount = filteredCredits.reduce((sum, credit) => sum + credit.amount, 0)
    const totalUsed = filteredCredits.reduce((sum, credit) => sum + credit.usedAmount, 0)
    const totalRemaining = filteredCredits.reduce((sum, credit) => sum + credit.remainingAmount, 0)
    const activeCount = filteredCredits.filter((c) => c.status === "Active").length

    return { totalCredits, totalAmount, totalUsed, totalRemaining, activeCount }
  }

  const { totalCredits, totalAmount, totalUsed, totalRemaining, activeCount } = calculateTotals()

  const handleDownloadPDF = (creditId: string) => {
    toast.success("Credit note PDF downloaded successfully!")
  }

  const handleSendWhatsApp = (credit: CreditNote) => {
    const message = `Hi ${credit.customerName}, your credit note ${credit.creditNumber} for ₹${credit.remainingAmount.toFixed(2)} is available. Valid until ${credit.expiryDate}.`
    const whatsappUrl = `https://wa.me/${credit.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    toast.success("WhatsApp opened successfully!")
  }

  const handleCreateCredit = () => {
    toast.success("Credit note created successfully!")
    setIsDialogOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <AppSidebar currentPath="/sales/credits" />

      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
              Credit Amount Tracking
            </h1>
            <p className="text-gray-600 mt-1">Manage customer credit notes and balances</p>
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
                  New Credit Note
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl border-white/20">
                <DialogHeader>
                  <DialogTitle>Create Credit Note</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Customer *</Label>
                      <Select>
                        <SelectTrigger className="bg-white/50 border-white/20">
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CUST001">Rajesh Kumar</SelectItem>
                          <SelectItem value="CUST002">Priya Sharma</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Original Invoice</Label>
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
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Credit Amount *</Label>
                      <Input type="number" placeholder="Enter amount" className="bg-white/50 border-white/20" />
                    </div>
                    <div>
                      <Label>Expiry Date</Label>
                      <Input type="date" className="bg-white/50 border-white/20" />
                    </div>
                  </div>
                  <div>
                    <Label>Reason *</Label>
                    <Select>
                      <SelectTrigger className="bg-white/50 border-white/20">
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="return">Product Return</SelectItem>
                        <SelectItem value="overpayment">Overpayment</SelectItem>
                        <SelectItem value="promotional">Promotional Credit</SelectItem>
                        <SelectItem value="goodwill">Goodwill Gesture</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea placeholder="Additional notes..." className="bg-white/50 border-white/20" rows={3} />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCredit} className="bg-violet-500">
                      Create Credit Note
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
                <p className="text-2xl font-bold text-violet-700">{totalCredits}</p>
                <p className="text-sm text-gray-600">Total Credits</p>
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
                <p className="text-2xl font-bold text-red-700">₹{totalUsed.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Used Amount</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">₹{totalRemaining.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Remaining</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-700">{activeCount}</p>
                <p className="text-sm text-gray-600">Active Credits</p>
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
                    placeholder="Search credit notes..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="partially_used">Partially Used</SelectItem>
                  <SelectItem value="fully_used">Fully Used</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Credit Notes List */}
        <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-violet-700">Credit Notes ({filteredCredits.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCredits.map((credit) => (
                <div key={credit.id} className="p-4 bg-white/30 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{credit.creditNumber}</h3>
                        <Badge className={getStatusColor(credit.status)}>{credit.status}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Customer</p>
                          <p className="font-medium">{credit.customerName}</p>
                          <p className="text-gray-500">{credit.customerEmail}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Amount Details</p>
                          <p className="font-bold text-lg text-blue-700">₹{credit.amount.toLocaleString()}</p>
                          <p className="text-green-600 text-sm">
                            Remaining: ₹{credit.remainingAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Dates</p>
                          <p>Created: {credit.creditDate}</p>
                          {credit.expiryDate && <p>Expires: {credit.expiryDate}</p>}
                        </div>
                        <div>
                          <p className="text-gray-600">Details</p>
                          <p className="font-medium">{credit.reason}</p>
                          <p className="text-gray-500">{credit.originalInvoiceNumber}</p>
                        </div>
                      </div>
                      {credit.notes && <p className="text-sm text-gray-600 mt-2 italic">{credit.notes}</p>}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" className="bg-white/50 border-white/20">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPDF(credit.id)}
                        className="bg-white/50 border-white/20"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendWhatsApp(credit)}
                        className="bg-green-50 border-green-200 text-green-600"
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
