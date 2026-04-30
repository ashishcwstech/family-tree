// lib/familyHelpers.ts
import { FamilyNode, FamilyEdge } from "@/types/family";

export function createPersonWithDefaultParents(personNode: FamilyNode): {
  nodes: FamilyNode[];
  edges: FamilyEdge[];
} {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const fatherId = `${personNode.id}-F-${unique}`;
  const motherId = `${personNode.id}-M-${unique}`;  // ❌ same unique = duplicate marriage edge key

  const father: FamilyNode = {
    id: fatherId,
    type: "custom",
    position: { x: 0, y: 0 },
    data: {
      label: "Add father",
      gender: "male",
      parentIds: [],
      childernDetails :{"id": personNode.id,"gender":personNode.data.gender},
     
      
      spouseRole: "source",
      image: "/images/plus-icon.png",
      subText: "",
      description: "",
    },
  };

  const mother: FamilyNode = {
    id: motherId,
    type: "custom",
    position: { x: 0, y: 0 },
    data: {
      label: "Add mother",
      gender: "female",
      parentIds: [],
      childernDetails :{"id": personNode.id,"gender":personNode.data.gender},
      spouseRole: "target",
     image: "/images/plus-icon.png",
      subText: "",
      description: "",
    },
  };

  // Marriage edge between father and mother
  const marriageEdge: FamilyEdge = {
    id: `${fatherId}-${motherId}`,
    source: fatherId,
    target: motherId,
    data: { edgeType: "marriage" },
    type: "marriage",
    sourceHandle: "spouse-out",
    targetHandle: "spouse-in",
    animated: true,
    markerEnd: undefined,
    style: { stroke: "#e11d48", strokeWidth: 2 },
  };



  // Update child's parentIds
  const updatedPerson: FamilyNode = {
    ...personNode,
    data: {
      ...personNode.data,
      parentIds: [fatherId, motherId],
      parentMarriageId:`${fatherId}-${motherId}`,
    },
  };
 
  return {
    nodes: [father, mother, updatedPerson],
    edges: [marriageEdge],
  };
}