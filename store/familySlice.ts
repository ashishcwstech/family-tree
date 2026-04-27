import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FamilyNode, FamilyEdge } from "@/types/family";

interface FamilyState {
  nodes: FamilyNode[];
  edges: FamilyEdge[];
}

export const initialNodes: FamilyNode[] = [
  {
    id: "n1",
    type: "custom",
    position: { x: 0, y: 0 },
    data: {
      parentId: [],
      label: "Arthur Bennet",
      subText: "Age 50",
      spouseRole: "source",
      gender: "male",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_meMGNgj16qXcpczlqvX1QZ_GribvGo9y_0KHUvvymg3UR0R14quWRIaWhDYRpBwRUB317wZ8Xv2mmnyAsedAnV4VNcrypb8K4i-9Pf4PULtgYcvsxcMXQpUz33_7WwW1UB6opfp7VFKy-FQnCUuMDBmtCxkRPTcyAEPZCoIc-JYLg7TONnv_o7q8hHl6MNrc2nkrbLwvjVTpWFW8V5gxV1HSROiHXfhzjF7IdhzArlloQ-TV8DjHn9l40Vr3MK2vYqlzf4uKsXc",
      description: "John Sterling, 50...",
    },
  },
  {
    id: "n4",
    type: "custom",
    position: { x: 0, y: 0 },
    data: {
      parentId: [],
      label: "Jane Bennet",
      subText: "Age 45",
      gender: "female",
      spouseRole: "target",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAs9I2lNfHWLLiC9j7ek5bpdK4r3WcWZmRSyno5Pyt87sNaPWdNpja53xs5E2odAgFibCgxC5LrnKIOgPG6NKo-BN0COC-58IqZnsk7RbVK6FiN4hrBGkkhKo5C7gKVSm1L0dcqChX1j0t-h8QHAH3knAYhYfO5RTVxB2juqfv7fEYZ0P3oPM86tp7cAITBurwZLYFAFpR31-bUdsrF51EG-KtCX6ABioZ9ydKkLz2rX37lnAkooRUvLwDrVGXJkS289ZVRZWEcEJ4",
      description: "Eleanor Bennett, 45...",
    },
  },
  // {
  //   id: "n2",
  //   type: "custom",
  //   position: { x: 0, y: 0 },
  //   data: {
  //     parentId: ["n1", "n4"],
  //     marriageId: "n1-n4",
  //     label: "Robert Bennett",
  //     gender: "male",
  //     subText: "Age 20",
  //     spouseRole: "source",
  //     image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ6DiDj2VmdfEiRBb_wbsTuqtZwW5FFTo2yonjFngnaeCToAbTK6q4UbEDQy49nHDNt8W9B40v0wZmk8OG4IbkOyL98l3-MdYyfR7YH-zrOpHzX4V4zHHEl9NPp41884klGTVtngzWochPpiI5dGaS4Qjks2Cbpa49EmO0oBGphqzVhtKl_zXi8nWaT5W8bsy8pmYtTZlTciKbRQ2PACv1vWsrEOUalNsVAq--LEpUqMhvQ7B9_djYS8t8hhhsijNLVKXrB8UyC0E",
  //     description: "Michael Sterling, 20...",
  //   },
  // },
  // {
  //   id: "n3",
  //   type: "custom",
  //   position: { x: 0, y: 0 },
  //   data: {
  //     parentId: ["n1","n4"],
  //     marriageId: "n1-n4",
  //     gender: "female",
  //     label: "Sarah Bennett",
  //     subText: "Age 18",
  //     image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtDmqyRQletzG2qM4s5WFXTWo1nTVpzlClPfguWjEt82YYBcQW9sSBlfAaSvBqjzOWHkOYbPLHFMF8M7F9B0H_TyM4awqkqHNb30CiQGXaFgwTPTHFlvxKMkMQHPKv32uBN07MQ1YsGIyE73ZHarM89FNZ7eEYrrgIy0CAfWAQ1IQQJDty9uy-Ti0O6C7DrxddA847CCCabERekcw-mbrrUq4RNkjY9XBrAjpAOicyUe8bAgy5GaHSmFq5k0Br5U2mGhHHkpNOoic",
  //     description: "Emily Sterling, 18...",
  //   },
  // },
  // {
  //   id: "n5",
  //   type: "custom",
  //   position: { x: 0, y: 0 },
  //   data: {
  //     parentId: null,
  //     gender: "female",
  //     label: "Clara Bennett",
  //     subText: "1971",
  //     spouseRole: "target",
  //     image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAs9I2lNfHWLLiC9j7ek5bpdK4r3WcWZmRSyno5Pyt87sNaPWdNpja53xs5E2odAgFibCgxC5LrnKIOgPG6NKo-BN0COC-58IqZnsk7RbVK6FiN4hrBGkkhKo5C7gKVSm1L0dcqChX1j0t-h8QHAH3knAYhYfO5RTVxB2juqfv7fEYZ0P3oPM86tp7cAITBurwZLYFAFpR31-bUdsrF51EG-KtCX6ABioZ9ydKkLz2rX37lnAkooRUvLwDrVGXJkS289ZVRZWEcEJ4",
  //     description: "Clara Bennett...",
  //   },
  // },
  // {
  //   id: "n6",
  //   type: "custom",
  //   position: { x: 0, y: 0 },
  //   data: {
  //     parentId: null,
  //     label: "Clara Bennett 6",
  //     subText: "1971",
  //     gender: "female",
  //     spouseRole: "target",
  //     image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAs9I2lNfHWLLiC9j7ek5bpdK4r3WcWZmRSyno5Pyt87sNaPWdNpja53xs5E2odAgFibCgxC5LrnKIOgPG6NKo-BN0COC-58IqZnsk7RbVK6FiN4hrBGkkhKo5C7gKVSm1L0dcqChX1j0t-h8QHAH3knAYhYfO5RTVxB2juqfv7fEYZ0P3oPM86tp7cAITBurwZLYFAFpR31-bUdsrF51EG-KtCX6ABioZ9ydKkLz2rX37lnAkooRUvLwDrVGXJkS289ZVRZWEcEJ4",
  //     description: "Clara Bennett...",
  //   },
  // },
  // {
  //   id: "n7",
  //   type: "custom",
  //   position: { x: 0, y: 0 },
  //   data: {
  //     parentId: ["n2", "n6"],
  //     marriageId: "n2-n6",
  //     gender: "male",
  //     label: "David Bennett",
  //     subText: "1965",
  //     spouseRole: undefined,
  //     image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAs9I2lNfHWLLiC9j7ek5bpdK4r3WcWZmRSyno5Pyt87sNaPWdNpja53xs5E2odAgFibCgxC5LrnKIOgPG6NKo-BN0COC-58IqZnsk7RbVK6FiN4hrBGkkhKo5C7gKVSm1L0dcqChX1j0t-h8QHAH3knAYhYfO5RTVxB2juqfv7fEYZ0P3oPM86tp7cAITBurwZLYFAFpR31-bUdsrF51EG-KtCX6ABioZ9ydKkLz2rX37lnAkooRUvLwDrVGXJkS289ZVRZWEcEJ4",
  //     description: "David Sterling...",
  //   },
  // },
];

const initialEdges: FamilyEdge[] = [
  {
    id: "n1-n4",
    source: "n1",
    target: "n4",
    sourceHandle: "spouse-out",
    targetHandle: "spouse-in",
    data: { edgeType: "marriage" },
    type: "marriage",
    animated: false,
    markerEnd: undefined,
    style: { stroke: "#e11d48", strokeWidth: 2 },
  },
  // {
  //   id: "n2-n5",
  //   source: "n2",
  //   target: "n5",
  //   sourceHandle: "spouse-out",
  //   targetHandle: "spouse-in",
  //   data: { edgeType: "marriage" },
  //   type: "marriage",
  //   animated: false,
  //   markerEnd: undefined,
  //   style: { stroke: "#e11d48", strokeWidth: 2 },
  // },
  // {
  //   id: "n2-n6",
  //   source: "n2",
  //   target: "n6",
  //   sourceHandle: "spouse-out",
  //   targetHandle: "spouse-in",
  //   data: { edgeType: "marriage" },
  //   type: "marriage",
  //   animated: false,
  //   markerEnd: undefined,
  //   style: { stroke: "#e11d48", strokeWidth: 2 },
  // },
];

const initialState: FamilyState = {
  nodes: initialNodes,
  edges: initialEdges,
};

const familySlice = createSlice({
  name: "family",
  initialState,
  reducers: {
    // ✅ Add a new person
    addNode(state, action: PayloadAction<FamilyNode>) {
      state.nodes.push(action.payload);
    },

    // ✅ Update a person's data
    updateNode(state, action: PayloadAction<{ id: string; data: Partial<FamilyNode["data"]> }>) {
      const node = state.nodes.find((n) => n.id === action.payload.id);
      if (node) Object.assign(node.data, action.payload.data);
    },

    // ✅ Remove a person
    removeNode(state, action: PayloadAction<string>) {
      state.nodes = state.nodes.filter((n) => n.id !== action.payload);
      state.edges = state.edges.filter(
        (e) => e.source !== action.payload && e.target !== action.payload
      );
    },

    // ✅ Add a marriage edge
    addEdge(state, action: PayloadAction<FamilyEdge>) {
      state.edges.push(action.payload);
    },

    // ✅ Remove a marriage edge
    removeEdge(state, action: PayloadAction<string>) {
      state.edges = state.edges.filter((e) => e.id !== action.payload);
    },

    // ✅ Update node positions after dagre layout
    setLayoutedNodes(state, action: PayloadAction<FamilyNode[]>) {
      state.nodes = action.payload;
    },

    // ✅ Bulk replace everything (e.g. after layout)
    setTree(state, action: PayloadAction<FamilyState>) {
      state.nodes = action.payload.nodes;
      state.edges = action.payload.edges;
    },
  },
});

export const {
  addNode,
  updateNode,
  removeNode,
  addEdge,
  removeEdge,
  setLayoutedNodes,
  setTree,
} = familySlice.actions;

export default familySlice.reducer;



//  const initialNodes: FamilyNode[] = [
//   {
//     id: "n1",
//     type: "custom", // 👈 important
//     position: { x: 0, y: 0 },  // parent center
//     data: {
//       parentId: [], // 👈 no parent (root)
//       label: "Arthur Bennet",
//       subText: "Age 50",
//       spouseRole: "source", // 👈 emits marriage edge from right
//       image:
//         "https://lh3.googleusercontent.com/aida-public/AB6AXuC_meMGNgj16qXcpczlqvX1QZ_GribvGo9y_0KHUvvymg3UR0R14quWRIaWhDYRpBwRUB317wZ8Xv2mmnyAsedAnV4VNcrypb8K4i-9Pf4PULtgYcvsxcMXQpUz33_7WwW1UB6opfp7VFKy-FQnCUuMDBmtCxkRPTcyAEPZCoIc-JYLg7TONnv_o7q8hHl6MNrc2nkrbLwvjVTpWFW8V5gxV1HSROiHXfhzjF7IdhzArlloQ-TV8DjHn9l40Vr3MK2vYqlzf4uKsXc",
//       description:
//         "John Sterling, 50, is a renowned architectural historian and archivist of the Sterling family lineage. With a career spanning over three decades, John has dedicated his life to uncovering lost branches of the family tree across Europe. His meticulous research and passion for genealogy have made him a respected figure in the field, often sought after for his expertise in tracing complex family histories.",
//     },
//   },
//   {
//     id: "n4",
//     type: "custom",
//     position: { x: 0, y: 0 }, // same level as father
//     data: {
//       parentId: [], // 👈 no parent (spouse of root)
//       label: "Mother",
//       subText: "Age 45",
//        spouseRole: "target", // 👈 receives marriage edge on left
//       image:
//         "https://lh3.googleusercontent.com/aida-public/AB6AXuAs9I2lNfHWLLiC9j7ek5bpdK4r3WcWZmRSyno5Pyt87sNaPWdNpja53xs5E2odAgFibCgxC5LrnKIOgPG6NKo-BN0COC-58IqZnsk7RbVK6FiN4hrBGkkhKo5C7gKVSm1L0dcqChX1j0t-h8QHAH3knAYhYfO5RTVxB2juqfv7fEYZ0P3oPM86tp7cAITBurwZLYFAFpR31-bUdsrF51EG-KtCX6ABioZ9ydKkLz2rX37lnAkooRUvLwDrVGXJkS289ZVRZWEcEJ4",
//       description:
//         "Eleanor Bennett, 45, is the mother of John Sterling. A supportive and nurturing figure in the family, Eleanor has always encouraged John's passion for genealogy and family history. She has been instrumental in preserving family traditions and stories, often sharing anecdotes and memories that have enriched John's research and deepened his connection to their ancestral roots.",
//     },
//   },
//   {
//     id: "n3",
//     type: "custom",
//     position: { x: 0, y: 0 },
//     data: {
//       parentId:  ["n1", "n4"], // 👈 child of n1 and n4
//       label: "Sarah Bennett",
//       subText: "Age 18",
//       image:
//         "https://lh3.googleusercontent.com/aida-public/AB6AXuAtDmqyRQletzG2qM4s5WFXTWo1nTVpzlClPfguWjEt82YYBcQW9sSBlfAaSvBqjzOWHkOYbPLHFMF8M7F9B0H_TyM4awqkqHNb30CiQGXaFgwTPTHFlvxKMkMQHPKv32uBN07MQ1YsGIyE73ZHarM89FNZ7eEYrrgIy0CAfWAQ1IQQJDty9uy-Ti0O6C7DrxddA847CCCabERekcw-mbrrUq4RNkjY9XBrAjpAOicyUe8bAgy5GaHSmFq5k0Br5U2mGhHHkpNOoic",
//       description:
//         "Emily Sterling, 18, is the daughter of John Sterling. Inspired by her father's dedication to genealogy, Emily has developed a deep appreciation for family history and cultural heritage. She is currently exploring her own interests in art and literature, while also contributing to the family's genealogical research by digitizing and organizing historical documents and photographs.",
//     },
//   },
//   {
//     id: "n2",
//     type: "custom",
//      position: { x: 0, y: 0 },  // child below
//     data: {
//       parentId: ["n1", "n4"], // 👈 child of n1 and n4
//       label: "Robert Bennett",
//       subText: "Age 20",
//        spouseRole: "source",    // ✅ add this — renders spouse-out handle
//       image:
//         "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ6DiDj2VmdfEiRBb_wbsTuqtZwW5FFTo2yonjFngnaeCToAbTK6q4UbEDQy49nHDNt8W9B40v0wZmk8OG4IbkOyL98l3-MdYyfR7YH-zrOpHzX4V4zHHEl9NPp41884klGTVtngzWochPpiI5dGaS4Qjks2Cbpa49EmO0oBGphqzVhtKl_zXi8nWaT5W8bsy8pmYtTZlTciKbRQ2PACv1vWsrEOUalNsVAq--LEpUqMhvQ7B9_djYS8t8hhhsijNLVKXrB8UyC0E",
//       description:
//         "Michael Sterling, 20, is the son of John Sterling. Growing up surrounded by his father's passion for genealogy, Michael has developed a keen interest in family history and heritage. He is currently pursuing studies in history and anthropology, with aspirations to continue his father's legacy of uncovering and preserving the rich tapestry of the Sterling family lineage for future generations.",
//     },
//   },
//   {
//     id: "n5",
//     type: "custom",
//     position: { x: 0, y: 0 },  // child below
//     data: {
//       parentId: null, // 👈 child of n1
//       label: "Clara Bennett",
//       subText: "1971",
//        spouseRole: "target",    // ✅ add this — renders spouse-in handle
//       image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAs9I2lNfHWLLiC9j7ek5bpdK4r3WcWZmRSyno5Pyt87sNaPWdNpja53xs5E2odAgFibCgxC5LrnKIOgPG6NKo-BN0COC-58IqZnsk7RbVK6FiN4hrBGkkhKo5C7gKVSm1L0dcqChX1j0t-h8QHAH3knAYhYfO5RTVxB2juqfv7fEYZ0P3oPM86tp7cAITBurwZLYFAFpR31-bUdsrF51EG-KtCX6ABioZ9ydKkLz2rX37lnAkooRUvLwDrVGXJkS289ZVRZWEcEJ4",
//       description: "Emily Sterling, 18, is the daughter of John Sterling. Inspired by her father's dedication to genealogy, Emily has developed a deep appreciation for family history and cultural heritage. She is currently exploring her own interests in art and literature, while also contributing to the family's genealogical research by digitizing and organizing historical documents and photographs."
//     },
//   },
//    {
//     id: "n6",
//     type: "custom",
//     position: { x: 0, y: 0 },  // child below
//     data: {
//       parentId: null, // 👈 child of n1
//       label: "Clara Bennett",
//       subText: "1971",
//        spouseRole: "target",    // ✅ add this — renders spouse-in handle
//       image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAs9I2lNfHWLLiC9j7ek5bpdK4r3WcWZmRSyno5Pyt87sNaPWdNpja53xs5E2odAgFibCgxC5LrnKIOgPG6NKo-BN0COC-58IqZnsk7RbVK6FiN4hrBGkkhKo5C7gKVSm1L0dcqChX1j0t-h8QHAH3knAYhYfO5RTVxB2juqfv7fEYZ0P3oPM86tp7cAITBurwZLYFAFpR31-bUdsrF51EG-KtCX6ABioZ9ydKkLz2rX37lnAkooRUvLwDrVGXJkS289ZVRZWEcEJ4",
//       description: "Emily Sterling, 18, is the daughter of John Sterling. Inspired by her father's dedication to genealogy, Emily has developed a deep appreciation for family history and cultural heritage. She is currently exploring her own interests in art and literature, while also contributing to the family's genealogical research by digitizing and organizing historical documents and photographs."
//     },
//   },
//   {
//     id: "n7",
//     type: "custom",
//     position: { x: 0, y: 0 },  // child below
//     data: {
//       parentId: ["n2", "n6"], // 👈 child of n1
//       marriageId: "n2-n6",
//       label: "David Bennett",
//       subText: "1965",
//       spouseRole: undefined,    // ✅ add this — renders spouse-in handle
//       image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAs9I2lNfHWLLiC9j7ek5bpdK4r3WcWZmRSyno5Pyt87sNaPWdNpja53xs5E2odAgFibCgxC5LrnKIOgPG6NKo-BN0COC-58IqZnsk7RbVK6FiN4hrBGkkhKo5C7gKVSm1L0dcqChX1j0t-h8QHAH3knAYhYfO5RTVxB2juqfv7fEYZ0P3oPM86tp7cAITBurwZLYFAFpR31-bUdsrF51EG-KtCX6ABioZ9ydKkLz2rX37lnAkooRUvLwDrVGXJkS289ZVRZWEcEJ4",
//       description: "David Sterling, 18, is the son of John Sterling. Inspired by his father's dedication to genealogy, David has developed a deep appreciation for family history and cultural heritage. He is currently exploring his own interests in art and literature, while also contributing to the family's genealogical research by digitizing and organizing historical documents and photographs."
//     },

//   }
// ];

// const initialEdges = [
//  // ✅ Marriage edge — tagged, uses named handles, no arrow, no animation
//   {
//     id: "n1-n4",
//     source: "n1",
//     target: "n4",
//     sourceHandle: "spouse-out",
//     targetHandle: "spouse-in",
//     data: { edgeType: "marriage" },
//     type: "marriage",           // 👈 uses MarriageEdge component
//     animated: false,
//     markerEnd: undefined,
//     style: { stroke: "#e11d48", strokeWidth: 2 },
//   },
//   {
//     id: "n2-n5",
//     source: "n2",
//     target: "n5",
//     sourceHandle: "spouse-out",
//     targetHandle: "spouse-in",
//     data: { edgeType: "marriage" },
//      type: "marriage",           // 👈 uses MarriageEdge component
//     animated: false,
//     markerEnd: undefined,
//     style: { stroke: "#e11d48", strokeWidth: 2 },
//   },
//   {
//     id: "n2-n6",
//     source: "n2",
//     target: "n6",
//     sourceHandle: "spouse-out",
//     targetHandle: "spouse-in",
//     data: { edgeType: "marriage" },
//     type: "marriage",
//     animated: false,
//     markerEnd: undefined,
//     style: { stroke: "#e11d48", strokeWidth: 2 },
//   },
// ];