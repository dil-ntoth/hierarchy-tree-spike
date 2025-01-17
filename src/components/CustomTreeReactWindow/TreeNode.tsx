import { ReactNode } from "react";

export interface TreeNode {
    id: string;
    parentId: string | null;
    icon?: ReactNode | undefined
    label: string;
    depth: number;
    collapsed?: boolean;
    isCollapsable?: boolean;
    isLeaf?: boolean;
    isSelected?: boolean;
    isContextMenu?: boolean;
}