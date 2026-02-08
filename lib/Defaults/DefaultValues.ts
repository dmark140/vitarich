import {
  Calendar,
  Contact2,
  DockIcon,
  DollarSign,
  FileSliders,
  PenBoxIcon,
  ShoppingCartIcon,
  Wrench,
} from "lucide-react";
import { CodeNameBase } from "./DefaultTypes";
 
export const NavFolders = [
  {
    id: 0,
    title: "Administrator",
    url: "/a_dean/admin/",
    icon: FileSliders,
    items: [
      {
        group: "Modules",
        children: [
          { type: "Module", title: "User", url: "/admin/user/" },
          { type: "Module", title: "User Details / Roles & Permissions", url: "/admin/user/new/" },
        ],
      },
      // {
      //   group: "Reports",
      //   children: [
      //     {
      //       type: "Report",
      //       title: "User Management",
      //       url: "#",
      //     },
      //   ],
      // },
    ],
  },

  {
    id: 1,
    title: "Hatchery",
    url: "/a_dean/finance/",
    icon: DollarSign,
    items: [
      {
        group: "Hatchery Masters",
        children: [
        
          { type: "Module", title: "Receiving", url: "#" },
          { type: "Module", title: "Egg Process", url: "#" },
        ],
      },
      {
        group: "Reports",
        children: [
          { type: "Report", title: "Room Monitoring", url: "#" },
          { type: "Report", title: "Machine Monitoring", url: "#" },
        ],
      },
    ],
  },
]; 

const startYear = 2024;
const endYear = new Date().getFullYear() + 2;
export const ListOfYear: CodeNameBase[] = Array.from(
  { length: endYear - startYear + 1 },
  (_, i) => {
    const year = (startYear + i).toString();
    return { code: year, name: year };
  }
);
 
export const DefaultGenders = [{ code: "Male" }, { code: "Female" }];
