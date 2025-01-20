import React, { useState, useCallback, useMemo } from "react";
import { useVirtualizer, useWindowVirtualizer } from "@tanstack/react-virtual";
import {
  Box,
  IconButton,
  Typography,
  styled,
  useTheme,
  alpha,
} from "@mui/material";
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";

// Types
type TreeNode = {
  id: string;
  label: string;
  children?: TreeNode[];
};

type FlattenedNode = TreeNode & {
  depth: number;
  isLeaf: boolean;
  isLast: boolean;
};

// Component Props
type TreeProps = {
  data: TreeNode[];
  defaultExpanded?: boolean;
  onNodeClick?: (node: TreeNode) => void;
  sx?: any;
};

// Styled Components
const TreeContainer = styled(Box)(({ theme }) => ({
  height: "400px",
  overflow: "auto",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const NodeContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isFocused",
})<{ isFocused: boolean }>(({ theme, isFocused }) => ({
  display: "flex",
  alignItems: "center",
  height: 36,
  padding: theme.spacing(0, 1),
  cursor: "pointer",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  ...(isFocused && {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  }),
}));

// const MUIVirtualTree = ({
//   data,
//   defaultExpanded = false,
//   onNodeClick,
//   sx = {},
// }: TreeProps) => {
//   const theme = useTheme();

//   // State for expanded nodes
//   const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
//     if (!defaultExpanded) return new Set();
//     const expanded = new Set<string>();
//     const addAllNodes = (nodes: TreeNode[]) => {
//       nodes.forEach((node) => {
//         expanded.add(node.id);
//         if (node.children) addAllNodes(node.children);
//       });
//     };
//     addAllNodes(data);
//     return expanded;
//   });

//   // Track the currently focused node for keyboard navigation
//   const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);

//   // Toggle node expansion
//   const toggleNode = useCallback((nodeId: string) => {
//     setExpandedNodes((prev) => {
//       const next = new Set(prev);
//       if (next.has(nodeId)) {
//         next.delete(nodeId);
//       } else {
//         next.add(nodeId);
//       }
//       return next;
//     });
//   }, []);

//   // Flatten tree for virtualization
//   const flattenedNodes = useMemo(() => {
//     const flattened: FlattenedNode[] = [];

//     const traverse = (
//       nodes: TreeNode[],
//       depth: number,
//       parentExpanded: boolean = true
//     ) => {
//       nodes.forEach((node, index) => {
//         if (!parentExpanded) return;

//         const isLeaf = !node.children || node.children.length === 0;
//         const isLast = index === nodes.length - 1;

//         flattened.push({
//           ...node,
//           depth,
//           isLeaf,
//           isLast,
//         });

//         if (node.children && expandedNodes.has(node.id)) {
//           traverse(node.children, depth + 1, true);
//         }
//       });
//     };

//     traverse(data, 0);
//     return flattened;
//   }, [data, expandedNodes]);

//   // Virtual list configuration
//   const parentRef = React.useRef<HTMLDivElement>(null);

//   const rowVirtualizer = useVirtualizer({
//       count: flattenedNodes.length,
//       overscan: 10,
//       getScrollElement: () => parentRef.current,
//       estimateSize: useCallback(() => 36, []),
//     });

//   // Keyboard navigation handlers
//   const handleKeyDown = useCallback(
//     (e: React.KeyboardEvent, node: FlattenedNode) => {
//       switch (e.key) {
//         case "ArrowDown":
//           e.preventDefault();
//           const nextIndex =
//             flattenedNodes.findIndex((n) => n.id === node.id) + 1;
//           if (nextIndex < flattenedNodes.length) {
//             setFocusedNodeId(flattenedNodes[nextIndex].id);
//           }
//           break;
//         case "ArrowUp":
//           e.preventDefault();
//           const prevIndex =
//             flattenedNodes.findIndex((n) => n.id === node.id) - 1;
//           if (prevIndex >= 0) {
//             setFocusedNodeId(flattenedNodes[prevIndex].id);
//           }
//           break;
//         case "ArrowRight":
//           if (!node.isLeaf && !expandedNodes.has(node.id)) {
//             toggleNode(node.id);
//           }
//           break;
//         case "ArrowLeft":
//           if (!node.isLeaf && expandedNodes.has(node.id)) {
//             toggleNode(node.id);
//           }
//           break;
//         case "Enter":
//           if (onNodeClick) {
//             onNodeClick(node);
//           }
//           break;
//       }
//     },
//     [flattenedNodes, expandedNodes, toggleNode, onNodeClick]
//   );

//   return (
//     <TreeContainer ref={parentRef} sx={sx}>
//       <Box
//         sx={{
//           position: "relative",
//           height: `${rowVirtualizer.getTotalSize()}px`,
//           width: "100%",
//         }}
//       >
//         {rowVirtualizer.getVirtualItems().map((virtualRow) => {
//           const node = flattenedNodes[virtualRow.index];
//           const isExpanded = expandedNodes.has(node.id);
//           const isFocused = focusedNodeId === node.id;

//           return (
//             <Box
//               key={node.id}
//               sx={{
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 width: "100%",
//                 height: `${virtualRow.size}px`,
//                 transform: `translateY(${virtualRow.start}px)`,
//               }}
//             >
//               <NodeContainer
//                 isFocused={isFocused}
//                 sx={{ pl: node.depth * 2 + 1 }}
//                 onClick={() => {
//                   if (!node.isLeaf) toggleNode(node.id);
//                   if (onNodeClick) onNodeClick(node);
//                 }}
//                 onKeyDown={(e) => handleKeyDown(e, node)}
//                 tabIndex={0}
//               >
//                 {!node.isLeaf ? (
//                   <IconButton
//                     size="small"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleNode(node.id);
//                     }}
//                     sx={{ mr: 0.5 }}
//                   >
//                     {isExpanded ? (
//                       <ExpandMoreIcon fontSize="small" />
//                     ) : (
//                       <ChevronRightIcon fontSize="small" />
//                     )}
//                   </IconButton>
//                 ) : (
//                   <Box sx={{ width: 28 }} /> // Spacing for leaf nodes
//                 )}

//                 {node.isLeaf ? (
//                   <FileIcon
//                     fontSize="small"
//                     sx={{ mr: 1, color: theme.palette.text.secondary }}
//                   />
//                 ) : (
//                   <FolderIcon
//                     fontSize="small"
//                     sx={{ mr: 1, color: theme.palette.primary.main }}
//                   />
//                 )}

//                 <Typography variant="body2" noWrap sx={{ flex: 1 }}>
//                   {node.label}
//                 </Typography>
//               </NodeContainer>
//             </Box>
//           );
//         })}
//       </Box>
//     </TreeContainer>
//   );
// };


const MUIVirtualTree = ({
  data,
  defaultExpanded = false,
  onNodeClick,
  sx = {},
}: TreeProps) => {
  const theme = useTheme();

  // State for expanded nodes
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    if (!defaultExpanded) return new Set();
    const expanded = new Set<string>();
    const addAllNodes = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        expanded.add(node.id);
        if (node.children) addAllNodes(node.children);
      });
    };
    addAllNodes(data);
    return expanded;
  });

  // Track the currently focused node for keyboard navigation
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);

  // Toggle node expansion
  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  // Flatten tree for virtualization
  const flattenedNodes = useMemo(() => {
    const flattened: FlattenedNode[] = [];

    const traverse = (
      nodes: TreeNode[],
      depth: number,
      parentExpanded: boolean = true
    ) => {
      nodes.forEach((node, index) => {
        if (!parentExpanded) return;

        const isLeaf = !node.children || node.children.length === 0;
        const isLast = index === nodes.length - 1;

        flattened.push({
          ...node,
          depth,
          isLeaf,
          isLast,
        });

        if (node.children && expandedNodes.has(node.id)) {
          traverse(node.children, depth + 1, true);
        }
      });
    };

    traverse(data, 0);
    return flattened;
  }, [data, expandedNodes]);

  // Virtual list configuration
  // const parentRef = React.useRef<HTMLDivElement>(null);

  // const rowVirtualizer = useVirtualizer({
  //     count: flattenedNodes.length,
  //     overscan: 10,
  //     getScrollElement: () => parentRef.current,
  //     estimateSize: useCallback(() => 36, []),
  //   });
  const listRef = React.useRef<HTMLDivElement | null>(null)

  const virtualizer = useWindowVirtualizer({
    count: flattenedNodes.length,
    estimateSize: () => 35,
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  })

  // Keyboard navigation handlers
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, node: FlattenedNode) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          const nextIndex =
            flattenedNodes.findIndex((n) => n.id === node.id) + 1;
          if (nextIndex < flattenedNodes.length) {
            setFocusedNodeId(flattenedNodes[nextIndex].id);
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          const prevIndex =
            flattenedNodes.findIndex((n) => n.id === node.id) - 1;
          if (prevIndex >= 0) {
            setFocusedNodeId(flattenedNodes[prevIndex].id);
          }
          break;
        case "ArrowRight":
          if (!node.isLeaf && !expandedNodes.has(node.id)) {
            toggleNode(node.id);
          }
          break;
        case "ArrowLeft":
          if (!node.isLeaf && expandedNodes.has(node.id)) {
            toggleNode(node.id);
          }
          break;
        case "Enter":
          if (onNodeClick) {
            onNodeClick(node);
          }
          break;
      }
    },
    [flattenedNodes, expandedNodes, toggleNode, onNodeClick]
  );

  return (
    <Box ref={listRef} sx={sx}>
      <Box
        sx={{
          position: "relative",
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const node = flattenedNodes[virtualRow.index];
          const isExpanded = expandedNodes.has(node.id);
          const isFocused = focusedNodeId === node.id;

          return (
            <Box
              key={node.id}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${
                  virtualRow.start - virtualizer.options.scrollMargin
                }px)`,
              }}
            >
              <NodeContainer
                isFocused={isFocused}
                sx={{ pl: node.depth * 2 + 1 }}
                onClick={() => {
                  if (!node.isLeaf) toggleNode(node.id);
                  if (onNodeClick) onNodeClick(node);
                }}
                onKeyDown={(e) => handleKeyDown(e, node)}
                tabIndex={0}
              >
                {!node.isLeaf ? (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNode(node.id);
                    }}
                    sx={{ mr: 0.5 }}
                  >
                    {isExpanded ? (
                      <ExpandMoreIcon fontSize="small" />
                    ) : (
                      <ChevronRightIcon fontSize="small" />
                    )}
                  </IconButton>
                ) : (
                  <Box sx={{ width: 28 }} /> // Spacing for leaf nodes
                )}

                {node.isLeaf ? (
                  <FileIcon
                    fontSize="small"
                    sx={{ mr: 1, color: theme.palette.text.secondary }}
                  />
                ) : (
                  <FolderIcon
                    fontSize="small"
                    sx={{ mr: 1, color: theme.palette.primary.main }}
                  />
                )}

                <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                  {node.label}
                </Typography>
              </NodeContainer>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default MUIVirtualTree;
