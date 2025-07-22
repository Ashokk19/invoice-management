"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Search, Truck, Package, Eye, Download } from "lucide-react"
import { format } from "date-fns"
import AppSidebar from "@/components/app-sidebar"
import { toast } from "sonner"

interface DeliveryNote {
  id: string
  deliveryNoteNumber: string
  customer: string
  invoiceNumber: string
  deliveryDate: string
  status: "Pending" | "In Transit" | "Delivered"
  items: Array<{
    itemName: string
    quantity: number
    delivered: number
  }>
  deliveryAddress: string
  trackingNumber?: string
}

export default function DeliveryNote() {
  const [deliveryNotes, setDeliveryNotes] = useState<DeliveryNote[]>([
    {
      id: "DN001",
      deliveryNoteNumber: "DN-2024-001",
      customer: "Rajesh Kumar",
      invoiceNumber: "INV-2024-001",
      deliveryDate: "2024-01-20",
      status: "Delivered",
      items: [
        { itemName: "Product A", quantity: 10, delivered: 10 },
        { itemName: "Product B", quantity: 5, delivered: 5 },
      ],
      deliveryAddress: "123 MG Road, Mumbai, Maharashtra 400001",
      trackingNumber: "TRK123456789",
    },
    {
      id: "DN002",
      deliveryNoteNumber: "DN-2024-002",
      customer: "Priya Sharma",
      invoiceNumber: "INV-2024-002",
      deliveryDate: "2024-01-22",
      status: "In Transit",
      items: [{ itemName: "Product C", quantity: 8, delivered: 0 }],
      deliveryAddress: "456 Park Street, Delhi, Delhi 110001",
      trackingNumber: "TRK123456790",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [formData, setFormData] = useState({
    customer: "",
    invoiceNumber: "",
    deliveryAddress: "",
    items: [{ itemName: "", quantity: 0 }],
  })

  const filteredNotes = deliveryNotes.filter(
    (note) =>
      note.deliveryNoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateDeliveryNote = () => {
    const newNote: DeliveryNote = {
      id: `DN${String(deliveryNotes.length + 1).padStart(3, "0")}`,
      deliveryNoteNumber: `DN-2024-${String(deliveryNotes.length + 1).padStart(3, "0")}`,
      customer: formData.customer,
      invoiceNumber: formData.invoiceNumber,
      deliveryDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : new Date().toISOString().split("T")[0],
      status: "Pending",
      items: formData.items.map((item) => ({ ...item, delivered: 0 })),
      deliveryAddress: formData.deliveryAddress,
      trackingNumber: `TRK${Date.now()}`,
    }
    setDeliveryNotes([...deliveryNotes, newNote])
    setIsDialogOpen(false)
    toast.success("Delivery note created successfully!")
  }

  const updateStatus = (id: string, status: "Pending" | "In Transit" | "Delivered") => {
    setDeliveryNotes(deliveryNotes.map((note) => (note.id === id ? { ...note, status } : note)))
    toast.success(`Status updated to ${status}`)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
      <div className="w-72 bg-white/30 backdrop-blur-lg border-r border-white/50 shadow-2xl z-10">
        <AppSidebar currentPath="/sales/delivery" />
      </div>
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
              Delivery Notes
            </h1>
            <p className="text-gray-600 mt-1">Manage delivery notes and track shipments</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Delivery Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl border-white/20">
              <DialogHeader>
                <DialogTitle>Create New Delivery Note</DialogTitle>
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
                  <Label>Delivery Date</Label>
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
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea
                    id="address"
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    placeholder="Enter complete delivery address"
                    className="bg-white/50 border-white/20"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateDeliveryNote} className="bg-gradient-to-r from-violet-500 to-purple-600">
                    Create Delivery Note
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search delivery notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border-white/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Delivery Notes Table */}
        <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Delivery Notes ({filteredNotes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Delivery Note</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotes.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell>
                      <div className="font-medium">{note.deliveryNoteNumber}</div>
                    </TableCell>
                    <TableCell>{note.customer}</TableCell>
                    <TableCell>{note.invoiceNumber}</TableCell>
                    <TableCell>{format(new Date(note.deliveryDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {note.items.length} items
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select value={note.status} onValueChange={(value: any) => updateStatus(note.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Transit">In Transit</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{note.trackingNumber}</code>
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
