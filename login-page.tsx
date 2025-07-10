"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, Zap, TrendingUp, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function Component() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-50 to-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-50 to-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse delay-500"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-purple-50 to-violet-100 rounded-full mix-blend-multiply filter blur-2xl opacity-25 animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-violet-50 to-purple-50 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse delay-1500"></div>
      </div>

      {/* Enhanced grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
                  FinanceFlow
                </h1>
                <p className="text-gray-800 text-sm font-semibold">Next-Gen Business Solutions</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                The Future of
                <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Business Accounting
                </span>
              </h2>
              <p className="text-gray-800 text-lg leading-relaxed font-semibold">
                Streamline your financial operations with AI-powered insights, real-time analytics, and automated
                billing solutions.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-4 text-center shadow-xl hover:bg-white/80 hover:shadow-2xl transition-all duration-300 ring-1 ring-white/60">
                <TrendingUp className="w-8 h-8 text-violet-600 mx-auto mb-2" />
                <p className="text-gray-900 font-bold">AI Analytics</p>
                <p className="text-gray-700 text-xs font-semibold">Smart Insights</p>
              </div>
              <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-4 text-center shadow-xl hover:bg-white/80 hover:shadow-2xl transition-all duration-300 ring-1 ring-white/60">
                <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-gray-900 font-bold">Real-time</p>
                <p className="text-gray-700 text-xs font-semibold">Live Updates</p>
              </div>
              <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-4 text-center shadow-xl hover:bg-white/80 hover:shadow-2xl transition-all duration-300 ring-1 ring-white/60">
                <Zap className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-gray-900 font-bold">Automated</p>
                <p className="text-gray-700 text-xs font-semibold">Smart Billing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="bg-white/40 backdrop-blur-3xl border border-white/80 rounded-3xl p-8 shadow-2xl ring-2 ring-white/60 hover:bg-white/50 hover:ring-white/70 transition-all duration-300 relative overflow-hidden">
            {/* Enhanced glass effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20 rounded-3xl"></div>

            <div className="space-y-6 relative z-10">
              <div className="text-center space-y-2">
                <h3 className="text-gray-900 text-2xl font-bold">Welcome Back</h3>
                <p className="text-gray-700 font-semibold">Sign in to your account to continue</p>
              </div>

              <form className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-800 font-bold">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-white/80 backdrop-blur-lg border border-white/90 text-gray-900 placeholder:text-gray-600 focus:border-violet-500 focus:ring-violet-500/40 focus:bg-white/90 h-12 transition-all duration-200 shadow-lg ring-1 ring-white/50 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-800 font-bold">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-white/80 backdrop-blur-lg border border-white/90 text-gray-900 placeholder:text-gray-600 focus:border-violet-500 focus:ring-violet-500/40 focus:bg-white/90 h-12 transition-all duration-200 shadow-lg ring-1 ring-white/50 font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      className="border-gray-500 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
                    />
                    <Label htmlFor="remember" className="text-gray-700 text-sm cursor-pointer font-semibold">
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    className="text-violet-600 hover:text-violet-700 text-sm font-bold transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl ring-2 ring-violet-400/30"
                >
                  Sign In
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-400"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-transparent text-gray-700 font-semibold">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 bg-white/70 backdrop-blur-lg border border-white/90 text-gray-800 hover:bg-white/80 hover:border-white/95 transition-all duration-200 shadow-lg ring-1 ring-white/50 font-semibold"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 bg-white/70 backdrop-blur-lg border border-white/90 text-gray-800 hover:bg-white/80 hover:border-white/95 transition-all duration-200 shadow-lg ring-1 ring-white/50 font-semibold"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                    </svg>
                    Microsoft
                  </Button>
                </div>
              </form>

              <div className="text-center">
                <p className="text-gray-700 text-sm font-semibold">
                  {"Don't have an account? "}
                  <button className="text-violet-600 hover:text-violet-700 font-bold transition-colors">
                    Sign up for free
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Mobile branding */}
          <div className="lg:hidden mt-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
                  FinanceFlow
                </h1>
              </div>
            </div>
            <p className="text-gray-700 text-sm font-semibold">Next-Generation Business Accounting & Billing</p>
          </div>
        </div>
      </div>
    </div>
  )
}
