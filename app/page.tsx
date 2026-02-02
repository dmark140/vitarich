"use client";

import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  BarChart3, 
  Search, 
  Bell, 
  LogOut,
  PlusCircle,
  MoreHorizontal
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) return <LoginForm onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="flex min-h-screen w-full bg-muted">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 border-r bg-black text-white md:block ">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-14 items-center border-b px-6 font-semibold tracking-tight">
            <span className="text-white font-bold ">VitaRich</span>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            <SidebarItem icon={<LayoutDashboard size={18} />} label="Overview" active />
            <SidebarItem icon={<BarChart3 size={18} />} label="Reports" />
            <SidebarItem icon={<Users size={18} />} label="Customers" />
            <SidebarItem icon={<Settings size={18} />} label="Settings" />
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center justify-between border-b bg-background px-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="pl-8 bg-muted/50 border-none h-9 w-full md:w-[300px]" />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src="https://lh3.googleusercontent.com/ogw/AF2bZyiHMc0W-EDEg1soWvIjH3JNlamkVn-Of2Zfby9BSdRJaS7v=s64-c-mo" />
                  <AvatarFallback>DF</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsLoggedIn(false)} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> New Report
            </Button>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Revenue" value="45,231.89" trend="+20.1% from last month" />
                <StatCard title="Subscriptions" value="+2,350" trend="+180.1% from last month" />
                <StatCard title="Sales" value="+12,234" trend="+19% from last month" />
                <StatCard title="Active Now" value="+573" trend="+201 since last hour" />
              </div>

              <div className="grid gap-4 md:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>You made 265 sales this month.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSalesTable />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks you perform.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">Invite Team Members</Button>
                    <Button variant="outline" className="w-full justify-start">Configure Webhooks</Button>
                    <Button variant="outline" className="w-full justify-start">Download Data CSV</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

// --- Subcomponents ---

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors {active ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground'}`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function StatCard({ title, value, trend }: { title: string, value: string, trend: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{trend}</p>
      </CardContent>
    </Card>
  );
}

function RecentSalesTable() {
  const data = [
    { name: "Deanmark Famoleras", email: "fd@email.com", amount: "+1,999.00", status: "Paid" },
    { name: "Lee", email: "Lee@email.com", amount: "+39.00", status: "Pending" },
    { name: "Lyn", email: "Lyn@email.com", amount: "+299.00", status: "Paid" },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.email}>
            <TableCell>
              <div className="font-medium">{row.name}</div>
              <div className="text-xs text-muted-foreground">{row.email}</div>
            </TableCell>
            <TableCell>
              <Badge variant={row.status === "Paid" ? "default" : "secondary"}>{row.status}</Badge>
            </TableCell>
            <TableCell className="text-right font-medium">{row.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center ">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to manage your dashboard</CardDescription>
        </CardHeader>
        <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="admin@acme.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <span className="text-xs text-primary hover:underline cursor-pointer">Forgot password?</span>
              </div>
              <Input id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full text-lg h-11 mt-4" type="submit">Sign In</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}