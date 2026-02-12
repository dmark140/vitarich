import React from 'react'
import Layout from './Layout'
import ChildFolder from '@/components/ChildFolder'
import NavigationBar from '@/components/ui/sidebar/NavigationBar'

export default function page() {
    return (
        <div>
            <NavigationBar currentLabel='Administrator' fatherLink='./' fatherLabel=''>
                <ChildFolder id={0} />
            </NavigationBar>

        </div>
    )
}