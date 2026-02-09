import React from 'react'
import SideBarMain from '@/components/ui/sidebar/SideBarMain';
import Layout from './Layout';

export default function page() {

    return (
        <div>
            <SideBarMain currentLabel="Hatchery - Receiving" fatherLabel=''>
                <Layout />
            </SideBarMain>
        </div>
    )
}
