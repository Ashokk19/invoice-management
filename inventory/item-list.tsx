"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Filter, Download, Upload, Package, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Item {
  id: string
  name: string
  sku: string
  description: string
  type: string
  price: number
  expiryDate?: string
  addedBy: string
  addedDate: string
}

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([
    {
      id: "1",
      name: "iPhone 15 Pro",
      sku: "IPH15P-128",
      description: "Latest iPhone with 128GB storage",
      type: "Electronics",
      price: 999.99,
      expiryDate: "2025-12-31",
      addedBy: "John Doe",
      addedDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Samsung Galaxy S24",
      sku: "SGS24-256",
      description: "Samsung flagship with 256GB storage",
      type: "Electronics",
      price: 899.99,
      expiryDate: "2025-11-30",
      addedBy: "Jane Smith",
      addedDate: "2024-01-10",
    },
    {
      id: "3",
      name: "Nike Air Max",
      sku: "NAM-90-BLK",
      description: "Classic Nike Air Max 90 in Black",
      type: "Clothing",
      price: 129.99,
      addedBy: "Mike Johnson",
      addedDate: "2024-01-12",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    sku: "",
    description: "",
    type: "",
    price: "",
    expiryDate: "",
  })

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddItem = () => {
    if (newItem.name && newItem.sku && newItem.type && newItem.price) {
      const item: Item = {
        id: Date.now().toString(),
        name: newItem.name,
        sku: newItem.sku,
        description: newItem.description,
        type: newItem.type,
        price: Number.parseFloat(newItem.price),
        expiryDate: newItem.expiryDate || undefined,
        addedBy: "Current User", // In real app, get from auth
        addedDate: new Date().toISOString().split("T")[0],
      }
      setItems([...items, item])
      setNewItem({ name: "", sku: "", description: "", type: "", price: "", expiryDate: "" })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50 p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-50 to-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      {/* Enhanced grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Package className="w-8 h-8 mr-3 text-violet-600" />
                Item List
              </h1>
              <p className="text-gray-600 font-medium mt-1">Manage your inventory items</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="bg-white/70 backdrop-blur-lg border-white/90 hover:bg-white/80">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" className="bg-white/70 backdrop-blur-lg border-white/90 hover:bg-white/80">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white/90 backdrop-blur-3xl border border-white/80 shadow-2xl max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900">Add New Item</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Enter the details for the new inventory item.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-800 font-semibold">
                        Item Name
                      </Label>
                      <Input
                        id="name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="bg-white/80 border-white/90"
                        placeholder="Enter item name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku" className="text-gray-800 font-semibold">
                        SKU
                      </Label>
                      <Input
                        id="sku"
                        value={newItem.sku}
                        onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                        className="bg-white/80 border-white/90"
                        placeholder="Enter SKU"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-gray-800 font-semibold">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        className="bg-white/80 border-white/90"
                        placeholder="Enter description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type" className="text-gray-800 font-semibold">
                        Type
                      </Label>
                      <Select value={newItem.type} onValueChange={(value) => setNewItem({ ...newItem, type: value })}>
                        <SelectTrigger className="bg-white/80 border-white/90">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Clothing">Clothing</SelectItem>
                          <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                          <SelectItem value="Books">Books</SelectItem>
                          <SelectItem value="Sports">Sports</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="price" className="text-gray-800 font-semibold">
                        Price
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        className="bg-white/80 border-white/90"
                        placeholder="Enter price"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiryDate" className="text-gray-800 font-semibold">
                        Expiry Date (Optional)
                      </Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={newItem.expiryDate}
                        onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                        className="bg-white/80 border-white/90"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddItem}
                      className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                    >
                      Add Item
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search items by name, SKU, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-white/90"
                />
              </div>
              <Button variant="outline" className="bg-white/70 backdrop-blur-lg border-white/90 hover:bg-white/80">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60">
          <CardHeader>
            <CardTitle className="text-gray-900">Items ({filteredItems.length})</CardTitle>
            <CardDescription className="text-gray-600">Manage your inventory items</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700 font-semibold">Name</TableHead>
                  <TableHead className="text-gray-700 font-semibold">SKU</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Description</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Type</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Price</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-white/30">
                    <TableCell className="font-medium text-gray-900">{item.name}</TableCell>
                    <TableCell className="text-gray-700">{item.sku}</TableCell>
                    <TableCell className="text-gray-700 max-w-xs truncate">{item.description}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                        {item.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-900 font-semibold">${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-lg">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteItem(item.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
