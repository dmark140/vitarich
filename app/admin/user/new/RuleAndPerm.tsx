"use client";

import React, { useEffect, useState } from "react";
import { PermissionCheckbox } from "./PermissionCheckbox";
import { getUserPermissions } from "./api";
import { NavFolders } from "@/lib/Defaults/DefaultValues";

interface RuleAndPermProps {
  userId: string;
}

export default function RuleAndPerm({ userId }: RuleAndPermProps) {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const loadpermissions = async () => {
    try {
      async function loadPermissions() {
        if (!userId) return;
        const data = await getUserPermissions(userId);

        const mapped: Record<string, boolean> = {};
        data.forEach((item) => {
          const key = `${item.group_name}|${item.title}`;
          mapped[key] = item.is_visible;
        });
        setPermissions(mapped);
      }

      loadPermissions();
    } catch (error) {
      console.log({ error });
    }
  }
  useEffect(() => {
    loadpermissions()
  }, [userId]);

  return (
    <div id="permissions-container">{/* 🔥 DOM target added */}
      <div className="columns-2 sm:gap-6">
        {NavFolders.filter((folder) => folder.items).map((folder, index) => (
          <div key={index} className="break-inside-avoid mb-4">
            <h2 className="text-lg font-semibold mb-2">{folder.title}</h2>
            {folder.items?.map((group, gindex) => (
              <div key={gindex} className="px-2 mb-3">
                <h3 className="font-medium mb-1">{group.group}</h3>
                {group.children.map((child, cindex) => {
                  const key = `${group.group}|${child.title}`;
                  const defaultValue = permissions[key] ?? false;
                  return (
                    <PermissionCheckbox
                      key={cindex}
                      userId={userId}
                      groupName={group.group}
                      title={child.title}
                      type={child.type}
                      url={child.url}
                      defaultValue={defaultValue}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
