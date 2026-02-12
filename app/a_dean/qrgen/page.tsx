export const dynamic = 'force-dynamic'


// 'use client'
import React from 'react'
import Layout from './Layout';
import NavigationBar from '@/components/ui/sidebar/NavigationBar';

export default async function page() {
//    await new Promise((resolve) => setTimeout(resolve, 3000));
    return (
        <div>
            <NavigationBar currentLabel="Hatchery - Receiving" fatherLabel=''>
                {/* <Layout /> */}
                x
            </NavigationBar>
        </div>
    )
}


