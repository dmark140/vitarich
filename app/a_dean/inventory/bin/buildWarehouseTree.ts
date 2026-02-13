export interface TreeNode {
  id: string
  name: string
  isBin: boolean
  children: TreeNode[]
}

export function buildWarehouseTree(rows: any[]) {
  const warehouseMap = new Map<number, TreeNode>()
  const locationMap = new Map<number, TreeNode>()

  rows.forEach(row => {
    // 1️⃣ Create warehouse root node if not exists
    if (!warehouseMap.has(row.warehouse_id)) {
      warehouseMap.set(row.warehouse_id, {
        id: `wh-${row.warehouse_id}`,
        name: `${row.whse_name} - ${row.whse_code}`,
        isBin: false,
        children: []
      })
    }

    // 2️⃣ Create storage location node
    if (row.location_id) {
      locationMap.set(row.location_id, {
        id: `loc-${row.location_id}`,
        name: row.location_name,
        isBin: row.is_lowest_level,
        children: []
      })
    }
  })

  // 3️⃣ Build hierarchy
  rows.forEach(row => {
    if (!row.location_id) return

    const node = locationMap.get(row.location_id)
    const warehouseNode = warehouseMap.get(row.warehouse_id)

    if (row.parent_id) {
      const parent = locationMap.get(row.parent_id)
      parent?.children.push(node!)
    } else {
      warehouseNode?.children.push(node!)
    }
  })

  return Array.from(warehouseMap.values())
}
