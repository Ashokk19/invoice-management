"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Minus, Download, Send, Save } from "lucide-react"
import { toast } from "sonner"
import AppSidebar from "../components/app-sidebar"

interface InvoiceItem {
  id: string
  itemName: string
  description: string
  quantity: number
  rate: number
  taxRate: number
  amount: number
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  gstNumber?: string
}

export default function InvoiceCreation() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2024-" + String(Date.now()).slice(-4))
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0])
  const [dueDate, setDueDate] = useState("")
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      itemName: "",
      description: "",
      quantity: 1,
      rate: 0,
      taxRate: 18,
      amount: 0,
    },
  ])
  const [notes, setNotes] = useState("")
  const [termsConditions, setTermsConditions] = useState("Payment due within 30 days")

  const customers: Customer[] = [
    {
      id: "1",
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone: "+91 9876543210",
      address: "123 MG Road, Mumbai, Maharashtra - 400001",
      gstNumber: "27ABCDE1234F1Z5",
    },
    {
      id: "2",
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 9876543211",
      address: "456 Park Street, Delhi - 110001",
      gstNumber: "07FGHIJ5678K2L6",
    },
  ]

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: String(Date.now()),
      itemName: "",
      description: "",
      quantity: 1,
      rate: 0,
      taxRate: 18,
      amount: 0,
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate
          }
          return updatedItem
        }
        return item
      }),
    )
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const totalTax = items.reduce((sum, item) => sum + (item.amount * item.taxRate) / 100, 0)
    const total = subtotal + totalTax
    return { subtotal, totalTax, total }
  }

  const { subtotal, totalTax, total } = calculateTotals()

  const handleSave = () => {
    if (!customer) {
      toast.error("Please select a customer")
      return
    }
    if (items.some((item) => !item.itemName || item.quantity <= 0 || item.rate <= 0)) {
      toast.error("Please fill all item details")
      return
    }
    toast.success("Invoice saved successfully!")
  }

  const handleDownloadPDF = () => {
    toast.success("PDF downloaded successfully!")
  }

  const handleSendWhatsApp = () => {
    if (!customer) {
      toast.error("Please select a customer")
      return
    }
    const message = `Hi ${customer.name}, your invoice ${invoiceNumber} for ₹${total.toFixed(2)} is ready. Please find the details attached.`
    const whatsappUrl = `https://wa.me/${customer.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    toast.success("WhatsApp opened successfully!")
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <AppSidebar currentPath="/sales/invoices" />

      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
              Create Tax Invoice
            </h1>
            <p className="text-gray-600 mt-1">Generate professional invoices with tax calculations</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSave} className="bg-white/50 backdrop-blur-sm border-white/20">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              className="bg-white/50 backdrop-blur-sm border-white/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handleSendWhatsApp} className="bg-gradient-to-r from-green-500 to-green-600">
              <Send className="w-4 h-4 mr-2" />
              Send WhatsApp
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoice Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer & Invoice Details */}
            <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-violet-700">Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Customer *</Label>
                    <Select onValueChange={(value) => setCustomer(customers.find((c) => c.id === value) || null)}>
                      <SelectTrigger className="bg-white/50 border-white/20">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Invoice Number</Label>
                    <Input
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Invoice Date *</Label>
                    <Input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-violet-700">Invoice Items</CardTitle>
                <Button onClick={addItem} size="sm" className="bg-violet-500">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-4 bg-white/30 rounded-lg">
                      <div className="col-span-3">
                        <Label className="text-xs">Item Name *</Label>
                        <Input
                          value={item.itemName}
                          onChange={(e) => updateItem(item.id, "itemName", e.target.value)}
                          className="bg-white/50 border-white/20 text-sm"
                          placeholder="Enter item name"
                        />
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          className="bg-white/50 border-white/20 text-sm"
                          placeholder="Item description"
                        />
                      </div>
                      <div className="col-span-1">
                        <Label className="text-xs">Qty *</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                          className="bg-white/50 border-white/20 text-sm"
                          min="1"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Rate *</Label>
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, "rate", Number.parseFloat(e.target.value) || 0)}
                          className="bg-white/50 border-white/20 text-sm"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-span-1">
                        <Label className="text-xs">Tax %</Label>
                        <Select
                          value={String(item.taxRate)}
                          onValueChange={(value) => updateItem(item.id, "taxRate", Number.parseInt(value))}
                        >
                          <SelectTrigger className="bg-white/50 border-white/20 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0%</SelectItem>
                            <SelectItem value="5">5%</SelectItem>
                            <SelectItem value="12">12%</SelectItem>
                            <SelectItem value="18">18%</SelectItem>
                            <SelectItem value="28">28%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1">
                        <Label className="text-xs">Amount</Label>
                        <div className="text-sm font-semibold text-violet-700 py-2">₹{item.amount.toFixed(2)}</div>
                      </div>
                      <div className="col-span-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                          className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes & Terms */}
            <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-violet-700">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-white/50 border-white/20"
                    placeholder="Any additional notes..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Terms & Conditions</Label>
                  <Textarea
                    value={termsConditions}
                    onChange={(e) => setTermsConditions(e.target.value)}
                    className="bg-white/50 border-white/20"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Preview & Summary */}
          <div className="space-y-6">
            {/* Customer Info */}
            {customer && (
              <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-violet-700">Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                    <p className="text-sm text-gray-600 mt-2">{customer.address}</p>
                    {customer.gstNumber && <p className="text-sm text-gray-600">GST: {customer.gstNumber}</p>}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Invoice Summary */}
            <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-violet-700">Invoice Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tax:</span>
                  <span>₹{totalTax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span className="text-violet-700">₹{total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-3xl border-white/20 shadow-xl">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button onClick={handleSave} className="w-full bg-violet-500 hover:bg-violet-600">
                    <Save className="w-4 h-4 mr-2" />
                    Save Invoice
                  </Button>
                  <Button onClick={handleDownloadPDF} variant="outline" className="w-full bg-white/50 border-white/20">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button onClick={handleSendWhatsApp} className="w-full bg-green-500 hover:bg-green-600">
                    <Send className="w-4 h-4 mr-2" />
                    Send via WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
