"use client"

import { useState } from "react"
import { Package2, Search, Plus, Edit, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import AppSidebar from "../components/app-sidebar"

interface Category {
  id: string
  name: string
  itemCount: number
  totalValue: number
  color: string
  items: string[]
}

export default function ItemCategories() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "electronics",
      name: "Electronics",
      itemCount: 45,
      totalValue: 125000,
      color: "violet",
      items: ["iPhone 15 Pro", "Samsung Galaxy S24", "MacBook Pro", "iPad Air"],
    },
    {
      id: "clothing",
      name: "Clothing",
      itemCount: 78,
      totalValue: 35000,
      color: "purple",
      items: ["Nike Air Max", "Adidas Sneakers", "Levi's Jeans", "Cotton T-Shirt"],
    },
    {
      id: "food",
      name: "Food & Beverages",
      itemCount: 156,
      totalValue: 15000,
      color: "indigo",
      items: ["Coffee Beans Premium", "Organic Tea", "Protein Bars", "Energy Drinks"],
    },
    {
      id: "home",
      name: "Home & Garden",
      itemCount: 32,
      totalValue: 28000,
      color: "violet",
      items: ["Garden Tools", "Home Decor", "Kitchen Appliances", "Furniture"],
    },
    {
      id: "books",
      name: "Books",
      itemCount: 89,
      totalValue: 8500,
      color: "purple",
      items: ["Programming Books", "Fiction Novels", "Educational Materials", "Magazines"],
    },
    {
      id: "sports",
      name: "Sports & Fitness",
      itemCount: 23,
      totalValue: 12000,
      color: "indigo",
      items: ["Gym Equipment", "Sports Gear", "Fitness Accessories", "Outdoor Equipment"],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(categories)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setCategories(items)
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getColorClasses = (color: string) => {
    switch (color) {
      case "violet":
        return {
          bg: "bg-gradient-to-br from-violet-500/20 to-violet-600/30",
          border: "border-violet-200/50",
          text: "text-violet-700",
          icon: "text-violet-600",
        }
      case "purple":
        return {
          bg: "bg-gradient-to-br from-purple-500/20 to-purple-600/30",
          border: "border-purple-200/50",
          text: "text-purple-700",
          icon: "text-purple-600",
        }
      case "indigo":
        return {
          bg: "bg-gradient-to-br from-indigo-500/20 to-indigo-600/30",
          border: "border-indigo-200/50",
          text: "text-indigo-700",
          icon: "text-indigo-600",
        }
      default:
        return {
          bg: "bg-gradient-to-br from-gray-500/20 to-gray-600/30",
          border: "border-gray-200/50",
          text: "text-gray-700",
          icon: "text-gray-600",
        }
    }
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

      <AppSidebar currentPath="/inventory/categories" />

      {/* Main Content */}
      <div className="flex-1 p-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Item Categories</h1>
          <p className="text-gray-600 font-medium">Organize your inventory by categories</p>
        </div>

        {/* Controls */}
        <Card className="mb-6 bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-white/60"
                />
              </div>
              <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories Grid */}
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
                          <Card
                            className={`bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl hover:shadow-2xl transition-all duration-300 ring-1 ring-white/60 relative overflow-hidden group ${colorClasses.bg} ${colorClasses.border}`}
                          >
                            {/* Glass effect overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20"></div>

                            {/* Drag handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing z-20"
                            >
                              <GripVertical className="w-4 h-4 text-gray-400" />
                            </div>

                            <CardHeader className="relative z-10">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className={`p-2 rounded-lg bg-white/30`}>
                                    <Package2 className={`w-5 h-5 ${colorClasses.icon}`} />
                                  </div>
                                  <div>
                                    <CardTitle className={`text-lg font-bold ${colorClasses.text}`}>
                                      {category.name}
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 font-medium">
                                      {category.itemCount} items
                                    </CardDescription>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" className="hover:bg-white/30">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="hover:bg-red-100 text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent className="relative z-10">
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-600">Total Value</span>
                                  <span className={`text-lg font-bold ${colorClasses.text}`}>
                                    ${category.totalValue.toLocaleString()}
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  <span className="text-sm font-medium text-gray-600">Recent Items</span>
                                  <div className="space-y-1">
                                    {category.items.slice(0, 3).map((item, idx) => (
                                      <div
                                        key={idx}
                                        className="text-xs bg-white/30 rounded px-2 py-1 text-gray-700 font-medium"
                                      >
                                        {item}
                                      </div>
                                    ))}
                                    {category.items.length > 3 && (
                                      <div className="text-xs text-gray-500 font-medium">
                                        +{category.items.length - 3} more items
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full bg-white/30 border-white/40 hover:bg-white/40"
                                >
                                  View All Items
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
