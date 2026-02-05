"use client"
import SideBarMain from '@/components/ui/sidebar/SideBarMain'
import { Divide} from 'lucide-react'
import React from 'react'
import { useState } from "react";
import HatchFormModal from "./HatchFormModal";
import { createHatch } from "./api";
// import Layout from './Layout'

export default function page() {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <SideBarMain currentLabel='Hatchery Classification' fatherLink='./' fatherLabel='Hatchery'>
                {/* <Layout />  */}
             <button onClick={() => setOpen(true)}>Add Hatch</button>

                        <HatchFormModal
                            open={open}
                            onClose={() => setOpen(false)}
                            onSubmit={async (data) => {
                            await createHatch(data);
                            }}
                        /> 
            </SideBarMain>

        </div>
    )
}