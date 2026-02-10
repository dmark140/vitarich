import SideBarMain from '@/components/ui/sidebar/SideBarMain'
import React from 'react'
import Layout from './Layout'
import ChildFolder from '@/components/ChildFolder'

export default function page() {
    return (
        <div>
            <SideBarMain currentLabel='Administrator' fatherLink='./' fatherLabel=''>
                <ChildFolder id={0} />
            </SideBarMain>

        </div>
    )
}