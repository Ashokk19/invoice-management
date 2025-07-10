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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface AppSidebarProps {
  currentPath?: string
}

export default function AppSidebar({ currentPath = "/" }: AppSidebarProps) {
  const router = useRouter()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["dashboard", "inventory", "sales"])

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => (prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]))
  }

  const navigateTo = (href: string) => {
    if (href) {
      router.push(href)
    }
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Home/Dashboard",
      icon: Home,
      active: currentPath === "/dashboard" || currentPath === "/",
      href: "/dashboard",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Package,
      submenu: [
        {
          label: "Item List",
          icon: ClipboardList,
          href: "/inventory/items",
          active: currentPath === "/inventory/items",
        },
        {
          label: "Item Category",
          icon: Package2,
          href: "/inventory/categories",
          active: currentPath === "/inventory/categories",
        },
        {
          label: "Proactive Expiry Tracking",
          icon: AlertTriangle,
          href: "/inventory/expiry",
          active: currentPath === "/inventory/expiry",
        },
        { label: "Inventory Log", icon: ScrollText, href: "/inventory/log", active: currentPath === "/inventory/log" },
      ],
    },
    {
      id: "sales",
      label: "Sales",
      icon: ShoppingCart,
      submenu: [
        { label: "Customers List", icon: Users, href: "/sales/customers", active: currentPath === "/sales/customers" },
        { label: "Tax Invoice", icon: FileText, href: "/sales/invoices", active: currentPath === "/sales/invoices" },
        { label: "Delivery Note", icon: Truck, href: "/sales/delivery", active: currentPath === "/sales/delivery" },
        { label: "Invoice History", icon: History, href: "/sales/history", active: currentPath === "/sales/history" },
        { label: "Sales Return", icon: RotateCcw, href: "/sales/returns", active: currentPath === "/sales/returns" },
        { label: "Credits", icon: CreditCard, href: "/sales/credits", active: currentPath === "/sales/credits" },
        { label: "Payment Log", icon: Receipt, href: "/sales/payments", active: currentPath === "/sales/payments" },
        { label: "Shipments", icon: Ship, href: "/sales/shipments", active: currentPath === "/sales/shipments" },
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
              onClick={() => {
                if (item.submenu) {
                  toggleMenu(item.id)
                } else {
                  navigateTo(item.href)
                }
              }}
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
                    className={`w-full justify-start h-10 px-3 text-sm transition-all duration-200 ${
                      subItem.active
                        ? "bg-violet-400/20 text-violet-700 font-semibold"
                        : "text-gray-600 hover:bg-white/30 hover:text-violet-600"
                    }`}
                    onClick={() => navigateTo(subItem.href)}
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
  )
}
