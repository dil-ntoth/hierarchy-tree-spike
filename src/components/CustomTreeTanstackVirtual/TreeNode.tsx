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
    auditableEntityName?: string;
    type: 'process' | 'orgUnit';
    coveredByParent: boolean;
    isMerged: boolean;
    isDisabled: boolean;
}