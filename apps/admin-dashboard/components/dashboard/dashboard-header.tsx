import { Bell, Hexagon, Moon, Search, Sun } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function DashboardHeader({
  theme,
  onToggleTheme,
}: {
  theme: "dark" | "light"
  onToggleTheme: () => void
}) {
  return (
    <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
      <div className="flex items-center space-x-2">
        <Hexagon className="h-8 w-8 text-cyan-500" />
        <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          OMNIROUTE
        </span>
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden md:flex items-center space-x-1 bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-700/50 backdrop-blur-sm">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search routes, trucks..."
            className="bg-transparent border-none focus:outline-none text-sm w-48 placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center space-x-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-100">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-cyan-500 rounded-full animate-pulse" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleTheme}
                  className="text-slate-400 hover:text-slate-100"
                >
                  {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle theme</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="OmniRoute Operator" />
            <AvatarFallback className="bg-slate-700 text-cyan-500">OR</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
