"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Search, CreditCard, Eye, Download, DollarSign } from "lucide-react"
import { format } from "date-fns"
import AppSidebar from "@/components/app-sidebar"
import { toast } from "sonner"

interface Credit {
  id: string
  creditNumber: string
  customer: string
  invoiceNumber?: string
  creditDate: string
  amount: number
  usedAmount: number
  remainingAmount: number
  reason: string
  status: "Active" | "Used" | "Expired"
  expiryDate?: string
  type: "Return Credit" | "Adjustment" | "Promotional"
}

export default function CreditTracking() {
  const [credits, setCredits] = useState<Credit[]>([
    {
      id: "CR001",
      creditNumber: "CR-2024-001",
      customer: "Rajesh Kumar",
      invoiceNumber: "INV-2024-001",
      creditDate: "2024-01-25",
      amount: 5000,
      usedAmount: 2000,
      remainingAmount: 3000,
      reason: "Product return refund",
      status: "Active",
      expiryDate: "2024-07-25",
      type: "Return Credit",
    },
    {
      id: "CR002",
      creditNumber: "CR-2024-002",
      customer: "Priya Sharma",
      creditDate: "2024-01-28",
      amount: 1000,
      usedAmount: 1000,
      remainingAmount: 0,
      reason: "Promotional credit",
      status: "Used",
      type: "Promotional",
    },
    {
      id: "CR003",
      creditNumber: "CR-2024-003",
      customer: "Amit Patel",
      creditDate: "2024-01-30",
      amount: 2500,
      usedAmount: 0,
      remainingAmount: 2500,
      reason: "Billing adjustment",
      status: "Active",
      expiryDate: "2024-07-30",
      type: "Adjustment",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [expiryDate, setExpiryDate] = useState<Date>()
  const [formData, setFormData] = useState({
    customer: "",
    amount: 0,
    reason: "",
    type: "Adjustment" as "Return Credit" | "Adjustment" | "Promotional",
  })

  const filteredCredits = credits.filter(
    (credit) =>
      credit.creditNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (credit.invoiceNumber && credit.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleCreateCredit = () => {
    const newCredit: Credit = {
      id: `CR${String(credits.length + 1).padStart(3, "0")}`,
      creditNumber: `CR-2024-${String(credits.length + 1).padStart(3, "0")}`,
      customer: formData.customer,
      creditDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : new Date().toISOString().split("T")[0],
      amount: formData.amount,
      usedAmount: 0,
      remainingAmount: formData.amount,
      reason: formData.reason,
      status: "Active",
      expiryDate: expiryDate ? format(expiryDate, "yyyy-MM-dd") : undefined,
      type: formData.type,
    }
    setCredits([...credits, newCredit])
    setIsDialogOpen(false)
    toast.success("Credit created successfully!")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Used":
        return "bg-gray-100 text-gray-800"
      case "Expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalCredits = filteredCredits.length
  const totalCreditAmount = filteredCredits.reduce((sum, credit) => sum + credit.amount, 0)
  const totalRemainingAmount = filteredCredits.reduce((sum, credit) => sum + credit.remainingAmount, 0)
  const activeCredits = filteredCredits.filter((credit) => credit.status === "Active").length

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">

      <div className="w-72 bg-white/30 backdrop-blur-lg border-r border-white/50 shadow-2xl z-10">
        <AppSidebar currentPath="/sales/credits" />
      </div>
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
              Credit Management
            </h1>
            <p className="text-gray-600 mt-1">Track and manage customer credits</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Credit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl border-white/20">
              <DialogHeader>
                <DialogTitle>Create Customer Credit</DialogTitle>
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
                        <SelectItem value="Amit Patel">Amit Patel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount">Credit Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                </div>
                <div>
                  <Label>Credit Date</Label>
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
                  <Label>Expiry Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start bg-white/50 border-white/20">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expiryDate ? format(expiryDate, "PPP") : "Pick expiry date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={expiryDate} onSelect={setExpiryDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="type">Credit Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="bg-white/50 border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Return Credit">Return Credit</SelectItem>
                      <SelectItem value="Adjustment">Adjustment</SelectItem>
                      <SelectItem value="Promotional">Promotional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Reason for credit"
                    className="bg-white/50 border-white/20"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCredit} className="bg-gradient-to-r from-violet-500 to-purple-600">
                    Create Credit
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Credits</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCredits}</p>
                </div>
                <CreditCard className="w-8 h-8 text-violet-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Credit Amount</p>
                  <p className="text-2xl font-bold text-gray-900">₹{totalCreditAmount.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-violet-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Remaining Amount</p>
                  <p className="text-2xl font-bold text-green-600">₹{totalRemainingAmount.toLocaleString()}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">₹</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Credits</p>
                  <p className="text-2xl font-bold text-blue-600">{activeCredits}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">✓</span>
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
                placeholder="Search credits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border-white/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Credits Table */}
        <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Customer Credits ({filteredCredits.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Credit Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Credit Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Used Amount</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCredits.map((credit) => (
                  <TableRow key={credit.id}>
                    <TableCell>
                      <div className="font-medium">{credit.creditNumber}</div>
                      {credit.invoiceNumber && <div className="text-sm text-gray-500">{credit.invoiceNumber}</div>}
                    </TableCell>
                    <TableCell>{credit.customer}</TableCell>
                    <TableCell>{format(new Date(credit.creditDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{credit.type}</Badge>
                    </TableCell>
                    <TableCell>₹{credit.amount.toLocaleString()}</TableCell>
                    <TableCell>₹{credit.usedAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="font-medium text-green-600">₹{credit.remainingAmount.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(credit.status)}>{credit.status}</Badge>
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
