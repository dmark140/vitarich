/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { getUserPermissions } from "@/app/admin/user/new/api";
import { db } from "../Supabase/supabaseClient";
import { Button } from "@/components/ui/button";
import { CloudDownload, RefreshCcw } from "lucide-react";
export function useGlobalDefaults() {
  const { setValue } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  // ------------------------------------------------------ //

  const setUserPermissions = async (): Promise<any> => {
    try {
      const {
        data: { session },
      } = await db.auth.getSession();
      if (!session) return;
      const data = await getUserPermissions(session.user.id);
      setValue("UserPermission", data);
      console.log({ data }, "UserPermission");
      return data;
    } catch (error) {
      console.log(error, "UserPermission");
    }
  };


  const setGlobals = async (): Promise<void> => {
    setLoading(true);
    setValue("loading_g", true);

    try {
      await Promise.all([
        setUserPermissions(),
      ]);
    } catch (error) {
      console.log(error, "setGlobals");
    }
    setValue("loading_g", false);
    setLoading(false);
  };

  return {
    loading,
    setGlobals,
    setUserPermissions,
  };
}



interface collapsed {
  collapsed: boolean
}

export default function GlobalDefaults({ collapsed }: collapsed) {
  const { loading, setGlobals } = useGlobalDefaults();

  return (
    <div>
      {/* <Button onClick={setGlobals} disabled={loading}>
        {loading ? (
          <RefreshCcw className="size-4 animate-spin" />
        ) : (
          <CloudDownload className="size-4" />
        )}
      </Button> */}


      <Button
        variant="ghost"
        type="button"
        onClick={setGlobals} disabled={loading}
        // onClick={() => setOpenModal(!openModal)}
        className={`w-full gap-2 px-3 py-2 justify-start ${collapsed ? "justify-center" : ""}`}
      >
        {loading ? (
          <RefreshCcw className="size-4 animate-spin" />
        ) : (
          <CloudDownload className="size-4" />
        )}
        {!collapsed && <span>Refresh Data</span>}
      </Button>
    </div>
  );
}
