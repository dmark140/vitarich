'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import { Label } from '@/components/ui/label'

export default function page() {
  return (
    <div  className='p-4 flex  items-center  gap-2'>
      <Label >Test Label</Label>
      <Button> test</Button>
    </div>
  )
}
