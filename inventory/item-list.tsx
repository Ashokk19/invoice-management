"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Download, Upload, Package, FileDown, FileUp, Filter } from "lucide-react"
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
import './inventory-log.css'

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

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      ["Name", "SKU", "Description", "Type", "Price", "Stock", "Expiry Date"],
      ...items.map(item => [
        item.name,
        item.sku,
        item.description,
        item.type,
        item.price.toString(),
        item.stock.toString(),
        item.expiryDate || ""
      ])
    ]
        .map(row => row.map(field => `"${field}"`).join(","))
        .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "inventory-items.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Import functionality (placeholder)
  const handleImport = () => {
    // In a real application, you'd implement file upload and parsing
    alert("Import functionality would be implemented here")
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50 flex relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-50 to-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-50 to-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse delay-500"></div>
        </div>

        {/* Enhanced grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Sidebar - Increased width */}
        <div className="w-72 bg-white/40 backdrop-blur-3xl border-r border-white/80 shadow-2xl relative z-10">
          <AppSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Item List</h1>
                <p className="text-gray-600 font-medium mt-1">
                  Manage your inventory items
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Controls Section with proper spacing */}
          <Card className="mb-4 bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60">
            <CardContent className="p-6">
              <div className="controls-inner">
                {/* Search */}
                <div className="controls-search-wrapper relative">
                  <div className="relative bg-white/30 backdrop-blur-lg border border-white/50 rounded-lg overflow-hidden shadow-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search by name, SKU or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:ring-0"
                    />
                  </div>
                </div>
              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    onClick={handleImport}
                    className="whitespace-nowrap">
                  <Upload className="w-4 h-4 mr-1" />
                  <span>Import</span>
                </Button>
                <Button
                    variant="outline"
                    onClick={handleExport}
                    className="glass-card py-2 px-3 flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="py-2 px-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white flex items-center space-x-1">
                      <Plus className="w-4 h-4 mr-1" />
                      <span>Add Item</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card max-w-md mx-auto mt-20 p-6 space-y-4 rounded-xl shadow-xl">
                    <DialogHeader>
                      <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
                      <DialogDescription>
                        {editingItem ? "Update the item details below." : "Fill in the details to add a new item."}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="name">Item Name *</Label>
                        <Input
                            id="name"
                            value={newItem.name || ""}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="w-full bg-transparent border border-white/50 px-3 py-2 rounded-md"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sku">SKU *</Label>
                        <Input
                            id="sku"
                            value={newItem.sku || ""}
                            onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                            className="w-full bg-transparent border border-white/50 px-3 py-2 rounded-md"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={newItem.description || ""}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            className="w-full bg-transparent border border-white/50 px-3 py-2 rounded-md"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Price *</Label>
                          <Input
                              id="price"
                              type="number"
                              value={newItem.price || ""}
                              onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                              className="w-full bg-transparent border border-white/50 px-3 py-2 rounded-md"
                          />
                        </div>
                        <div>
                          <Label htmlFor="stock">Stock Quantity</Label>
                          <Input
                              id="stock"
                              type="number"
                              value={newItem.stock || ""}
                              onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) })}
                              className="w-full bg-transparent border border-white/50 px-3 py-2 rounded-md"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                        <Input
                            id="expiryDate"
                            type="date"
                            value={newItem.expiryDate || ""}
                            onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                            className="w-full bg-transparent border border-white/50 px-3 py-2 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="px-4 py-2">
                        Cancel
                      </Button>
                      <Button
                          onClick={editingItem ? handleUpdateItem : handleAddItem}
                          className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white"
                      >
                        {editingItem ? "Update" : "Add"} Item
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

              </div>

              {/* Import/Export Buttons */}

            </div>
            </CardContent>
          </Card>

          {/* Items Table with proper spacing */}
          <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                <Package className="w-5 h-5 mr-2 text-violet-600" />
                Items ({filteredItems.length})
              </CardTitle>
              <CardDescription className="text-gray-600 font-medium">Manage your inventory items</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="rounded-lg border border-white/40 bg-white/20 backdrop-blur-lg overflow-hidden">
                <Table style={{ borderCollapse: 'separate', borderSpacing: '0px 4px' }}>
                  <TableHeader>
                    <TableRow className="border-white/40">
                      <TableHead className="bg-white/30 font-semibold text-gray-700">Name</TableHead>
                      <TableHead className="bg-white/30 font-semibold text-gray-700">SKU</TableHead>
                      <TableHead className="bg-white/30 font-semibold text-gray-700">Description</TableHead>
                      <TableHead className="bg-white/30 font-semibold text-gray-700">Type</TableHead>
                      <TableHead className="bg-white/30 font-semibold text-gray-700">Price</TableHead>
                      <TableHead className="bg-white/30 font-semibold text-gray-700">Stock</TableHead>
                      <TableHead className="bg-white/30 font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                        <TableRow
                            key={item.id}
                            className="border-white/40 hover:bg-white/30 transition-colors duration-200 bg-white/15"
                        >
                          <TableCell className="font-medium text-gray-900">{item.name}</TableCell>
                          <TableCell className="text-gray-700">{item.sku}</TableCell>
                          <TableCell className="text-gray-700 max-w-xs truncate">{item.description}</TableCell>
                          <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-violet-100/60 text-violet-700">
                          {item.type}
                        </span>
                          </TableCell>
                          <TableCell>
                        <span className="font-semibold text-gray-900">
                          ${item.price.toFixed(2)}
                        </span>
                          </TableCell>
                          <TableCell>
                        <span className={`font-semibold ${item.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                          {item.stock}
                        </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditItem(item)}
                                  className="bg-white/50 hover:bg-white/70 border-white/60"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="bg-red-50/50 hover:bg-red-100/70 text-red-600 border-red-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                    {filteredItems.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            No items found matching your search criteria
                          </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
