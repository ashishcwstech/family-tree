import type { Node, Edge } from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";


const nodeWidth = 150;
const nodeHeight = 190;
const SPOUSE_GAP = 60;
const MARRIAGE_Y_OFFSET = 0;

const elk = new ELK();


const elkOptions = {
  "elk.algorithm" : "layered",
  "elk.direction" : "DOWN",
  "elk.layered.spacing.nodeNodeBetweenLayers": "120",
  "elk.spacing.nodeNode" : "60",
  "elk.layered.nodePlacement.strategy": "SIMPLE",

   // ✅ Add these to prevent overlap
  "elk.nodePlacement.strategy": "SIMPLE",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  "elk.separateConnectedComponents": "true",
  "elk.spacing.componentComponent": "100",  
}




export const getLayoutedElements = async <T extends Record<string, unknown>>(
  nodes: Node<T>[],
  edges: Edge[]
): Promise<{ nodes: Node<T>[]; edges: Edge[] }> => {

  const marriageEdges = edges.filter((e) => e.data?.edgeType === "marriage");

  // All spouse targets excluded from ELK layout
  const spouseIds = new Set<string>();
  const primaryToSpouses = new Map<string, string[]>();
  const spouseSources = new Set<string>();

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  
  marriageEdges.forEach((e) =>{
      spouseIds.add(e.target);
      if (!primaryToSpouses.has(e.source)) primaryToSpouses.set(e.source, []);
      primaryToSpouses.get(e.source)!.push(e.target);
      const sourceNode = nodeMap.get(e.source);
      const targetNode = nodeMap.get(e.target);
      const hasNoParent = (p: any) =>  !p || (Array.isArray(p) && p.length === 0);
      if (hasNoParent(sourceNode?.data?.parentIds) && !hasNoParent(targetNode?.data?.parentIds)) {
        spouseSources.add(e.source);
      }
  })
  

  const excludeFromElk = new Set([...spouseIds, ...spouseSources]);
  const elkNodes = nodes
    .filter((node) => !excludeFromElk.has(node.id))
    .map((node) => ({
      id: node.id,
      width: nodeWidth,
      height: nodeHeight,
      properties: {
        "elk.padding": "[top=20, left=20, bottom=20, right=20]",
      },
    }));

  console.log('elknode',elkNodes);
  

  const elkEdges: { id: string; sources: string[]; targets: string[] }[] = [];
  
  nodes.forEach((node) => {
    if (excludeFromElk.has(node.id)) return;
    const parentIds = (node.data as any).parentIds;
    const parentIdList: string[] = !parentIds ? [] : Array.isArray(parentIds) ? parentIds  : [parentIds];    
    // Find the first parent that is also in ELK layout
    const primaryParentId = parentIdList.find(
      (pid) => !excludeFromElk.has(pid) && nodes.some((n) => n.id === pid)
    );

    if (primaryParentId) {
      elkEdges.push({
        id: `e-${primaryParentId}-${node.id}`,
        sources: [primaryParentId],
        targets: [node.id],
      });
    }
  });

  const graph = {
    id: "root",
    layoutOptions: elkOptions,
    children: elkNodes,
    edges: elkEdges,
  };
  const layoutedGraph = await elk.layout(graph);
  console.log('layoutdGraph',layoutedGraph);

  // Build position map from ELK output
  const positionMap = new Map<string, { x: number; y: number }>();
  layoutedGraph.children?.forEach((elkNode) => {
    const baseX = elkNode.x ?? 0;
    const baseY = elkNode.y ?? 0;
    
    //console.log('check elkNodex ',elkNode.id,elkNode.x,' elknode',elkNode.y,'elkdta',elkNode)
    positionMap.set(elkNode.id, {
      x: baseX,
      y: baseY ,
    });
  });







  primaryToSpouses.forEach((targetList, sourceId) => {
    const primaryPos = positionMap.get(sourceId);
   // console.log('source id ',sourceId,positionMap,primaryPos);
    
    if (!primaryPos) return;
    targetList.forEach((spouseId, index) => {
      console.log('spouseId',spouseId);

      positionMap.set(spouseId, {
        x: primaryPos.x + (index + 1) * (nodeWidth + SPOUSE_GAP),
        y: primaryPos.y + index * MARRIAGE_Y_OFFSET,
      });
    });
  });


  
  nodes.forEach((node)=>{
    const childId = (node.data as any).childernDetails?.id;
    if (!childId) return;
    const parentId = (node as any).id;


    const parentPos:any = positionMap.get(node.id);
    const childPos:any = positionMap.get(childId);
    if (!parentPos || !childPos) return;


    const isMale = (node.data as any).childernDetails.gender === "male";
      positionMap.set(parentId, {
          x: isMale
            ? parentPos.x - nodeWidth - 200   // right side
            : parentPos.x + nodeWidth + 400 , // left side
          y: parentPos.y,
        });
  })



  return {
    nodes: nodes.map((node) => ({
      ...node,
      position: positionMap.get(node.id) ?? node.position,
    })),
    edges,
  };
}

