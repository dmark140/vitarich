'use client'
import { NavFolders } from '@/lib/Defaults/DefaultValues';
import { Link } from 'lucide-react';
import React from 'react'

export default function Layout() {
  return (
    <div className="grid gap-8 grid-cols-1  mx-4">
      <div className='mt-4'>
        <div className="font-bold">Masters and Reports</div>
        <div className="grid grid-cols-3 ">
          {NavFolders[1].items.map((item, i) => (
            <div key={i} className="w-full">
              <div className="mt-4 font-bold">{item.group}</div>
              <div className="grid gap-1">
                {item.children.map((itemx, ii) => (
                  <div className="flex gap-1 items-center" key={ii}>
                    <a href={itemx.url}>{itemx.title}</a>
                    <a href={itemx.url} target="_blank">
                      <Link className="size-3 mt-1" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
