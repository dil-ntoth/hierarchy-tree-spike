export interface OrgStructureTree {
  id: string;
  label: string;
  auditableEntityName?: string;
  children?: OrgStructureTree[];
  type: 'process' | 'orgUnit';
  coveredByParent: boolean;
  isMerged: boolean;
  isDisabled: boolean;
}
