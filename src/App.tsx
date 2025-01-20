import * as React from 'react';
import { 
  AiTree,
  CustomTreeReactWindow,
  CustomTreeTanstackVirtual,
  Datagrid,
  Home, 
  MuiTreeView, 
  MuiTreeViewRich,
  ReactArborist, 
  ReactAspen, 
  ReactComplexTree, 
  ReactVirtualizedTree, 
  ReactVtree, 
} from './components';
import { Routes, Route } from 'react-router';
import { Layout } from './Layout';


export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="custom-tree-react-window" element={<CustomTreeReactWindow />} />
        <Route path="custom-tree-tanstack-virtual" element={<CustomTreeTanstackVirtual />} />
        <Route path="mui" element={<MuiTreeView />} />
        <Route path="mui-rich" element={<MuiTreeViewRich />} />
        <Route path="react-complex-tree" element={<ReactComplexTree />} />
        <Route path="react-arborist" element={<ReactArborist />} />
        <Route path="react-vtree" element={<ReactVtree />} />
        <Route path="react-aspen" element={<ReactAspen />} />
        <Route path="react-virtualized-tree" element={<ReactVirtualizedTree />} />
        <Route path="ai-tree" element={<AiTree />} />
        <Route path="datagrid" element={<Datagrid />} />
      </Route>
    </Routes>
  )
}

