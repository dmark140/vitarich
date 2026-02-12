"use client";
import NavigationBar from '@/components/ui/sidebar/NavigationBar'
import React, { useState } from 'react'  
import Layout from './Layout' 
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button'; 
export default function page() {
    const [open, setOpen] = useState(false)

 

    return (
        <div>
            <NavigationBar currentLabel='Egg Storage Management' fatherLink='./' fatherLabel='Hatchery'>
                 {/* <div className="flex items-center gap-2 mt-4">
                <button onClick={() =>} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">
                    Add New Egg Storage
                </button>

                 </div> */}

        <div className="mb-4 flex justify-between">
          <div></div>
          <div className="flex items-center gap-2 mt-4">
 
            <Button
              type="button"
              className="mr-4 flex items-center"
              onClick={() => {
                 setOpen(true)
              }}
            >
              <Plus className="size-4" /> Add New Egg Storage
            </Button>
          </div>
        </div>
        
        <Layout open={open} onClose={() => setOpen(false)} onSubmit={() => setOpen(false)} />
            


        </NavigationBar>
        </div>
    );
}