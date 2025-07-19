"use client"

import { useState, useMemo } from "react"
import {
  Home,
  Package,
  ShoppingCart,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  Users,
  FileText,
  Truck,
  History,
  RotateCcw,
  CreditCard,
  Receipt,
  Ship,
  Building2,
  ClipboardList,
  Package2,
  AlertTriangle,
  ScrollText,
  DollarSign,
  TrendingUp,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  GripVertical,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import AppSidebar from '@/components/app-sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// @dnd-kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  MeasuringStrategy
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Tile size configurations (no xlarge)
const TILE_SIZES = {
  small: { className: "col-span-1", height: "h-28" },
  normal: { className: "col-span-2", height: "h-48" },
  large: { className: "col-span-4", height: "h-48" },
} as const

type TileSize = keyof typeof TILE_SIZES

interface DashboardTile {
  id: string
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
  icon: any
  description: string
  size: TileSize
}

// Sortable tile with resize
function SortableTileWithResize({
                                  tile,
                                  onResize
                                }: {
  tile: DashboardTile
  onResize: (tileId: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tile.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
      <div
          ref={setNodeRef}
          style={style}
          className={`
        ${TILE_SIZES[tile.size].className}
        ${TILE_SIZES[tile.size].height}
        transition-all duration-200 relative
      `}
      >
        <Card className="relative bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl hover:bg-white/50 hover:shadow-2xl ring-1 ring-white/60 overflow-hidden group h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20 pointer-events-none z-0" />

          {/* Drag handle */}
          <div
              {...listeners}
              {...attributes}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing z-30 p-1 rounded bg-white/20 hover:bg-white/30"
              title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>

          {/* Resize button */}
          <button
              onClick={() => onResize(tile.id)}
              className="absolute top-2 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 p-1 rounded bg-white/20 hover:bg-white/30 cursor-pointer"
              title={`Size: ${tile.size}`}
          >
            {tile.size === 'small' && <Minimize2 className="w-3 h-3 text-gray-600" />}
            {tile.size === 'normal' && <BarChart3 className="w-3 h-3 text-gray-600" />}
            {tile.size === 'large' && <Maximize2 className="w-3 h-3 text-gray-600" />}
          </button>

          {/* Size indicator */}
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
          <span className="text-xs bg-white/20 px-2 py-1 rounded text-gray-600 font-medium">
            {tile.size}
          </span>
          </div>

          {/* Content */}
          <CardHeader className="flex items-center justify-between pb-2 relative z-10">
            <CardTitle className={tile.size === 'small'
                ? 'text-[0.65rem] font-medium text-gray-700 px-1'
                : 'text-sm font-semibold text-gray-700'
            }>
              {tile.title}
            </CardTitle>
            <div className={`
            p-2 rounded-lg
            ${tile.changeType === "positive" ? "bg-violet-500/20" : "bg-orange-500/20"}
            ${tile.size === 'small' ? 'p-1' : ''}
          `}>
              <tile.icon
                  className={`
                ${tile.changeType === "positive" ? "text-violet-600" : "text-orange-600"}
                ${tile.size === 'small' ? 'w-3 h-3' : 'w-4 h-4'}
              `}
              />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`
            font-bold text-gray-900 mb-1
            ${tile.size === 'small' ? 'text-base leading-snug px-1' : 'text-2xl'}
          `}>
              {tile.value}
            </div>
            <div className="flex items-center space-x-2">
            <span className={`
              font-medium flex items-center
              ${tile.changeType === "positive" ? "text-green-600" : "text-red-600"}
              ${tile.size === 'small' ? 'text-[0.6rem] px-1' : 'text-sm'}
            `}>
              {tile.changeType === "positive" ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
              {tile.change}
            </span>
            </div>
            {/* Hide description in small size */}
            {tile.size !== "small" && (
                <p className="text-gray-600 mt-2 text-xs font-medium px-1">
                  {tile.description}
                </p>
            )}
          </CardContent>
        </Card>
      </div>
  )
}

// Drag preview overlay
function TileOverlay({ tile }: { tile: DashboardTile }) {
  return (
      <div className={`
      ${TILE_SIZES[tile.size].className}
      ${TILE_SIZES[tile.size].height}
      rotate-6 scale-105
    `}>
        <Card className="bg-white/60 backdrop-blur-3xl border border-white/90 shadow-2xl ring-1 ring-white/70 overflow-hidden h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/30" />
          <CardHeader className="flex items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700">{tile.title}</CardTitle>
            <div className="p-2 rounded-lg bg-violet-500/20">
              <tile.icon className="w-4 h-4 text-violet-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-gray-900 mb-1">{tile.value}</div>
            <p className="text-xs text-gray-600 font-medium">{tile.description}</p>
          </CardContent>
        </Card>
      </div>
  )
}

export default function Dashboard() {
  const [expandedMenus] = useState<string[]>(["dashboard"])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dashboardTiles, setDashboardTiles] = useState<DashboardTile[]>([
    { id: "stock-value", title: "Total Stock Value", value: "$2,847,650", change: "+12.5%", changeType: "positive", icon: DollarSign, description: "Current inventory worth", size: "normal" },
    { id: "monthly-sales", title: "Monthly Sales", value: "$485,230", change: "+8.2%", changeType: "positive", icon: TrendingUp, description: "This month vs last month", size: "normal" },
    { id: "low-stock", title: "Low Stock Items", value: "23", change: "+5", changeType: "negative", icon: AlertTriangle, description: "Items below minimum stock", size: "small" },
    { id: "active-customers", title: "Active Customers", value: "1,247", change: "+15.3%", changeType: "positive", icon: Users, description: "Customers with recent activity", size: "large" },
    { id: "pending-orders", title: "Pending Orders", value: "89", change: "-12%", changeType: "positive", icon: ClipboardList, description: "Orders awaiting fulfillment", size: "normal" },
    { id: "revenue-growth", title: "Revenue Growth", value: "24.8%", change: "+3.2%", changeType: "positive", icon: BarChart3, description: "Year over year growth", size: "normal" },
  ])

  // Sensors
  const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
      useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const activeItem = useMemo(
      () => activeId ? dashboardTiles.find(t => t.id === activeId) : null,
      [activeId, dashboardTiles]
  )

  // Tile size cycle: small → normal → large → small
  const cycleTileSize = (tileId: string) => {
    setDashboardTiles(prev =>
        prev.map(tile => {
          if (tile.id === tileId) {
            const next: TileSize = tile.size === "small"
                ? "normal"
                : tile.size === "normal"
                    ? "large"
                    : "small"
            return { ...tile, size: next }
          }
          return tile
        })
    )
  }

  // Drag start/end handlers
  const handleDragStart = ({ active }: DragStartEvent) => setActiveId(active.id as string)
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      setDashboardTiles(tiles => {
        const oldIndex = tiles.findIndex(t => t.id === active.id)
        const newIndex = tiles.findIndex(t => t.id === over.id)
        return arrayMove(tiles, oldIndex, newIndex)
      })
    }
    setActiveId(null)
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50 flex relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-50 to-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-50 to-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse delay-500"></div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Sidebar */}
        <div className="w-64 bg-white/40 backdrop-blur-3xl border-r border-white/80 shadow-2xl relative z-10">
          <AppSidebar />
        </div>

        {/* Main */}
        <div className="flex-1 p-8 relative z-10">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 font-medium mt-1">Welcome back! Here's what's happening with your business.</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="bg-white/70 backdrop-blur-lg border-white/90 hover:bg-white/80">
                <Calendar className="w-4 h-4 mr-2" /> Today
              </Button>
              <Button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg hover:from-violet-600 hover:to-purple-700">
                <Bell className="w-4 h-4 mr-2" /> Notifications
              </Button>
            </div>
          </div>

          {/* Tiles Grid */}
          <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
          >
            <SortableContext items={dashboardTiles.map(t => t.id)} strategy={rectSortingStrategy}>
              {/* 6-column grid for half-width small tiles */}
              <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-6 gap-6 mb-8 auto-rows-fr">
                {dashboardTiles.map(tile => (
                    <SortableTileWithResize key={tile.id} tile={tile} onResize={cycleTileSize} />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>{activeItem ? <TileOverlay tile={activeItem} /> : null}</DragOverlay>
          </DndContext>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Overview Chart */}
            <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-violet-600" />
                  Sales Overview
                </CardTitle>
                <CardDescription className="text-gray-600 font-medium">Monthly sales performance</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="h-64 bg-gradient-to-t from-violet-100/50 to-purple-100/50 rounded-lg flex items-center justify-center border border-white/30">
                  <div className="text-center">
                    <Activity className="w-12 h-12 text-violet-500 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">Chart visualization would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Status */}
            <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-purple-600" />
                  Inventory Status
                </CardTitle>
                <CardDescription className="text-gray-600 font-medium">Stock levels by category</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg border border-white/40">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Electronics</span>
                    </div>
                    <span className="text-gray-900 font-semibold">45%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg border border-white/40">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Clothing</span>
                    </div>
                    <span className="text-gray-900 font-semibold">30%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg border border-white/40">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Home & Garden</span>
                    </div>
                    <span className="text-gray-900 font-semibold">25%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-6 bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl ring-1 ring-white/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-violet-600" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-gray-600 font-medium">Latest transactions and updates</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-4">
                {[
                  {
                    action: "New order received",
                    details: "Order #12345 from John Doe",
                    time: "2 minutes ago",
                    icon: ShoppingCart,
                  },
                  {
                    action: "Stock updated",
                    details: "iPhone 15 Pro - 25 units added",
                    time: "15 minutes ago",
                    icon: Package,
                  },
                  { action: "Payment received", details: "$2,450 from ABC Corp", time: "1 hour ago", icon: CreditCard },
                  {
                    action: "Low stock alert",
                    details: "Samsung Galaxy S24 - Only 5 units left",
                    time: "2 hours ago",
                    icon: AlertTriangle,
                  },
                ].map((activity, index) => (
                    <div
                        key={index}
                        className="flex items-center space-x-4 p-3 bg-white/30 rounded-lg border border-white/40 hover:bg-white/40 transition-all duration-200"
                    >
                      <div className="p-2 bg-violet-500/20 rounded-lg">
                        <activity.icon className="w-4 h-4 text-violet-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-semibold text-sm">{activity.action}</p>
                        <p className="text-gray-600 text-xs font-medium">{activity.details}</p>
                      </div>
                      <span className="text-gray-500 text-xs font-medium">{activity.time}</span>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
