"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Download, Upload, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import AppSidebar from "../components/app-sidebar"

interface Item {
  id: string
  name: string
  sku: string
  description: string
  type: string
  price: number
  stock: number
  expiryDate?: string
}

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([
    {
      id: "1",
      name: "iPhone 15 Pro",
      sku: "IPH15P001",
      description: "Latest iPhone with advanced camera system",
      type: "Electronics",
      price: 999.99,
      stock: 25,
      expiryDate: "2025-12-31",
    },
    {
      id: "2",
      name: "Samsung Galaxy S24",
      sku: "SGS24001",
      description: "Premium Android smartphone",
      type: "Electronics",
      price: 899.99,
      stock: 15,
      expiryDate: "2025-11-30",
    },
    {
      id: "3",
      name: "Nike Air Max",
      sku: "NAM001",
      description: "Comfortable running shoes",
      type: "Clothing",
      price: 129.99,
      stock: 50,
    },
    {
      id: "4",
      name: "Coffee Beans Premium",
      sku: "CBP001",
      description: "Organic coffee beans from Colombia",
      type: "Food",
      price: 24.99,
      stock: 100,
      expiryDate: "2024-06-15",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [newItem, setNewItem] = useState<Partial<Item>>({
    name: "",
    sku: "",
    description: "",
    type: "",
    price: 0,
    stock: 0,
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
        description: newItem.description || "",
        type: newItem.type,
        price: newItem.price,
        stock: newItem.stock || 0,
        expiryDate: newItem.expiryDate || undefined,
      }
      setItems([...items, item])
      setNewItem({ name: "", sku: "", description: "", type: "", price: 0, stock: 0, expiryDate: "" })
      setIsAddDialogOpen(false)
    }
  }

  const handleEditItem = (item: Item) => {
    setEditingItem(item)
    setNewItem(item)
    setIsAddDialogOpen(true)
  }

  const handleUpdateItem = () => {
    if (editingItem && newItem.name && newItem.sku && newItem.type && newItem.price) {
      setItems(
        items.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: newItem.name!,
                sku: newItem.sku!,
                description: newItem.description || "",
                type: newItem.type!,
                price: newItem.price!,
                stock: newItem.stock || 0,
                expiryDate: newItem.expiryDate || undefined,
              }
            : item,
        ),
      )
      setEditingItem(null)
      setNewItem({ name: "", sku: "", description: "", type: "", price: 0, stock: 0, expiryDate: "" })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50 flex relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-50 to-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      {/* Enhanced grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <AppSidebar currentPath="/inventory/items" />

      {/* Main Content */}
      <div className="flex-1 p-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Item List</h1>
          <p className="text-gray-600 font-medium">Manage your inventory items</p>
        </div>

        {/* Controls */}
        <Card className="mb-6 bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search items by name, SKU, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-white/60"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-white/50 border-white/60">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" className="bg-white/50 border-white/60">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white/90 backdrop-blur-3xl border border-white/80 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
                      <DialogDescription>
                        {editingItem ? "Update the item details below." : "Fill in the details to add a new item."}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Item Name *</Label>
                        <Input
                          id="name"
                          value={newItem.name || ""}
                          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                          className="bg-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sku">SKU *</Label>
                        <Input
                          id="sku"
                          value={newItem.sku || ""}
                          onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                          className="bg-white/50"
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newItem.description || ""}
                          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                          className="bg-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Type *</Label>
                        <Select
                          value={newItem.type || ""}
                          onValueChange={(value) => setNewItem({ ...newItem, type: value })}
                        >
                          <SelectTrigger className="bg-white/50">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Electronics">Electronics</SelectItem>
                            <SelectItem value="Clothing">Clothing</SelectItem>
                            <SelectItem value="Food">Food</SelectItem>
                            <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                            <SelectItem value="Books">Books</SelectItem>
                            <SelectItem value="Sports">Sports</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={newItem.price || ""}
                          onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) || 0 })}
                          className="bg-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock Quantity</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={newItem.stock || ""}
                          onChange={(e) => setNewItem({ ...newItem, stock: Number.parseInt(e.target.value) || 0 })}
                          className="bg-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date (Optional)</Label>
                        <Input
                          id="expiry"
                          type="date"
                          value={newItem.expiryDate || ""}
                          onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                          className="bg-white/50"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={editingItem ? handleUpdateItem : handleAddItem}
                        className="bg-gradient-to-r from-violet-500 to-purple-600"
                      >
                        {editingItem ? "Update" : "Add"} Item
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2 text-violet-600" />
              Items ({filteredItems.length})
            </CardTitle>
            <CardDescription>Manage your inventory items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-white/20">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                          {item.type}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.stock < 10
                              ? "bg-red-100 text-red-700"
                              : item.stock < 25
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditItem(item)}
                            className="hover:bg-violet-100"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            className="hover:bg-red-100 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
