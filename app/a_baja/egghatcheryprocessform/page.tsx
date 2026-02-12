export const dynamic = 'force-dynamic'


import NavigationBar from '@/components/ui/sidebar/NavigationBar'
import React from 'react'
import HatcheryProcessForm from './HatcheryProcessForm'

export default function page() {
    return (
        <div>
            <NavigationBar currentLabel='Egg Hatchery Process' fatherLink='./' fatherLabel='Hatchery'>
                <HatcheryProcessForm />
            </NavigationBar>

        </div>
    )
}

