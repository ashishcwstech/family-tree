import type { Node, Edge } from "@xyflow/react";
import dagre from "dagre";

const nodeWidth = 150;
const nodeHeight = 190;
const SPOUSE_GAP = 40;
const SIBLING_GAP = 80;
const MARRIAGE_Y_OFFSET = 0; 

export const getLayoutedElements = <T extends Record<string, unknown>>(
  nodes: Node<T>[],
  edges: Edge[]
): { nodes: Node<T>[]; edges: Edge[] } => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB", nodesep: SIBLING_GAP, ranksep: 120 });

  const marriageEdges = edges.filter((e) => e.data?.edgeType === "marriage");

  // ✅ All spouse targets excluded from dagre
  const spouseIds = new Set<string>();
  marriageEdges.forEach((e) => spouseIds.add(e.target));

  // ✅ primaryToSpouses: Map<primaryId, spouseId[]>
  const primaryToSpouses = new Map<string, string[]>();
  marriageEdges.forEach((e) => {
    if (!primaryToSpouses.has(e.source)) primaryToSpouses.set(e.source, []);
    primaryToSpouses.get(e.source)!.push(e.target);
  });

  // ✅ Total width of a node + all its spouses (used as dagre node width)
  const getTotalWidth = (id: string): number => {
    const spouses = primaryToSpouses.get(id) ?? [];
    return nodeWidth + spouses.length * (SPOUSE_GAP + nodeWidth);
  };

  // ✅ Register only primary nodes in dagre, with their TOTAL width
  //    so dagre spaces children correctly under the couple unit
  nodes.forEach((node) => {
    if (!spouseIds.has(node.id)) {
      dagreGraph.setNode(node.id, {
        width: getTotalWidth(node.id), // 👈 key fix
        height: nodeHeight,
      });
    }
  });

    // ✅ Only add parent→child edges (derived from parentId in node data)
    //    Skip spouse targets as sources/targets
    nodes.forEach((node) => {
        const parentId = (node.data as any).parentId;
        
        // ✅ Normalize to array — supports both string and string[]
        const parentIds: string[] = !parentId
            ? []
            : Array.isArray(parentId)
            ? parentId
            : [parentId];

        // ✅ Use first non-spouse parent for dagre ranking
        const primaryParentId = parentIds.find(
            (pid) => !spouseIds.has(pid) && dagreGraph.hasNode(pid)
        );

        if (
            primaryParentId &&
            !spouseIds.has(node.id) &&
            dagreGraph.hasNode(node.id)
        ) {
            dagreGraph.setEdge(primaryParentId, node.id);
        }
    });

  dagre.layout(dagreGraph);

  // ✅ Read dagre positions — dagre centers the node over its total width
  //    so pos.x is the CENTER of the (node + spouses) block
  const positionMap = new Map<string, { x: number; y: number }>();
  nodes.forEach((node) => {
    if (!spouseIds.has(node.id)) {
      const pos = dagreGraph.node(node.id);
      if (pos) {
        const totalWidth = getTotalWidth(node.id);
        // ✅ Align the PRIMARY node to the LEFT of the couple block
        //    dagre gives us the CENTER of the block, so subtract half total width
        positionMap.set(node.id, {
          x: pos.x - totalWidth / 2,
          y: pos.y - nodeHeight / 2,
        });
      }
    }
  });

  // ✅ Place spouses to the right of their primary, chained
  primaryToSpouses.forEach((spouseList, primaryId) => {
    const primaryPos = positionMap.get(primaryId);
    if (!primaryPos) return;

    spouseList.forEach((spouseId, index) => {
      positionMap.set(spouseId, {
        x: primaryPos.x + (index + 1) * (nodeWidth + SPOUSE_GAP),
        y: primaryPos.y + index * MARRIAGE_Y_OFFSET,
      });
    });
  });

  return {
    nodes: nodes.map((node) => ({
      ...node,
      position: positionMap.get(node.id) ?? node.position,
    })),
    edges,
  };
};