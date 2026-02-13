
'use client'

export const dynamic = 'force-dynamic'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import Breadcrumb from '@/lib/Breadcrumb'
import {
  Plus,
  RefreshCw,
  Loader2,
  Folder,
  ChevronRight,
  ChevronDown,
  Circle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'
import { buildWarehouseTree, TreeNode } from './buildWarehouseTree'
import { getWarehouseTree } from './api'
import { useGlobalContext } from '@/lib/context/GlobalContext'

export default function WarehouseLayout() {
  const [tree, setTree] = useState<TreeNode[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    const result = await getWarehouseTree()

    if (result.success && result.data) {
      const built = buildWarehouseTree(result.data)
      setTree(built)
    } else {
      console.error(result.error)
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
    router.prefetch("/a_dean/inventory/storage")
  }, [fetchData, router])

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {}

    const expandRecursive = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (node.children.length > 0) {
          allExpanded[node.id] = true
          expandRecursive(node.children)
        }
      })
    }

    expandRecursive(tree)
    setExpanded(allExpanded)
  }

  const collapseAll = () => {
    setExpanded({})
  }

  return (
    <div className='mt-2'>
      <div className='flex justify-between mx-4'>
        <Breadcrumb
          FirstPreviewsPageName="Inventory"
          FirstPreviewsPageLink="/a_dean/inventory"
          CurrentPageName="Bin"
        />

        <div className='flex gap-2'>
          <Button variant="outline" onClick={expandAll}>
            Expand All
          </Button>

          <Button variant="outline" onClick={collapseAll}>
            Collapse All
          </Button>

          <Button
            variant={"secondary"}
            onClick={fetchData}
            disabled={isLoading}
          >
            <RefreshCw className={isLoading ? "animate-spin" : ""} />
          </Button>

          <Button
            onClick={() => router.push("/a_dean/inventory/storage")}
          >
            <Plus /> New Bin
          </Button>
        </div>
      </div>

      <Separator className='my-2' />

      <div className='mx-4 flex gap-2'>
        <Input className='w-4xs' placeholder='Search location...' />
        <Input className='w-4xs' placeholder='Search status...' />
      </div>

      <div className='mx-4 mt-4'>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
          </div>
        ) : (
          <div className="space-y-1">
            {tree.map(node => (
              <TreeItem
                key={node.id}
                node={node}
                level={0}
                expanded={expanded}
                toggleExpand={toggleExpand}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface TreeItemProps {
  node: TreeNode
  level: number
  expanded: Record<string, boolean>
  toggleExpand: (id: string) => void
}

function TreeItem({ node, level, expanded, toggleExpand }: TreeItemProps) {
  const hasChildren = node.children.length > 0
  const isOpen = expanded[node.id]
  const { setValue } = useGlobalContext();
  console.log({ node })
  return (
    <div>
      <div
        className="flex items-center gap-2 py-1 hover:bg-muted rounded px-2 cursor-pointer select-none"
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={() => {

          hasChildren && toggleExpand(node.id);
        }}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )
        ) : (
          <div className="w-4" />
        )}

        {node.isBin ? (
          <Circle size={14} className="text-muted-foreground" />
        ) : (
          <Folder size={16} className="text-muted-foreground" />
        )}

        <span className="text-sm font-medium">
          {node.name}
        </span>
      </div>

      {hasChildren && isOpen && (
        <div>
          {node.children.map(child => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}


