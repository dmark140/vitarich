import SideBarMain from '@/components/ui/sidebar/SideBarMain'
import React from 'react'
import Layout from './Layout'

export default function page() {
    return (
        <div>
            <SideBarMain currentLabel='Master and Reports' fatherLink='./' fatherLabel='Hatchery'>
                <Layout />
            </SideBarMain>

        </div>
    )
}