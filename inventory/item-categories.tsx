"use client"

import { useState } from "react"
import { Package2, Search, Plus, Edit, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

interface CategoryItem {
  id: string
  name: string
  sku: string
  price: number
  stock: number
}

interface Category {
  id: string
  name: string
  items: CategoryItem[]
  color: string
}

export default function ItemCategories() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "electronics",
      name: "Electronics",
      color: "violet",
      items: [
        { id: "1", name: "iPhone 15 Pro", sku: "IPH15P-128", price: 999.99, stock: 25 },
        { id: "2", name: "Samsung Galaxy S24", sku: "SGS24-256", price: 899.99, stock: 15 },
        { id: "3", name: "MacBook Pro", sku: "MBP-14-M3", price: 1999.99, stock: 8 },
      ],
    },
    {
      id: "clothing",
      name: "Clothing",
      color: "purple",
      items: [
        { id: "4", name: "Nike Air Max", sku: "NAM-90-BLK", price: 129.99, stock: 50 },
        { id: "5", name: "Adidas Ultraboost", sku: "AUB-22-WHT", price: 149.99, stock: 30 },
      ],
    },
    {
      id: "home-garden",
      name: "Home & Garden",
      color: "indigo",
      items: [
        { id: "6", name: "Garden Hose", sku: "GH-50FT", price: 39.99, stock: 20 },
        { id: "7", name: "Plant Pot Set", sku: "PPS-CERAMIC", price: 24.99, stock: 35 },
      ],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const newCategories = Array.from(categories)
    const [reorderedCategory] = newCategories.splice(result.source.index, 1)
    newCategories.splice(result.destination.index, 0, reorderedCategory)

    setCategories(newCategories)
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.items.some(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  )

  const getColorClasses = (color: string) => {
    const colorMap = {
      violet: {
        bg: "from-violet-500/20 to-violet-600/20",
        border: "border-violet-200/50",
        text: "text-violet-700",
        badge: "bg-violet-100 text-violet-700",
      },
      purple: {
        bg: "from-purple-500/20 to-purple-600/20",
        border: "border-purple-200/50",
        text: "text-purple-700",
        badge: "bg-purple-100 text-purple-700",
      },
      indigo: {
        bg: "from-indigo-500/20 to-indigo-600/20",
        border: "border-indigo-200/50",
        text: "text-indigo-700",
        badge: "bg-indigo-100 text-indigo-700",
      },
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.violet
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
                <Package2 className="w-8 h-8 mr-3 text-violet-600" />
                Item Categories
              </h1>
              <p className="text-gray-600 font-medium mt-1">Organize items by category</p>
            </div>
            <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6 bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search categories or items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 border-white/90"
              />
            </div>
          </CardContent>
        </Card>

        {/* Draggable Categories */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categories">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredCategories.map((category, index) => {
                  const colorClasses = getColorClasses(category.color)
                  return (
                    <Draggable key={category.id} draggableId={category.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`${snapshot.isDragging ? "rotate-3 scale-105" : ""} transition-all duration-200`}
                        >
                          <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl hover:bg-white/50 hover:shadow-2xl transition-all duration-300 ring-1 ring-white/60 relative overflow-hidden group">
                            {/* Glass effect overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses.bg}`}></div>

                            {/* Drag handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing z-20"
                            >
                              <GripVertical className="w-4 h-4 text-gray-400" />
                            </div>

                            <CardHeader className="relative z-10">
                              <CardTitle className={`text-lg font-bold ${colorClasses.text} flex items-center`}>
                                <Package2 className="w-5 h-5 mr-2" />
                                {category.name}
                              </CardTitle>
                              <CardDescription className="text-gray-600 font-medium">
                                {category.items.length} items
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10">
                              <div className="space-y-3">
                                {category.items.slice(0, 3).map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 bg-white/30 rounded-lg border border-white/40 hover:bg-white/40 transition-all duration-200"
                                  >
                                    <div className="flex-1">
                                      <p className="text-gray-900 font-semibold text-sm">{item.name}</p>
                                      <p className="text-gray-600 text-xs">{item.sku}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-gray-900 font-bold text-sm">${item.price}</p>
                                      <span
                                        className={`px-2 py-1 ${colorClasses.badge} rounded-full text-xs font-medium`}
                                      >
                                        {item.stock} in stock
                                      </span>
                                    </div>
                                  </div>
                                ))}
                                {category.items.length > 3 && (
                                  <div className="text-center">
                                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                                      +{category.items.length - 3} more items
                                    </Button>
                                  </div>
                                )}
                              </div>
                              <div className="mt-4 pt-4 border-t border-white/30 flex justify-between">
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                                  <Edit className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}
