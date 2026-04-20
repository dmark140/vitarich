import React from 'react'
import ProjectsChart from './ProjectsChart'
import { Card } from '@/components/ui/card'
import ChildFolder from '@/components/ChildFolder'
import Breadcrumb from '@/lib/Breadcrumb'

export default function Layout() {
  return (
    <div className='mt-8 '>
      <div className='mt-5'></div>
      <div className='mx-4'>
        <Breadcrumb
          CurrentPageName='Project Dashboard'
        />
      </div>
      <ProjectsChart />
      <div className='grid lg:grid-cols-3 gap-4'>
        <Card className='mt-5 mx-2 '>
          <ChildFolder id={4} />
        </Card>

        <Card className='mt-5 mx-2 '>
          <ChildFolder id={5} />
        </Card>
        <Card className='mt-5 mx-2 '>
          <div className='mx-auto w-fit items-center mt-auto mb-auto'> Some reports will be here soon</div>
        </Card>
      </div>

    </div>
  )
} 