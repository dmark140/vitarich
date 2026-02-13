export const dynamic = 'force-dynamic'


import React from 'react'
import Layout from './Layout'
import ChildFolder from '@/components/ChildFolder'
import NavigationBar from '@/components/ui/sidebar/NavigationBar'
import Breadcrumb from '@/lib/Breadcrumb'
import { Separator } from '@/components/ui/separator'

export default function page() {
    return (
        <div>
            {/* <NavigationBar currentLabel='Administrator' fatherLink='./' fatherLabel=''> */}

            <div className='p-4'>
                <Breadcrumb
                    CurrentPageName='Administrator'
                />
            </div>
            <Separator />

            <ChildFolder id={0} />
            {/* </NavigationBar> */}

        </div>
    )
}

