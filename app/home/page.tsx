import React from 'react'
import Layout from './Layout';
import StartUp from './StartUp';
import SideBarMain from '@/components/ui/sidebar/SideBarMain';

export default function page() {

    return (
        <div>
            <SideBarMain currentLabel="Home" fatherLabel=''>
                {/* <Layout/> */}
                <StartUp/>
            </SideBarMain>
        </div>
    )
}
