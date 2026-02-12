import React from 'react'
import Layout from './Layout';
import StartUp from './StartUp';
import NavigationBar from '@/components/ui/sidebar/NavigationBar';

export default function page() {

    return (
        <div>
            {/* <NavigationBar currentLabel="Home" fatherLabel=''> */}
                {/* <Layout/> */}
                <StartUp/> 
            {/* </NavigationBar> */}
        </div>
    )
}
