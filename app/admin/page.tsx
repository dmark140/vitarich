import SideBarMain from '@/components/ui/sidebar/SideBarMain'
import React from 'react'
import Layout from './Layout'
import ChildFolder from '@/components/ChildFolder'

export default function page() {
    return (
        <div>
            <SideBarMain currentLabel='Item Master Data' fatherLink='./' fatherLabel='Inventory'>
                <ChildFolder id={0} />
            </SideBarMain>

        </div>
    )
}