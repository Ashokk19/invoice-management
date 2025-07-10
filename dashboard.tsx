"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

export default function Dashboard() {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["dashboard"])
  const [dashboardTiles, setDashboardTiles] = useState([
    {
      id: "stock-value",
      title: "Total Stock Value",
      value: "$2,847,650",
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      description: "Current inventory worth",
      size: "normal", // normal, large
    },
    {
      id: "monthly-sales",
      title: "Monthly Sales",
      value: "$485,230",
      change: "+8.2%",
      changeType: "positive",
      icon: TrendingUp,
      description: "This month vs last month",
      size: "normal",
    },
    {
      id: "low-stock",
      title: "Low Stock Items",
      value: "23",
      change: "+5",
      changeType: "negative",
      icon: AlertTriangle,
      description: "Items below minimum stock",
      size: "normal",
    },
    {
      id: "active-customers",
      title: "Active Customers",
      value: "1,247",
      change: "+15.3%",
      changeType: "positive",
      icon: Users,
      description: "Customers with recent activity",
      size: "large",
    },
    {
      id: "pending-orders",
      title: "Pending Orders",
      value: "89",
      change: "-12%",
      changeType: "positive",
      icon: ClipboardList,
      description: "Orders awaiting fulfillment",
      size: "normal",
    },
    {
      id: "revenue-growth",
      title: "Revenue Growth",
      value: "24.8%",
      change: "+3.2%",
      changeType: "positive",
      icon: BarChart3,
      description: "Year over year growth",
      size: "normal",
    },
  ])

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => (prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]))
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(dashboardTiles)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setDashboardTiles(items)
  }

  const toggleTileSize = (tileId: string) => {
    setDashboardTiles((prev) =>
      prev.map((tile) => (tile.id === tileId ? { ...tile, size: tile.size === "normal" ? "large" : "normal" } : tile)),
    )
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Home/Dashboard",
      icon: Home,
      active: true,
      href: "/dashboard",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Package,
      submenu: [
        { label: "Item List", icon: ClipboardList, href: "/inventory/items" },
        { label: "Item Category", icon: Package2, href: "/inventory/categories" },
        { label: "Proactive Expiry Tracking", icon: AlertTriangle, href: "/inventory/expiry" },
        { label: "Inventory Log", icon: ScrollText, href: "/inventory/log" },
      ],
    },
    {
      id: "sales",
      label: "Sales",
      icon: ShoppingCart,
      submenu: [
        { label: "Customers List", icon: Users, href: "/sales/customers" },
        { label: "Tax Invoice", icon: FileText, href: "/sales/invoices" },
        { label: "Delivery Note", icon: Truck, href: "/sales/delivery" },
        { label: "Invoice History", icon: History, href: "/sales/history" },
        { label: "Sales Return", icon: RotateCcw, href: "/sales/returns" },
        { label: "Credits", icon: CreditCard, href: "/sales/credits" },
        { label: "Payment Log", icon: Receipt, href: "/sales/payments" },
        { label: "Shipments", icon: Ship, href: "/sales/shipments" },
      ],
    },
    {
      id: "purchase",
      label: "Purchase",
      icon: ShoppingBag,
      submenu: [
        { label: "Vendors", icon: Building2, href: "/purchase/vendors" },
        { label: "Purchase Order", icon: ClipboardList, href: "/purchase/orders" },
        { label: "Purchase Received", icon: Package, href: "/purchase/received" },
        { label: "Bills", icon: FileText, href: "/purchase/bills" },
        { label: "Payments Made", icon: CreditCard, href: "/purchase/payments" },
        { label: "Vendor Credits", icon: Receipt, href: "/purchase/credits" },
      ],
    },
  ]

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

      {/* Sidebar */}
      <div className="w-64 bg-white/40 backdrop-blur-3xl border-r border-white/80 shadow-2xl relative z-10">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
                FinanceFlow
              </h1>
              <p className="text-gray-600 text-xs font-medium">Inventory Management</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <Button
                variant="ghost"
                className={`w-full justify-start h-12 px-4 ${
                  item.active
                    ? "bg-violet-500/20 text-violet-700 font-semibold border border-violet-200/50"
                    : "text-gray-700 hover:bg-white/50 hover:text-violet-600"
                } transition-all duration-200`}
                onClick={() => item.submenu && toggleMenu(item.id)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.submenu &&
                  (expandedMenus.includes(item.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  ))}
              </Button>

              {item.submenu && expandedMenus.includes(item.id) && (
                <div className="ml-4 mt-2 space-y-1 border-l-2 border-violet-200/30 pl-4">
                  {item.submenu.map((subItem, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start h-10 px-3 text-gray-600 hover:bg-white/30 hover:text-violet-600 text-sm transition-all duration-200"
                    >
                      <subItem.icon className="w-4 h-4 mr-3" />
                      {subItem.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 font-medium mt-1">
                Welcome back! Here's what's happening with your business.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="bg-white/70 backdrop-blur-lg border-white/90 hover:bg-white/80">
                <Calendar className="w-4 h-4 mr-2" />
                Today
              </Button>
              <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </div>

        {/* Draggable Dashboard Tiles */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="dashboard-tiles">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              >
                {dashboardTiles.map((tile, index) => (
                  <Draggable key={tile.id} draggableId={tile.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${tile.size === "large" ? "md:col-span-2" : ""} ${
                          snapshot.isDragging ? "rotate-3 scale-105" : ""
                        } transition-all duration-200`}
                      >
                        <Card className="bg-white/40 backdrop-blur-3xl border border-white/80 shadow-xl hover:bg-white/50 hover:shadow-2xl transition-all duration-300 ring-1 ring-white/60 relative overflow-hidden group">
                          {/* Glass effect overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20"></div>

                          {/* Drag handle */}
                          <div
                            {...provided.dragHandleProps}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing z-20"
                          >
                            <GripVertical className="w-4 h-4 text-gray-400" />
                          </div>

                          {/* Size toggle button */}
                          <button
                            onClick={() => toggleTileSize(tile.id)}
                            className="absolute top-2 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 p-1 rounded bg-white/20 hover:bg-white/30"
                          >
                            <BarChart3 className="w-3 h-3 text-gray-600" />
                          </button>

                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-sm font-semibold text-gray-700">{tile.title}</CardTitle>
                            <div
                              className={`p-2 rounded-lg ${
                                tile.changeType === "positive" ? "bg-violet-500/20" : "bg-orange-500/20"
                              }`}
                            >
                              <tile.icon
                                className={`w-4 h-4 ${
                                  tile.changeType === "positive" ? "text-violet-600" : "text-orange-600"
                                }`}
                              />
                            </div>
                          </CardHeader>
                          <CardContent className="relative z-10">
                            <div className="text-2xl font-bold text-gray-900 mb-1">{tile.value}</div>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`text-sm font-semibold flex items-center ${
                                  tile.changeType === "positive" ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {tile.changeType === "positive" ? (
                                  <ArrowUpRight className="w-3 h-3 mr-1" />
                                ) : (
                                  <ArrowDownRight className="w-3 h-3 mr-1" />
                                )}
                                {tile.change}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-2 font-medium">{tile.description}</p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

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
