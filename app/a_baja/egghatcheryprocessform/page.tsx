import SideBarMain from '@/components/ui/sidebar/SideBarMain'
import React from 'react'
import HatcheryProcessForm from './HatcheryProcessForm'

export default function page() {
    return (
        <div>
            <SideBarMain currentLabel='Master and Reports' fatherLink='./' fatherLabel='Hatchery'>
                <HatcheryProcessForm />
            </SideBarMain>

        </div>
    )
}