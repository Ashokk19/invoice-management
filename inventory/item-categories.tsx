"use client"

import { useState, useMemo } from "react"
import {
  Package2,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import AppSidebar from "@/components/app-sidebar"

import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  closestCenter,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

/* ---------- Types ---------- */
interface Category {
  id: string
  name: string
  itemCount: number
  totalValue: number
  color: "violet" | "purple" | "indigo"
  items: string[]
  description?: string
}

/* ---------- Glass Card Wrapper ---------- */
function GlassCard({
                     children,
                     className = "",
                   }: {
  children: React.ReactNode
  className?: string
}) {
  return (
      <Card
          className={`
        bg-white/30 backdrop-blur-3xl border border-white/80 shadow-xl
        ring-1 ring-white/60 relative overflow-hidden rounded-lg
        max-w-[200px] mx-auto ${className}
      `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20" />
        {children}
      </Card>
  )
}

/* ---------- Sortable Tile Component ---------- */
function SortableTile({
                        category,
                        onEdit,
                        onDelete,
                      }: {
  category: Category
  onEdit: (c: Category) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
      useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const colors = {
    violet: {
      bg: "from-violet-500/20 to-violet-600/30",
      txt: "text-violet-700",
      icn: "text-violet-600",
    },
    purple: {
      bg: "from-purple-500/20 to-purple-600/30",
      txt: "text-purple-700",
      icn: "text-purple-600",
    },
    indigo: {
      bg: "from-indigo-500/20 to-indigo-600/30",
      txt: "text-indigo-700",
      icn: "text-indigo-600",
    },
  }[category.color]

  return (
      <div ref={setNodeRef} style={style}>
        <GlassCard className={`bg-gradient-to-br ${colors.bg}`}>
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/30">
                  <Package2 className={`w-5 h-5 ${colors.icn}`} />
                </div>
                <div>
                  <CardTitle className={`text-base font-bold ${colors.txt}`}>
                    {category.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    {category.itemCount} items
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-white/30 p-1"
                    onClick={() => onEdit(category)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-red-100 text-red-600 p-1"
                    onClick={() => onDelete(category.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative z-10 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Value</span>
              <span className={`font-semibold ${colors.txt}`}>
              ${category.totalValue.toLocaleString()}
            </span>
            </div>
            <div className="space-y-1">
              <span className="text-gray-600">Recent</span>
              {category.items.slice(0, 2).map((it) => (
                  <div
                      key={it}
                      className="bg-white/30 rounded px-2 py-1 text-gray-700 truncate"
                  >
                    {it}
                  </div>
              ))}
              {category.items.length > 2 && (
                  <div className="text-gray-500">+{category.items.length - 2} more</div>
              )}
            </div>
            <Button
                variant="outline"
                size="sm"
                className="w-full text-xs bg-white/30 border-white/40 hover:bg-white/40"
            >
              View Items
            </Button>
          </CardContent>
        </GlassCard>
      </div>
  )
}

/* ---------- Page Component ---------- */
export default function ItemCategories() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "electronics",
      name: "Electronics",
      itemCount: 45,
      totalValue: 125000,
      color: "violet",
      items: ["iPhone 15 Pro", "Galaxy S24", "MacBook Pro"],
    },
    {
      id: "clothing",
      name: "Clothing",
      itemCount: 78,
      totalValue: 35000,
      color: "purple",
      items: ["Nike Air", "Adidas", "Levi’s Jeans"],
    },
    {
      id: "food",
      name: "Food & Beverages",
      itemCount: 28,
      totalValue: 135000,
      color: "indigo",
      items: ["Chicken", "Mutton", "Fish"],
    },
    // add more as needed...
  ])
  const [search, setSearch] = useState("")
  const [dlgOpen, setDlgOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState<Partial<Category>>({
    name: "",
    color: "violet",
    items: [],
  })

  /* Drag & Drop setup */
  const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
      useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const [activeId, setActiveId] = useState<string | null>(null)

  const handleDragStart = ({ active }: DragStartEvent) =>
      setActiveId(active.id as string)
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      setCategories((cats) => {
        const oldIndex = cats.findIndex((c) => c.id === active.id)
        const newIndex = cats.findIndex((c) => c.id === over.id)
        return arrayMove(cats, oldIndex, newIndex)
      })
    }
    setActiveId(null)
  }

  /* Search logic: filter by category name or any item */
  const visible = useMemo(() => {
    const q = search.toLowerCase()
    return categories.filter(
        (c) =>
            c.name.toLowerCase().includes(q) ||
            c.items.some((it) => it.toLowerCase().includes(q))
    )
  }, [categories, search])

  /* CRUD operations (add/edit/delete) */
  const handleAdd = () => {
    if (form.name) {
      setCategories([
        ...categories,
        {
          id: Date.now().toString(),
          name: form.name!,
          itemCount: 0,
          totalValue: 0,
          color: form.color as Category["color"],
          items: form.items || [],
        },
      ])
      setDlgOpen(false)
      setForm({ name: "", color: "violet", items: [] })
    }
  }

  const handleEdit = (cat: Category) => {
    setEditing(cat)
    setForm(cat)
    setDlgOpen(true)
  }

  const handleUpdate = () => {
    if (editing && form.name) {
      setCategories((cats) =>
          cats.map((c) =>
              c.id === editing.id ? { ...c, ...form } as Category : c
          )
      )
      setEditing(null)
      setDlgOpen(false)
      setForm({ name: "", color: "violet", items: [] })
    }
  }

  const handleDelete = (id: string) => {
    setCategories((cats) => cats.filter((c) => c.id !== id))
  }

  const handleExport = () => {
    const csv = [
      ["Category", "Value", "Count"],
      ...categories.map((c) => [c.name, c.totalValue, c.itemCount]),
    ]
        .map((row) => row.join(","))
        .join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "categories.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => alert("Import not implemented")

  return (
      <div className="min-h-screen flex overflow-hidden bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50 relative">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-50 to-indigo-100 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-50 to-violet-100 rounded-full filter blur-3xl opacity-25 animate-pulse delay-500" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Sidebar */}
        <div className="w-72 bg-white/30 backdrop-blur-lg border-r border-white/50 shadow-2xl z-10">
          <AppSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 relative z-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Item Categories</h1>
          <p className="text-gray-600 mb-6">
            Organize your inventory by categories
          </p>

          {/* Controls */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[280px] bg-white/30 backdrop-blur-lg border border-white/50 rounded-lg shadow-md flex items-center px-3 py-2">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <Input
                  placeholder="Search by category or item..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 flex-1"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                  variant="outline"
                  className="bg-white/30 backdrop-blur-lg border border-white/50 rounded-lg shadow-md px-3 py-2 flex items-center"
                  onClick={handleImport}
              >
                <Upload className="w-4 h-4 mr-1" />
                Import
              </Button>
              <Button
                  variant="outline"
                  className="bg-white/30 backdrop-blur-lg border border-white/50 rounded-lg shadow-md px-3 py-2 flex items-center"
                  onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Dialog open={dlgOpen} onOpenChange={setDlgOpen}>
                <DialogTrigger asChild>
                  <Button className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white flex items-center">
                    <Plus className="w-4 h-4 mr-1" />{" "}
                    {editing ? "Edit Category" : "Add Category"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card max-w-md mx-auto mt-20 p-6 space-y-4 rounded-xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editing ? "Edit Category" : "Add New Category"}
                    </DialogTitle>
                    <DialogDescription>
                      {editing
                          ? "Update the category details below."
                          : "Fill in the details to add a new category."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="name">Category Name *</Label>
                      <Input
                          id="name"
                          value={form.name || ""}
                          onChange={(e) =>
                              setForm({ ...form, name: e.target.value })
                          }
                          className="bg-transparent border border-white/50 px-3 py-2 rounded-md"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                          id="description"
                          value={form.description || ""}
                          onChange={(e) =>
                              setForm({ ...form, description: e.target.value })
                          }
                          className="bg-transparent border border-white/50 px-3 py-2 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setDlgOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                        onClick={editing ? handleUpdate : handleAdd}
                        className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white"
                    >
                      {editing ? "Update" : "Add"} Category
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Tiles Grid: always multiple per row */}
          <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
          >
            <SortableContext
                items={visible.map((c) => c.id)}
                strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {visible.map((cat) => (
                    <SortableTile
                        key={cat.id}
                        category={cat}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId && (
                  <SortableTile
                      category={
                        categories.find((c) => c.id === activeId)!
                      }
                      onEdit={() => {}}
                      onDelete={() => {}}
                  />
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
  )
}
