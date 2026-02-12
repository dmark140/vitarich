"use client";
import NavigationBar from '@/components/ui/sidebar/NavigationBar'
import React, { useState } from 'react'  
import EggSettingForm from './SetterIncubation' 
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button'; 


export default function Page() {
  const [open, setOpen] = useState(true)

      return (
        <NavigationBar
          currentLabel="Egg Setter"
          fatherLink="./"
          fatherLabel="Hatchery"
        >
          <EggSettingForm
            open={open}
            onClose={() => setOpen(false)}
          />
        </NavigationBar>
      )

}