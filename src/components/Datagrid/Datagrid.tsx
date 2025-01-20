import * as React from 'react';
import {
  DataGridPro,
  GridRenderCellParams,
  useGridApiContext,
  GridColDef,
  GridRowsProp,
  DataGridProProps,
  useGridSelector,
  gridFilteredDescendantCountLookupSelector,
} from '@mui/x-data-grid-pro';

function generateRows(count: number = 1000): GridRowsProp {
  const names = [
    'Sarah', 'Thomas', 'Robert', 'Karen', 'Michael', 'Lisa', 'David', 
    'Jennifer', 'John', 'Emily', 'James', 'Emma', 'William', 'Olivia'
  ];

  const jobTitles = [
    'CEO', 'Head of Sales', 'Sales Person', 'Manager', 'Developer',
    'Designer', 'Product Owner', 'Marketing Manager', 'HR Manager'
  ];

  const usedPaths = new Set<string>();
  const rows: GridRowsProp = [];
  let id = 0;

  while (rows.length < count) {
    const pathDepth = Math.floor(Math.random() * 3) + 1;
    const path = [];
    
    // Generate unique path
    for (let i = 0; i < pathDepth; i++) {
      const name = names[Math.floor(Math.random() * names.length)];
      const levelPrefix = `L${i + 1}`;
      path.push(`${levelPrefix}-${name}-${id}`);
    }

    const pathKey = path.join('|');
    if (!usedPaths.has(pathKey)) {
      usedPaths.add(pathKey);
      rows.push({
        id: id++,
        path: path,
        jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)]
      });
    }
  }

  return rows;
}

export function Datagrid() {
  const columns: GridColDef[] = [{ field: 'jobTitle', width: 250 }];

  // Without transformation
  // const rows: GridRowsProp = [
  //   { path: ['Sarah'], jobTitle: 'CEO', id: 0 },
  //   { path: ['Sarah', 'Thomas'], jobTitle: 'Head of Sales', id: 1 },
  //   { path: ['Sarah', 'Thomas', 'Robert'], jobTitle: 'Sales Person', id: 2 },
  //   { path: ['Sarah', 'Thomas', 'Karen'], jobTitle: 'Sales Person', id: 3 },
  // ];

  const rows: GridRowsProp = generateRows(1000);

  const getTreeDataPath: DataGridProProps['getTreeDataPath'] = (row) => row.path;

  return (
    <div style={{ height: 800, width: '100%' }}>
      <DataGridPro
        treeData
        getTreeDataPath={getTreeDataPath}
        rows={rows}
        columns={columns}
        defaultGroupingExpansionDepth={-1}
      />
    </div>
  )
  
}