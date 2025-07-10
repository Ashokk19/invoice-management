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
import { CalendarIcon, Plus, Search, Ship, Eye, Download, Truck, Package } from "lucide-react"
import { format } from "date-fns"
import AppSidebar from "@/components/app-sidebar"
import { toast } from "sonner"

interface Shipment {
  id: string
  shipmentNumber: string
  customer: string
  invoiceNumber: string
  deliveryNoteNumber: string
  shipmentDate: string
  expectedDelivery: string
  carrier: string
  trackingNumber: string
  status: "Preparing" | "Shipped" | "In Transit" | "Out for Delivery" | "Delivered" | "Exception"
  shippingAddress: string
  items: Array<{
    itemName: string
    quantity: number
  }>
  shippingCost: number
  weight: number
}

export default function ShipmentRecords() {
  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: "SHP001",
      shipmentNumber: "SHP-2024-001",
      customer: "Rajesh Kumar",
      invoiceNumber: "INV-2024-001",
      deliveryNoteNumber: "DN-2024-001",
      shipmentDate: "2024-01-20",
      expectedDelivery: "2024-01-22",
      carrier: "Blue Dart",
      trackingNumber: "BD123456789",
      status: "Delivered",
      shippingAddress: "123 MG Road, Mumbai, Maharashtra 400001",
      items: [
        { itemName: "Product A", quantity: 10 },
        { itemName: "Product B", quantity: 5 },
      ],
      shippingCost: 500,
      weight: 2.5,
    },
    {
      id: "SHP002",
      shipmentNumber: "SHP-2024-002",
      customer: "Priya Sharma",
      invoiceNumber: "INV-2024-002",
      deliveryNoteNumber: "DN-2024-002",
      shipmentDate: "2024-01-22",
      expectedDelivery: "2024-01-25",
      carrier: "DTDC",
      trackingNumber: "DT987654321",
      status: "In Transit",
      shippingAddress: "456 Park Street, Delhi, Delhi 110001",
      items: [{ itemName: "Product C", quantity: 8 }],
      shippingCost: 350,
      weight: 1.8,
    },
    {
      id: "SHP003",
      shipmentNumber: "SHP-2024-003",
      customer: "Amit Patel",
      invoiceNumber: "INV-2024-003",
      deliveryNoteNumber: "DN-2024-003",
      shipmentDate: "2024-01-25",
      expectedDelivery: "2024-01-28",
      carrier: "FedEx",
      trackingNumber: "FX456789123",
      status: "Preparing",
      shippingAddress: "789 Commercial Street, Bangalore, Karnataka 560001",
      items: [
        { itemName: "Product D", quantity: 12 },
        { itemName: "Product E", quantity: 6 },
      ],
      shippingCost: 750,
      weight: 3.2,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [shipmentDate, setShipmentDate] = useState<Date>()
  const [expectedDelivery, setExpectedDelivery] = useState<Date>()
  const [formData, setFormData] = useState({
    customer: "",
    invoiceNumber: "",
    deliveryNoteNumber: "",
    carrier: "",
    shippingAddress: "",
    weight: 0,
    shippingCost: 0,
  })

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.shipmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || shipment.status.toLowerCase() === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateShipment = () => {
    const newShipment: Shipment = {
      id: `SHP${String(shipments.length + 1).padStart(3, "0")}`,
      shipmentNumber: `SHP-2024-${String(shipments.length + 1).padStart(3, "0")}`,
      customer: formData.customer,
      invoiceNumber: formData.invoiceNumber,
      deliveryNoteNumber: formData.deliveryNoteNumber,
      shipmentDate: shipmentDate ? format(shipmentDate, "yyyy-MM-dd") : new Date().toISOString().split("T")[0],
      expectedDelivery: expectedDelivery ? format(expectedDelivery, "yyyy-MM-dd") : "",
      carrier: formData.carrier,
      trackingNumber: `TRK${Date.now()}`,
      status: "Preparing",
      shippingAddress: formData.shippingAddress,
      items: [],
      shippingCost: formData.shippingCost,
      weight: formData.weight,
    }
    setShipments([...shipments, newShipment])
    setIsDialogOpen(false)
    toast.success("Shipment created successfully!")
  }

  const updateStatus = (
    id: string,
    status: "Preparing" | "Shipped" | "In Transit" | "Out for Delivery" | "Delivered" | "Exception",
  ) => {
    setShipments(shipments.map((shipment) => (shipment.id === id ? { ...shipment, status } : shipment)))
    toast.success(`Shipment status updated to ${status}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Out for Delivery":
        return "bg-blue-100 text-blue-800"
      case "In Transit":
        return "bg-yellow-100 text-yellow-800"
      case "Shipped":
        return "bg-purple-100 text-purple-800"
      case "Preparing":
        return "bg-gray-100 text-gray-800"
      case "Exception":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalShipments = filteredShipments.length
  const deliveredShipments = filteredShipments.filter((shipment) => shipment.status === "Delivered").length
  const inTransitShipments = filteredShipments.filter((shipment) => shipment.status === "In Transit").length
  const totalShippingCost = filteredShipments.reduce((sum, shipment) => sum + shipment.shippingCost, 0)

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
      <AppSidebar currentPath="/sales/shipments" />
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
              Shipment Records
            </h1>
            <p className="text-gray-600 mt-1">Track and manage product shipments</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Shipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl border-white/20">
              <DialogHeader>
                <DialogTitle>Create New Shipment</DialogTitle>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deliveryNote">Delivery Note Number</Label>
                    <Input
                      id="deliveryNote"
                      value={formData.deliveryNoteNumber}
                      onChange={(e) => setFormData({ ...formData, deliveryNoteNumber: e.target.value })}
                      placeholder="DN-2024-001"
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="carrier">Carrier</Label>
                    <Select
                      value={formData.carrier}
                      onValueChange={(value) => setFormData({ ...formData, carrier: value })}
                    >
                      <SelectTrigger className="bg-white/50 border-white/20">
                        <SelectValue placeholder="Select carrier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Blue Dart">Blue Dart</SelectItem>
                        <SelectItem value="DTDC">DTDC</SelectItem>
                        <SelectItem value="FedEx">FedEx</SelectItem>
                        <SelectItem value="DHL">DHL</SelectItem>
                        <SelectItem value="India Post">India Post</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Shipment Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start bg-white/50 border-white/20">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {shipmentDate ? format(shipmentDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={shipmentDate} onSelect={setShipmentDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>Expected Delivery</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start bg-white/50 border-white/20">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {expectedDelivery ? format(expectedDelivery, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={expectedDelivery}
                          onSelect={setExpectedDelivery}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: Number.parseFloat(e.target.value) || 0 })}
                      placeholder="0.0"
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost">Shipping Cost</Label>
                    <Input
                      id="cost"
                      type="number"
                      value={formData.shippingCost}
                      onChange={(e) =>
                        setFormData({ ...formData, shippingCost: Number.parseFloat(e.target.value) || 0 })
                      }
                      placeholder="0.00"
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Shipping Address</Label>
                  <Textarea
                    id="address"
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                    placeholder="Complete shipping address"
                    className="bg-white/50 border-white/20"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateShipment} className="bg-gradient-to-r from-violet-500 to-purple-600">
                    Create Shipment
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
                  <p className="text-sm font-medium text-gray-600">Total Shipments</p>
                  <p className="text-2xl font-bold text-gray-900">{totalShipments}</p>
                </div>
                <Ship className="w-8 h-8 text-violet-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-green-600">{deliveredShipments}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Transit</p>
                  <p className="text-2xl font-bold text-yellow-600">{inTransitShipments}</p>
                </div>
                <Truck className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Shipping Cost</p>
                  <p className="text-2xl font-bold text-blue-600">₹{totalShippingCost.toLocaleString()}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">₹</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search shipments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 border-white/20"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-white/50 border-white/20">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="in transit">In Transit</SelectItem>
                  <SelectItem value="out for delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="exception">Exception</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Shipments Table */}
        <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="w-5 h-5" />
              Shipment Records ({filteredShipments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Tracking Number</TableHead>
                  <TableHead>Ship Date</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell>
                      <div className="font-medium">{shipment.shipmentNumber}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {shipment.items.length} items
                      </div>
                    </TableCell>
                    <TableCell>{shipment.customer}</TableCell>
                    <TableCell>{shipment.invoiceNumber}</TableCell>
                    <TableCell>{shipment.carrier}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{shipment.trackingNumber}</code>
                    </TableCell>
                    <TableCell>{format(new Date(shipment.shipmentDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      {shipment.expectedDelivery ? format(new Date(shipment.expectedDelivery), "MMM dd, yyyy") : "-"}
                    </TableCell>
                    <TableCell>
                      <Select value={shipment.status} onValueChange={(value: any) => updateStatus(shipment.id, value)}>
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Preparing">Preparing</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="In Transit">In Transit</SelectItem>
                          <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Exception">Exception</SelectItem>
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
