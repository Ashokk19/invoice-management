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
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["dashboard", "inventory", "sales", "purchase"])

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
        {
          label: "Inventory Log",
          icon: ScrollText,
          href: "/inventory/log",
          active: currentPath === "/inventory/log"
        },
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
        { label: "Vendors", icon: Building2, href: "/purchase/vendors", active: currentPath === "/purchase/vendors" },
        { label: "Purchase Order", icon: ClipboardList, href: "/purchase/orders", active: currentPath === "/purchase/orders" },
        { label: "Purchase Received", icon: Package, href: "/purchase/received", active: currentPath === "/purchase/received" },
        { label: "Bills", icon: FileText, href: "/purchase/bills", active: currentPath === "/purchase/bills" },
        { label: "Payments Made", icon: CreditCard, href: "/purchase/payments", active: currentPath === "/purchase/payments" },
        { label: "Vendor Credits", icon: Receipt, href: "/purchase/credits", active: currentPath === "/purchase/credits" },
      ],
    },
  ]

  return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FinanceFlow</h1>
              <p className="text-sm text-gray-600 font-medium">Inventory Management</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => (
              <div key={item.id}>
                {item.submenu ? (
                    <div>
                      <Button
                          variant="ghost"
                          onClick={() => toggleMenu(item.id)}
                          className="w-full justify-between p-3 h-auto text-left bg-transparent hover:bg-white/20 text-gray-700 hover:text-gray-900 font-medium"
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5" />
                          <span className="text-sm">{item.label}</span>
                        </div>
                        {expandedMenus.includes(item.id) ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                      {expandedMenus.includes(item.id) && (
                          <div className="ml-4 mt-2 space-y-1 border-l-2 border-white/20 pl-4">
                            {item.submenu.map((subItem) => (
                                <Button
                                    key={subItem.href}
                                    variant="ghost"
                                    onClick={() => navigateTo(subItem.href)}
                                    className={`w-full justify-start p-2 h-auto text-left text-sm font-normal ${
                                        subItem.active
                                            ? "bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-700 border border-violet-200/50"
                                            : "bg-transparent hover:bg-white/10 text-gray-600 hover:text-gray-800"
                                    }`}
                                >
                                  <div className="flex items-center space-x-2">
                                    <subItem.icon className="w-4 h-4" />
                                    <span className="text-xs leading-relaxed">{subItem.label}</span>
                                  </div>
                                </Button>
                            ))}
                          </div>
                      )}
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        onClick={() => navigateTo(item.href)}
                        className={`w-full justify-start p-3 h-auto text-left ${
                            item.active
                                ? "bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-700 border border-violet-200/50"
                                : "bg-transparent hover:bg-white/20 text-gray-700 hover:text-gray-900"
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                    </Button>
                )}
              </div>
          ))}
        </div>
      </div>
  )
}
