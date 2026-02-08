import SideBarMain from '@/components/ui/sidebar/SideBarMain'
import React from 'react' 
import Layout from './Layout'

export default function page() {
    return (
        <div>
            <SideBarMain currentLabel='User' fatherLabel='Administrator' fatherLink='/a_dean/admin' >
                <Layout />
            </SideBarMain>
        </div>
    )
} 