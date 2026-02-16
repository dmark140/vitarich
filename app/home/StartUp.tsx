// 'use client'
// import React, { useEffect } from 'react';
// import { Sparkles, PenLine, GraduationCap, Sun, EggFried } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useRouter } from 'next/navigation';
// export default function StartUp() {
//     const route = useRouter()

//     const buttons = [
//         { enabled: false, label: 'Dashboard', link: '#', icon: <Sparkles size={18} className="text-orange-500 dark:text-orange-400" /> },
//         { enabled: true, label: 'Hatchiry', link: '/a_dean/hatchery', icon: <EggFried size={18} /> },
//     ];



//     useEffect(() => {
//         route.prefetch('/a_dean/hatchery')

//     }, [])


//     return (
//         <div className="flex flex-col items-start justify-center    p-8 mr-4  transition-colors duration-300">
//             <div className="max-w-2xl w-full space-y-8">

//                 {/* Header Section */}
//                 <header className="space-y-2">
//                     <p className="text-xl font-medium ">
//                         Hi There!
//                     </p>
//                     <h1 className="text-4xl  font-semibold tracking-tight">
//                         Where should we start?
//                     </h1>
//                 </header>

//                 {/* Buttons Section */}
//                 <div className="flex flex-col items-start space-y-3">
//                     {buttons.map((btn, index) => (
//                         <Button
//                             disabled={!btn.enabled}

//                             onClick={() => {
//                                 route.push(btn.link)
//                             }}
//                             key={index}
//                             className={`flex items-center gap-3 px-6 py-3  h-10 rounded-full transition-all duration-200`}
//                         >
//                             <span>{btn.icon}</span>
//                             <span className="text-lg font-medium group-hover:dark:text-white">
//                                 {btn.label}
//                             </span>
//                         </Button>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };



'use client'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Filter, MoreHorizontal } from 'lucide-react'
import Breadcrumb from '@/lib/Breadcrumb'

export default function StockDashboard() {
    return (
        <main className="min-h-screen p-6 space-y-6">
            {/* <div className="text-sm text-muted-foreground">
        Dashboard / Stock
      </div> */}
            <Breadcrumb
                FirstPreviewsPageName='Home'
                CurrentPageName='Dashboard'
            />

            <div className='bg-white p-4  rounded-2xl gap-4  space-y-4'>
                <div className="grid gap-4 md:grid-cols-3 ">
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">
                                Total Active Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">28</CardContent>
                    </Card>

                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">
                                Total Warehouses
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">9</CardContent>
                    </Card>

                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">
                                Total Stock Value
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">
                            0.000
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Warehouse wise Stock Value</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Last synced just now
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="h-[260px] flex items-center justify-center text-muted-foreground">
                        No Data
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="bg-white">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Purchase Receipt Trends</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Last synced
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                    Last Year
                                </Button>
                                <Button variant="outline" size="sm">
                                    Monthly
                                </Button>
                                <Button variant="outline" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>

                        <Separator />

                        <CardContent className="h-[260px] flex items-center justify-center text-muted-foreground">
                            No Data
                        </CardContent>
                    </Card>

                    <Card className="bg-white">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Delivery Trends</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Last synced
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                    Last Year
                                </Button>
                                <Button variant="outline" size="sm">
                                    Monthly
                                </Button>
                                <Button variant="outline" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>

                        <Separator />

                        <CardContent className="h-[260px] flex items-center justify-center text-muted-foreground">
                            No Data
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}

