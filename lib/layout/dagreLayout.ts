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
    if (spouses.length === 0) return nodeWidth;
    return nodeWidth + spouses.length * (SPOUSE_GAP + nodeWidth);
  };

  //-----------------add
  const spouseSources = new Set<string>();
  marriageEdges.forEach((e) => {
    const sourceNode = nodes.find((n) => n.id === e.source);
    const targetNode = nodes.find((n) => n.id === e.target);
    const sourceParentId = (sourceNode?.data as any)?.parentId;
    const targetParentId = (targetNode?.data as any)?.parentId;

    const sourceHasNoParent =
      !sourceParentId || 
      (Array.isArray(sourceParentId) && sourceParentId.length === 0);
    const targetHasNoParent =
      !targetParentId ||
      (Array.isArray(targetParentId) && targetParentId.length === 0);

    if (sourceHasNoParent && !targetHasNoParent) {
      spouseSources.add(e.source);
    }
  });
  const excludeFromDagre = new Set([...spouseIds, ...spouseSources]);
  console.log('spouseIds',spouseIds);
  console.log('source nodes excluded from dagre:', Array.from(spouseSources));
  console.log('Nodes excluded from dagre:', Array.from(excludeFromDagre));
  //---------------------add

  nodes.forEach((node) => {
    if (!excludeFromDagre.has(node.id)) {
      dagreGraph.setNode(node.id, {
        width: getTotalWidth(node.id), // 👈 key fix
        height: nodeHeight,
      });
    }
  });


  nodes.forEach((node) => {
      const parentId = (node.data as any).parentId;
      // ✅ Normalize to array — supports both string and string[]
      const parentIds: string[] = !parentId
          ? []
          : Array.isArray(parentId)
          ? parentId
          : [parentId];

      const primaryParentId =parentIds.find((pid) => dagreGraph.hasNode(pid)) || null;
      if (
          primaryParentId &&
          !excludeFromDagre.has(node.id) &&
          dagreGraph.hasNode(node.id)
      ) {
          dagreGraph.setEdge(primaryParentId, node.id);
      }

      // if(spouseIds.has(node.id)){
      //   console.log('node id ',node.id);
      //   const marriageId = (node.data as any).marriageId;
      //   const marriageEdge = marriageEdges.find((e) => e.id === marriageId);
      //   if(marriageEdge){
      //     // console.log('marriage edge ',marriageEdge);
      //     const primaryId = marriageEdge.source;
      //     if(dagreGraph.hasNode(primaryId)){
      //       dagreGraph.setEdge(primaryId, node.id);
      //     }
      //   }
      // }     

  });

  dagre.layout(dagreGraph);

  // ✅ Read dagre positions — dagre centers the node over its total width
  //    so pos.x is the CENTER of the (node + spouses) block
  const positionMap = new Map<string, { x: number; y: number }>();
  nodes.forEach((node) => {
    if (!excludeFromDagre.has(node.id)) {
      const pos = dagreGraph.node(node.id);
      if (pos) {
        const totalWidth = getTotalWidth(node.id);
        positionMap.set(node.id, {
          x: pos.x - totalWidth / 2,
          y: pos.y - nodeHeight / 2,
        });
      }
    }
  });

  // ✅ Place spouses to the right of their primary, chained
    // ✅ Place spouse targets to the right of their primary
  // primaryToSpouses.forEach((spouseList, primaryId) => {
  //   const primaryPos = positionMap.get(primaryId);
  //   if (!primaryPos) return;

  //   const sameRowNodes = Array.from(positionMap.entries()).filter(
  //     ([nid, pos]) => nid !== primaryId && Math.abs(pos.y - primaryPos.y) < 20
  //   );

  //   let startX = primaryPos.x + nodeWidth + SPOUSE_GAP;
  //   sameRowNodes.forEach(([, pos]) => {
  //     const nodeRight = pos.x + nodeWidth + SPOUSE_GAP;
  //     if (pos.x >= primaryPos.x && nodeRight > startX) {
  //       startX = nodeRight;
  //     }
  //   });

  //   spouseList.forEach((spouseId, index) => {
  //     positionMap.set(spouseId, {
  //       x: startX + index * (nodeWidth + SPOUSE_GAP),
  //       y: primaryPos.y,
  //     });
  //   });
  // });

  primaryToSpouses.forEach((spouseList, primaryId) => { 
    const primaryPos = positionMap.get(primaryId);
    if (!primaryPos) return;
    spouseList.forEach((spouseId, index) => {
      positionMap.set(spouseId, {
        x: primaryPos.x + (index + 1) * (nodeWidth + SPOUSE_GAP),
        y: primaryPos.y + index * MARRIAGE_Y_OFFSET  ,
      });
    });
  });

  // ✅ Place spouseSources at same Y as their marriage target
  // marriageEdges.forEach((e) => {
  //   if (spouseSources.has(e.source)) {
  //     const targetPos = positionMap.get(e.target);
  //     if (!targetPos) return;

  //     positionMap.set(e.source, {
  //       x: targetPos.x - nodeWidth - SPOUSE_GAP  ,
  //       y: targetPos.y, // 👈 same row as their spouse
  //     });
  //   }
  // });

  return {
    nodes: nodes.map((node) => ({
      ...node,
      position: positionMap.get(node.id) ?? node.position,
    })),
    edges,
  };
};