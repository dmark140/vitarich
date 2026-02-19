export const dynamic = 'force-dynamic'


import React from 'react'
import NavigationBar from '@/components/ui/sidebar/NavigationBar';
import FarmMasterPage from './FarmMasterPage';

export default function page() {

    return (
        <div>
            <NavigationBar currentLabel="" fatherLabel=''>
                <FarmMasterPage />
            </NavigationBar>
        </div>
    )
}

 