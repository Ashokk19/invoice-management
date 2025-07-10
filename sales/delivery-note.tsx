"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Minus, Download, Save, Truck } from "lucide-react"
import { toast } from "sonner"
import AppSidebar from "../components/app-sidebar"

interface DeliveryItem {
  id: string
  itemName: string
  description: string
  quantity: number
  unit: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

export default function DeliveryNote() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [deliveryNoteNumber, setDeliveryNoteNumber] = useState("DN-2024-" + String(Date.now()).slice(-4))
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split("T")[0])
  const [referenceNumber, setReferenceNumber] = useState("")
  const [items, setItems] = useState<DeliveryItem[]>([
    {
      id: "1",
      itemName: "",
      description: "",
      quantity: 1,
      unit: "Pcs",
    },
  ])
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [receiverName, setReceiverName] = useState("")
  const [receiverSignature, setReceiverSignature] = useState("")

  const customers: Customer[] = [
    {
      id: "1",
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone: "+91 9876543210",
      address: "123 MG Road, Mumbai, Maharashtra - 400001",
    },
    {
      id: "2",
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 9876543211",
      address: "456 Park Street, Delhi - 110001",
    },
  ]

  const addItem = () => {
    const newItem: DeliveryItem = {
      id: String(Date.now()),
      itemName: "",
      description: "",
      quantity: 1,
      unit: "Pcs",
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof DeliveryItem, value: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleSave = () => {
    if (!customer) {
      toast.error("Please select a customer")
      return
    }
    if (items.some((item) => !item.itemName || item.quantity <= 0)) {
      toast.error("Please fill all item details")
      return
    }
    toast.success("Delivery note saved successfully!")
  }

  const handleDownloadPDF = () => {
    toast.success("Delivery note PDF downloaded successfully!")
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <AppSidebar currentPath="/sales/delivery" />

      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
              Create Delivery Note
            </h1>
            <p className="text-gray-600 mt-1">Generate delivery notes without pricing information</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSave} className="bg-white/50 backdrop-blur-sm border-white/20">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handleDownloadPDF} className="bg-gradient-to-r from-violet-500 to-purple-600">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Delivery Note Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer & Delivery Details */}
            <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-violet-700">Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Customer *</Label>
                    <Select
                      onValueChange={(value) => {
                        const selectedCustomer = customers.find((c) => c.id === value) || null
                        setCustomer(selectedCustomer)
                        if (selectedCustomer) {
                          setDeliveryAddress(selectedCustomer.address)
                        }
                      }}
                    >
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
                    <Label>Delivery Note Number</Label>
                    <Input
                      value={deliveryNoteNumber}
                      onChange={(e) => setDeliveryNoteNumber(e.target.value)}
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Delivery Date *</Label>
                    <Input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                  <div>
                    <Label>Reference Number</Label>
                    <Input
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      className="bg-white/50 border-white/20"
                      placeholder="Invoice/Order reference"
                    />
                  </div>
                </div>
                <div>
                  <Label>Delivery Address *</Label>
                  <Textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="bg-white/50 border-white/20"
                    rows={3}
                    placeholder="Complete delivery address"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-violet-700">Items to Deliver</CardTitle>
                <Button onClick={addItem} size="sm" className="bg-violet-500">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-4 bg-white/30 rounded-lg">
                      <div className="col-span-4">
                        <Label className="text-xs">Item Name *</Label>
                        <Input
                          value={item.itemName}
                          onChange={(e) => updateItem(item.id, "itemName", e.target.value)}
                          className="bg-white/50 border-white/20 text-sm"
                          placeholder="Enter item name"
                        />
                      </div>
                      <div className="col-span-4">
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          className="bg-white/50 border-white/20 text-sm"
                          placeholder="Item description"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Quantity *</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                          className="bg-white/50 border-white/20 text-sm"
                          min="1"
                        />
                      </div>
                      <div className="col-span-1">
                        <Label className="text-xs">Unit</Label>
                        <Select value={item.unit} onValueChange={(value) => updateItem(item.id, "unit", value)}>
                          <SelectTrigger className="bg-white/50 border-white/20 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pcs">Pcs</SelectItem>
                            <SelectItem value="Kg">Kg</SelectItem>
                            <SelectItem value="Ltr">Ltr</SelectItem>
                            <SelectItem value="Box">Box</SelectItem>
                            <SelectItem value="Set">Set</SelectItem>
                          </SelectContent>
                        </Select>
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

            {/* Delivery Instructions & Signature */}
            <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-violet-700">Delivery Instructions & Signature</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Special Instructions</Label>
                  <Textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="bg-white/50 border-white/20"
                    placeholder="Any special delivery instructions..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Receiver Name</Label>
                    <Input
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      className="bg-white/50 border-white/20"
                      placeholder="Name of person receiving"
                    />
                  </div>
                  <div>
                    <Label>Receiver Signature</Label>
                    <div className="h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white/30">
                      <span className="text-gray-500 text-sm">Signature area</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Summary */}
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
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Delivery Summary */}
            <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-violet-700">Delivery Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span className="font-semibold">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Quantity:</span>
                  <span className="font-semibold">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Date:</span>
                  <span className="font-semibold">{deliveryDate}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-3xl border-white/20 shadow-xl">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button onClick={handleSave} className="w-full bg-violet-500 hover:bg-violet-600">
                    <Save className="w-4 h-4 mr-2" />
                    Save Delivery Note
                  </Button>
                  <Button onClick={handleDownloadPDF} variant="outline" className="w-full bg-white/50 border-white/20">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="w-full bg-white/50 border-white/20">
                    <Truck className="w-4 h-4 mr-2" />
                    Track Delivery
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
