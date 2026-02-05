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
          { type: "Module", title: "Branch", url: "/a_dean/branch/" },
          {
            type: "Module",
            title: "Document Numbering",
            url: "/a_dean/docnum/",
          },
          { type: "Module", title: "User", url: "/a_dean/user/" },
        ],
      },
      {
        group: "Reports",
        children: [
          {
            type: "Report",
            title: "User Management",
            url: "#",
          },
        ],
      },
    ],
  },

  {
    id: 1,
    title: "Accounting",
    url: "/a_dean/finance/",
    icon: DollarSign,
    items: [
      {
        group: "Accounting Masters",
        children: [
          {
            type: "Module",
            title: "Chart Of Account",
            url: "/a_dean/finance/coa",
          },
          { type: "Module", title: "Account Mapping", url: "/a_dean/finance/coaMap" },
          { type: "Module", title: "Trial Balance", url: "#" },
        ],
      },
      {
        group: "Accounting Transactions",
        children: [
          { type: "Module", title: "AP Invoice", url: "#" },
          { type: "Module", title: "AR Invoice", url: "#" },
          { type: "Module", title: "Journal Entry", url: "/a_dean/finance/je" },
        ],
      },
      {
        group: "Reports",
        children: [
          { type: "Report", title: "Trial Balance", url: "#" },
          { type: "Report", title: "Balance Sheet", url: "#" },
          { type: "Report", title: "General Ledger", url: "#" },
          { type: "Report", title: "Customer Ledger Summary", url: "#" },
          { type: "Report", title: "Supplier Ledger Summary", url: "#" },
        ],
      },
    ],
  },

  {
    id: 2,
    title: "Inventory",
    url: "/a_dean/itms",
    icon: ShoppingCartIcon,
    items: [
      {
        group: "Modules",
        children: [
          {
            type: "Module",
            title: "Item Master Data",
            url: "/a_baja/itemmasterdata/",
          },
          { type: "Module", title: "Item Group", url: "/a_dean/itmgrp/" },
          { type: "Module", title: "Item Category", url: "/a_dean/itmcatg/" },
          { type: "Module", title: "OuM", url: "/a_dean/itms/uom/" },
          { type: "Module", title: "OuM Group", url: "/a_dean/itms/uomg/" },
          { type: "Module", title: "Packages", url: "/a_dean/itms/pckg/" },
        ],
      },
      {
        group: "Inventory Transactions",
        children: [
          { type: "Module", title: "Inventory Transfer Request", url: "#" },
          { type: "Module", title: "Inventory Transfer", url: "#" },
          { type: "Module", title: "Delivery", url: "#" },
        ],
      },
      {
        group: "Inventory Reports",
        children: [
          { type: "Report", title: "Batch", url: "#" },
          { type: "Report", title: "Inventory Transfer", url: "#" },
          { type: "Report", title: "Delivery", url: "#" },
        ],
      },
    ],
  },

  {
    id: 3, title: "CRM", url: "/a_jeth/crm/", icon: Contact2, items: [
      {
        group: "Modules",
        children: [
          { type: "Module", title: "Business Partner Master Data", url: "/a_jeth/business_partner" },
          { type: "Module", title: "Price List", url: "/a_jeth/price_list" },
        ],
      },
    ],
  },
  { id: 4, title: "Schedule", url: "#", icon: Calendar },
  { id: 5, title: "Sales Quotation", url: "#", icon: DockIcon },
  { id: 6, title: "Service Call", url: "#", icon: Wrench },
  {
    id: 7, title: "Order-to-Cash", url: "/a_dean/oca", icon: PenBoxIcon,
    items: [
      {
        group: "Modules",
        children: [
          { type: "Module", title: "Sales Quotation", url: "/a_dean/sq" },
          { type: "Module", title: "Job Order", url: "#" },
          { type: "Module", title: "Cashiering", url: "#" },
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
