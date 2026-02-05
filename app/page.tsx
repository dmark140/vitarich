import { LoginForm } from '@/lib/Login/loginform'
import React from 'react'

export default function page() {
  return (
    <div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-end">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="  text-primary-foreground flex size-6 items-center justify-center rounded-md">
             
            </div>
            Vitarich
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
