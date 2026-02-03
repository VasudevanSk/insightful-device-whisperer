import { Activity, Settings, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">DeviceIQ</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Mobile Analytics Platform</p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users, segments, metrics..."
              className="pl-10 bg-secondary/50 border-border focus:bg-secondary"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-segment-heavy rounded-full" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-medium text-primary-foreground ml-2">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
