import React from "react"
import { OrgStructureTree } from "../../types"

export interface OrgStructureTreeStateContextProps {
    nodes: OrgStructureTree
  }
  
  export interface OrgstructureTreeDispatchContextProps {
    mergeNodes: (nodeIds: string[], parentId: string) => void
    splitNode: (nodeId: string) => void
    renameAuditableEntity: (nodeId: string, newName: string) => void
    // allRowDeselected: () => void
    // rowSelected: () => void
  }

export const OrgStructureTreeDispatchContext = React.createContext<OrgstructureTreeDispatchContextProps | undefined>(undefined)
export const OrgStructureTreeStateContext = React.createContext<OrgStructureTreeStateContextProps | undefined>(undefined)

function orgStructureTreeReducer(state: OrgStructureTreeStateContextProps, action: Action) {
  switch (action.type) {
    case 'rowsSelected': {
      return { ...state, rowsSelectionIsActive: true }
    }
    case 'noRowsSelected': {
      return { ...state, rowsSelectionIsActive: false }
    }
    case 'setDefaultStainingType': {
      return { ...state, defaultStainingType: action.payload.stainingType }
    }
  }
}


