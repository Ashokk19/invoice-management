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
import { Plus, Search, Download, Eye, Truck, MapPin } from "lucide-react"
import { toast } from "sonner"
import AppSidebar from "../components/app-sidebar"

interface Shipment {
  id: string
  shipmentNumber: string
  customerName: string
  customerEmail: string
  invoiceNumber: string
  deliveryNoteNumber: string
  shipmentDate: string
  expectedDelivery: string
  actualDelivery?: string
  status: "Preparing" | "Shipped" | "In Transit" | "Out for Delivery" | "Delivered" | "Failed"
  carrier: string
  trackingNumber: string
  shippingAddress: string
  items: ShipmentItem[]
  totalWeight: number
  shippingCost: number
  notes?: string
}

interface ShipmentItem {
  id: string
  itemName: string
  quantity: number
  weight: number
}

export default function ShipmentRecords() {
  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: "1",
      shipmentNumber: "SHP-2024-001",
      customerName: "Rajesh Kumar",
      customerEmail: "rajesh@example.com",
      invoiceNumber: "INV-2024-001",
      deliveryNoteNumber: "DN-2024-001",
      shipmentDate: "2024-01-20",
      expectedDelivery: "2024-01-22",
      actualDelivery: "2024-01-22",
      status: "Delivered",
      carrier: "Blue Dart",
      trackingNumber: "BD123456789",
      shippingAddress: "123 MG Road, Mumbai, Maharashtra - 400001",
      totalWeight: 2.5,
      shippingCost: 150,
      items: [
        { id: "1", itemName: "Laptop Stand", quantity: 1, weight: 1.5 },
        { id: "2", itemName: "Wireless Mouse", quantity: 1, weight: 1.0 }
      ],
      notes: "Delivered successfully"
    },
    {
      id: "2",
      shipmentNumber: "SHP-2024-002",
      customerName: "Priya Sharma",
      customerEmail: "priya@example.com",
      invoiceNumber: "INV-2024-002",
      deliveryNoteNumber: "DN-2024-002",
      shipmentDate: "2024-01-23",
      expectedDelivery: "2024-01-25",
      status: "In Transit",
      carrier: "DTDC",
      trackingNumber: "DT987654321",
      shippingAddress: "456 Park Street, Delhi - 110001",
      totalWeight: 3.2,
      shippingCost: 200,
      items: [
        { id: "3", itemName: "Keyboard", quantity: 2, weight: 1.6 },
        { id: "4", itemName: "Monitor Stand", quantity: 1, weight: 1.6 }
      ]
    },
    {
      id: "3",
      shipmentNumber: "SHP-2024-003",
      customerName: "Amit Patel",
      customerEmail: "amit@example.com",
      invoiceNumber: "INV-2024-003",
      deliveryNoteNumber: "DN-2024-003",
      shipmentDate: "2024-01-25",
      expectedDelivery: "2024-01-27",
      status: "Preparing",
      carrier: "FedEx",
      trackingNumber: "FX456789123",
      shippingAddress: "789 Commercial Street, Bangalore, Karnataka - 560001",
      totalWeight: 1.8,
      shippingCost: 180,
      items: [
        { id: "5", itemName: "USB Hub", quantity: 1, weight: 0.8 },
        { id: "6", itemName: "Cable Organizer", quantity: 2, weight: 1.0 }
      ]
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [carrierFilter, setCarrierFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.shipmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || shipment.status.toLowerCase().replace(" ", "_") === statusFilter.toLowerCase()
    const matchesCarrier = carrierFilter === "all" || shipment.carrier.toLowerCase() === carrierFilter.toLowerCase()
    
    return matchesSearch && matchesStatus && matchesCarrier
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-800"
      case "Out for Delivery": return "bg-blue-100 text-blue-800"
      case "In Transit": return "bg-yellow-100 text-yellow-800"
      case "Shipped": return "bg-purple-100 text-purple-800"
      case "Preparing": return "bg-orange-100 text-orange-800"
      case "Failed": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const updateShipmentStatus = (shipmentId: string, newStatus: string) => {
    setShipments(shipments.map(shipment => 
      shipment.id === shipmentId 
        ? { 
            ...shipment, 
            status: newStatus as any,
            actualDelivery: newStatus === "Delivered" ? new Date().toISOString().split('T')[0] : shipment.actualDelivery
          }
        : shipment
    ))
    toast.success(`Shipment status updated to ${newStatus}`)
  }

  const calculateTotals = () => {
    const totalShipments = filteredShipments.length
    const totalWeight = filteredShipments.reduce((sum, shipment) => sum + shipment.totalWeight, 0)
    const totalCost = filteredShipments.reduce((sum, shipment) => sum + shipment.shippingCost, 0)
    const deliveredCount = filteredShipments.filter(s => s.status === "Delivered").length
    
    return { totalShipments, totalWeight, totalCost, deliveredCount }
  }

  const { totalShipments, totalWeight, totalCost, deliveredCount } = calculateTotals()

  const trackShipment = (trackingNumber: string, carrier: string) => {
    // This would typically open the carrier's tracking page
    toast.success(`Opening tracking for ${trackingNumber}`)
  }

  const handleCreateShipment = () => {
    toast.success("Shipment created successfully!")
    setIsDialogOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <AppSidebar currentPath="/sales/shipments" />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
              Shipment Records
            </h1>
            <p className="text-gray-600 mt-1">Track and manage all shipments and deliveries</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white/50 backdrop-blur-sm border-white/20">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-violet-500 to-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Shipment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl border-white/20">
                <DialogHeader>
                  <DialogTitle>Create New Shipment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Customer</Label>
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
                      <Label>Invoice/Delivery Note</Label>
                      <Select>
                        <SelectTrigger className="bg-white/50 border-white/20">
                          <SelectValue placeholder="Select document" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INV-2024-001">INV-2024-001</SelectItem>
                          <SelectItem value="DN-2024-001">DN-2024-001</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Carrier</Label>
                      <Select>
                        <SelectTrigger className="bg-white/50 border-white/20">
                          <SelectValue placeholder="Select carrier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue_dart">Blue Dart</SelectItem>
                          <SelectItem value="dtdc">DTDC</SelectItem>
                          <SelectItem value="fedex">FedEx</SelectItem>
                          <SelectItem value="dhl">DHL</SelectItem>
                          <SelectItem value="india_post">India Post</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Tracking Number</Label>
                      <Input 
                        placeholder="Enter tracking number"
                        className="bg-white/50 border-white/20"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Shipment Date</Label>
                      <Input 
                        type="date"
                        className="bg-white/50 border-white/20"
                      />
                    </div>
                    <div>
                      <Label>Expected Delivery</Label>
                      <Input 
                        type="date"
                        className="bg-white/50 border-white/20"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Shipping Address</Label>
                    <Textarea 
                      placeholder="Complete shipping address..."
                      className="bg-white/50 border-white/20"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateShipment} className="bg-violet-500">
                      Create Shipment
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-violet-700">{totalShipments}</p>
                <p className="text-sm text-gray-600">Total Shipments</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-700">{totalWeight.toFixed(1)} kg</p>
                <p className="text-sm text-gray-600">Total Weight</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">₹{totalCost.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Shipping Cost</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-700">{deliveredCount}</p>
                <p className="text-sm text-gray-600">Delivered</p>
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
                    placeholder="Search shipments..."
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
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={carrierFilter} onValueChange={setCarrierFilter}>
                <SelectTrigger className="w-40 bg-white/50 border-white/20">
                  <SelectValue placeholder="Carrier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Carriers</SelectItem>
                  <SelectItem value="blue dart">Blue Dart</SelectItem>
                  <SelectItem value="dtdc">DTDC</SelectItem>
                  <SelectItem value="fedex">FedEx</SelectItem>
                  <SelectItem value="dhl">DHL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Shipments List */}
        <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-violet-700">Shipments ({filteredShipments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredShipments.map((shipment) => (
                <div key={shipment.id} className="p-4 bg-white/30 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{shipment.shipmentNumber}</h3>
                        <Badge className={getStatusColor(shipment.status)}>
                          {shipment.status}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {shipment.carrier}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Customer</p>
                          <p className="font-medium">{shipment.customerName}</p>
                          <p className="text-gray-500">{shipment.customerEmail}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Documents</p>
                          <p className="font-medium">{shipment.invoiceNumber}</p>
                          <p className="text-gray-500">{shipment.deliveryNoteNumber}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tracking</p>
                          <p className="font-medium">{shipment.trackingNumber}</p>
                          <p className="text-gray-500">{shipment.totalWeight} kg</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Delivery</p>
                          <p>Expected: {shipment.expectedDelivery}</p>
                          {shipment.actualDelivery && (
                            <p className="text-green-600">Delivered: {shipment.actualDelivery}</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {shipment.shippingAddress}
                        </p>
                      </div>
                      {shipment.notes && (
                        <p className="text-sm text-gray-600 mt-2 italic">{shipment.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedShipment(shipment)}
                        className="bg-white/50 border-white/20"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => trackShipment(shipment.trackingNumber, shipment.carrier)}
                        className="bg-blue-50 border-blue-200 text-blue-600"
                      >
                        <Truck className="w-4 h-4" />
                      </Button>
                      {shipment.status !== "Delivered" && shipment.status !== "Failed" && (
                        <Select onValueChange={(value) => updateSh
