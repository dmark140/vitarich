import React from 'react'
import Layout from './Layout';
import SideBarMain from '@/components/ui/sidebar/SideBarMain';

export default function page() {
   
    return (
        <div>
            <SideBarMain currentLabel="Hatchery - Receiving" fatherLabel=''>
                <Layout />
            </SideBarMain>
        </div>
    )
}
