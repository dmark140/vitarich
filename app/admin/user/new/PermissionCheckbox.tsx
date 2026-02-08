"use client";

import React, { useState, useEffect } from "react";
import { toggleUserPermission } from "./api";

interface PermissionCheckboxProps {
  groupName: string;
  title: string;
  type: string;
  userId: string;
  defaultValue?: boolean;
  url?: string;
}

export const PermissionCheckbox: React.FC<PermissionCheckboxProps> = ({
  groupName,
  title,
  type,
  userId,
  defaultValue = false,
  url,
}) => {
  const [checked, setChecked] = useState(defaultValue);

  useEffect(() => {
    setChecked(defaultValue);
  }, [defaultValue]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);

    await toggleUserPermission(userId, groupName, title, newChecked, url);
  };

  return (
    <div className="flex items-center gap-2 mb-1">
      <input
        type="checkbox"
        id={`${groupName}-${title}`}
        className="permission-checkbox"   // 🔥 added for DOM targeting
        checked={checked}
        onChange={handleChange}
      />
      <label htmlFor={`${groupName}-${title}`}>
        {title} ({type})
      </label>
    </div>
  );
};
