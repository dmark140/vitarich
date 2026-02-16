export const dynamic = 'force-dynamic'


import React from 'react'
import Layout from './Layout';
import StartUp from './StartUp';
import NavigationBar from '@/components/ui/sidebar/NavigationBar';
import StockDashboard from './StartUp';

export default function page() {

    return (
        <div>
            <NavigationBar currentLabel="" fatherLabel=''>
                {/* <Layout/> */}
                <StockDashboard/> 
            </NavigationBar>
        </div>
    )
}


