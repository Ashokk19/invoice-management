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
import { Search, Plus, Edit, Trash2, Download, Upload, Phone, Mail, MapPin, Building } from "lucide-react"
import { toast } from "sonner"
import AppSidebar from "@/components/app-sidebar"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  gstin: string
  address: string
  city: string
  state: string
  pincode: string
  customerType: "Individual" | "Business"
  totalOrders: number
  totalAmount: number
  status: "Active" | "Inactive"
  createdAt: string
}

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "CUST001",
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone: "+91 9876543210",
      gstin: "27AABCU9603R1ZX",
      address: "123 MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      customerType: "Business",
      totalOrders: 15,
      totalAmount: 125000,
      status: "Active",
      createdAt: "2024-01-15",
    },
    {
      id: "CUST002",
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 9876543211",
      gstin: "09AABCU9603R1ZY",
      address: "456 Park Street",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      customerType: "Individual",
      totalOrders: 8,
      totalAmount: 45000,
      status: "Active",
      createdAt: "2024-02-10",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gstin: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    customerType: "Individual" as "Individual" | "Business",
  })

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.gstin.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = () => {
    if (editingCustomer) {
      setCustomers(
        customers.map((customer) => (customer.id === editingCustomer.id ? { ...customer, ...formData } : customer)),
      )
      toast.success("Customer updated successfully!")
    } else {
      const newCustomer: Customer = {
        id: `CUST${String(customers.length + 1).padStart(3, "0")}`,
        ...formData,
        totalOrders: 0,
        totalAmount: 0,
        status: "Active",
        createdAt: new Date().toISOString().split("T")[0],
      }
      setCustomers([...customers, newCustomer])
      toast.success("Customer added successfully!")
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      gstin: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      customerType: "Individual",
    })
    setEditingCustomer(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      gstin: customer.gstin,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      customerType: customer.customerType,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setCustomers(customers.filter((customer) => customer.id !== id))
    toast.success("Customer deleted successfully!")
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
      <AppSidebar currentPath="/sales/customers" />
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
              Customer Management
            </h1>
            <p className="text-gray-600 mt-1">Manage your customer database</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white/50 backdrop-blur-sm border-white/20">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" className="bg-white/50 backdrop-blur-sm border-white/20">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl border-white/20">
                <DialogHeader>
                  <DialogTitle>{editingCustomer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Customer Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerType">Customer Type</Label>
                    <Select
                      value={formData.customerType}
                      onValueChange={(value: "Individual" | "Business") =>
                        setFormData({ ...formData, customerType: value })
                      }
                    >
                      <SelectTrigger className="bg-white/50 border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="gstin">GSTIN</Label>
                    <Input
                      id="gstin"
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                      className="bg-white/50 border-white/20"
                      placeholder="27AABCU9603R1ZX"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} className="bg-gradient-to-r from-violet-500 to-purple-600">
                    {editingCustomer ? "Update" : "Add"} Customer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search customers by name, email, phone, or GSTIN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border-white/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer Table */}
        <Card className="bg-white/40 backdrop-blur-3xl border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Customers ({filteredCustomers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>GSTIN</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.id}</div>
                        <Badge
                          variant={customer.customerType === "Business" ? "default" : "secondary"}
                          className="mt-1"
                        >
                          {customer.customerType}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{customer.gstin}</code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3" />
                        {customer.city}, {customer.state}
                      </div>
                    </TableCell>
                    <TableCell>{customer.totalOrders}</TableCell>
                    <TableCell>₹{customer.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={customer.status === "Active" ? "default" : "secondary"}>{customer.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(customer)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(customer.id)}>
                          <Trash2 className="w-3 h-3" />
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
