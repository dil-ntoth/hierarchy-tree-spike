import { Link } from 'react-router';

export function Home() {
  return (
    <ul>
      <li><Link to='/custom-tree-react-window'>Custom TreeView w/ React-window virtualization</Link></li>
      <li><Link to='/custom-tree-tanstack-virtual'>Custom TreeView w/ Tanstack-virtual virtualization</Link></li>
      <li><Link to='/mui'>MUI SimpleTreeView</Link></li>
      <li><Link to='/mui-rich'>MUI RichTreeView</Link></li>
      <li><Link to='/react-complex-tree'>React complex tree</Link></li>
      <li><Link to='/react-arborist'>React arborist</Link></li>
      <li><Link to='/react-vtree'>React VTree</Link></li>
      <li><Link to='/react-aspen'>React Aspen</Link></li>
      <li><Link to='/react-virtualized-tree'>React virtualized tree</Link></li>
    </ul>
  )
}
