import * as React from 'react';
import { MuiTreeView, Home, ReactComplexTree, ReactArborist, ReactVtree, ReactAspen, ReactVirtualizedTree } from './components';
import { Routes, Route } from 'react-router';
import { Layout } from './Layout';


export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="mui" element={<MuiTreeView />} />
        <Route path="react-complex-tree" element={<ReactComplexTree />} />
        <Route path="react-arborist" element={<ReactArborist />} />
        <Route path="react-vtree" element={<ReactVtree />} />
        <Route path="react-aspen" element={<ReactAspen />} />
        <Route path="react-virtualized-tree" element={<ReactVirtualizedTree />} />
      </Route>
    </Routes>
  )
}

