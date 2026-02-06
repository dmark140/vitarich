"use client";

import React, { useState } from 'react';
import SideBarMain from '@/components/ui/sidebar/SideBarMain'
import Layout from './Layout'

export default function Page() {
    const [open, setOpen] = useState(false);

    const handleSubmit = (data: any) => {
        console.log('Egg storage submitted:', data);
        setOpen(false);
    };

    return (
        <div>
            <SideBarMain currentLabel='Egg Storage Management' fatherLink='./' fatherLabel='Hatchery'>
                <div className="py-4">
                    <button onClick={() => setOpen(true)}>New Egg Storage</button>
                    <Layout open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
                </div>
            </SideBarMain>
        </div>
    );
}