"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as f3 from "family-chart";
import "@/app/styles/family-chart.css";
import { Card } from "@/lib/layout/cardTemplate";
import PersonPanel from "@/lib/layout/PersonPanel";
import AddMemberModal from "@/components/models/AddMemberModal";

export default function FamilyChart() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartDataRef = useRef<any[]>([]); // ← add this ref

  const f3ChartRef = useRef<any>(null); // ← store chart instance
  const onCardClickRef = useRef<((datum: any) => void) | undefined>(undefined);

  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [addMemberDetails, setAddMemberDetails] = useState<any>(null);
  const [isAddMember, setIsAddMember] = useState(false);
  const [isEditMember, setIsEditMember] = useState(false);

  // ✅ Always up-to-date callback, no stale closure
  onCardClickRef.current = useCallback((datum: any) => {
    setAddMemberDetails(datum);
    if (datum._new_rel_data) {
      setIsPanelOpen(false);
      setIsAddMember(true);
      return;
    }

    setSelectedPerson(datum);
    setIsPanelOpen(true);
  }, []);

  const handleOpenAddRelative = useCallback((person: any) => {
    const f3Chart = f3ChartRef.current;
    if (!f3Chart) return;

    const addRelInstance = f3Chart.editTreeInstance?.addRelativeInstance;
    if (addRelInstance?.cleanUp) {
      const currentData = f3Chart.store.getData();
      const cleaned = addRelInstance.cleanUp(currentData) ?? currentData;

      f3Chart.store.updateData(cleaned);
      f3Chart.store.updateTree({});

      // reset instance
      addRelInstance.is_active = false;
      addRelInstance.datum = null;
      addRelInstance.onChange = null;
      addRelInstance.onCancel = null;
    }

 


    // ✅ get clean datum from chart store
    const datum = f3Chart.store.getDatum(person.id);
    const f3EditTree = f3Chart.editTree();
    if (typeof f3EditTree.addRelative === "function") {
    
      f3EditTree.addRelative(datum);
    }
  }, []);

  const handleAddMember = useCallback(
    (memberData: any) => {
      const f3Chart = f3ChartRef.current;
      if (!f3Chart) return;

      const currentData = [
        ...(f3Chart.store?.getData?.() ?? chartDataRef.current),
      ];

      if (addMemberDetails?._new_rel_data) {
        const newRelData = addMemberDetails._new_rel_data;
        const { rel_id, rel_type } = addMemberDetails._new_rel_data;
        console.log('newRelData',newRelData);

         if (!memberData.id) {
            console.error("handleAddMember: memberData.id is required");
            return;
          }

          const isSpouse = rel_type === "spouse";
          const isChild  = rel_type === "son" || rel_type === "daughter";
          const isParent = rel_type === "father" || rel_type === "mother";

        
        const newPerson = {
          ...memberData,
          rels: {
            ...(memberData.rels ?? {}),
            ...(isSpouse && { spouses:  [rel_id] }),
            ...(isChild  && {
                parents: [
                  newRelData.rel_id,
                  // ✅ only include coparent if they actually exist in data
                  ...(newRelData.other_parent_id ? [newRelData.other_parent_id] : []),
                ],
              }),
            ...(isParent && { children:  [rel_id] }),
          },
        };
   
        console.log('newPerson',newPerson);
        console.log('isparent',isParent);

        // ✅ Update the related person's rels
        const updatedData = currentData.map((p: any) => {
          if (p.id !== newRelData.rel_id) return p;
          console.log('p',p);

          // ✅ Safely initialize rels if undefined
          const safeRels = p.rels ?? {};

          return {
            ...p,
            rels: {
              ...safeRels,
              ...(isSpouse && {
                spouses: [...(safeRels.spouses ?? []), newPerson.id],
              }),
              ...(isChild && {
                children: [...(safeRels.children ?? []), newPerson.id],
              }),
              ...(isParent && { parents: [...(safeRels.parents ?? []), newPerson.id] }),
            },
          };
        });
        console.log('updatedData',updatedData);

         let cleanedData = [...updatedData, newPerson];

          const addRelInstance = f3Chart.editTreeInstance?.addRelativeInstance;
          if (addRelInstance?.cleanUp) {
            cleanedData = addRelInstance.cleanUp(cleanedData) ?? cleanedData;
            addRelInstance.is_active = false;
          }

        chartDataRef.current = cleanedData; // ✅ use cleanedData not updatedData

      } else {
        // ✅ Edit existing or add standalone member
        const exists = currentData.some((p: any) => p.id === memberData.id);
        chartDataRef.current = exists
          ? currentData.map((p: any) =>
              p.id === memberData.id ? memberData : p,
            )
          : [...currentData, memberData];
      }

      // ✅ Push to f3 and re-render
      if (typeof f3Chart.updateData === "function") {
        f3Chart.updateData(chartDataRef.current);
      } else {
        f3Chart.data = chartDataRef.current;
      }

      f3Chart.updateTree({ initial: false });

      setIsAddMember(false);
      setIsEditMember(false);
      setIsPanelOpen(false);
    },
    [addMemberDetails],
  );


  useEffect(() => {
    if (!chartRef.current) return;
    let destroyed = false;
    const loadData = async () => {
      try {
        const res = await fetch("/data/data.json");
        const data = await res.json();

        // Guard: component may have unmounted while fetching
        if (destroyed || !chartRef.current) return;

        createChart(data);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    const createChart = (data: any) => {
      if (!chartRef.current) return;
      chartDataRef.current = data; // ← store it here

      const f3Chart = f3
        .createChart(chartRef.current, data)
        .setTransitionTime(1000)
        .setCardXSpacing(300)
        .setCardYSpacing(200)
        .setOrientationHorizontal();

      f3ChartRef.current = f3Chart;

      f3Chart.setCardHtml().setOnCardUpdate(
        Card(
          // ✅ Delegate through ref — always calls latest version
          (datum: any) => onCardClickRef.current?.(datum),
          f3Chart,
        ),
      );

      f3Chart.updateTree({ initial: true });
    };

    loadData();

    // ✅ Full cleanup on unmount / route change
    return () => {
      destroyed = true;
      if (chartRef.current) {
        chartRef.current.innerHTML = "";
      }
      f3ChartRef.current = null;
    };
  }, []); // ← empty dep array is correct here

  return (
    <div className="flex flex-1">
      {/* <div
        className="
          flex flex-col items-center gap-2
          h-screen w-16 py-4
          bg-surface-container-low border-r
          transition-all duration-300 ease-in-out
        "
      >
        <button
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container"
          onClick={() => {
            const chart = f3ChartRef.current;
            chart?.store.updateTree({ initial: true }); // reset tree
          }}
        >
          <span className="material-symbols-outlined">home</span>
        </button>

        <button
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20"
          onClick={() => setIsAddMember(true)}
        >
          <span className="material-symbols-outlined text-primary">
            person_add
          </span>
        </button>

        <button
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container"
          onClick={() => {
            const chart = f3ChartRef.current;
            chart?.zoomIn?.();
          }}
        >
          <span className="material-symbols-outlined">zoom_in</span>
        </button>

        <button
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container"
          onClick={() => {
            const chart = f3ChartRef.current;
            chart?.zoomOut?.();
          }}
        >
          <span className="material-symbols-outlined">zoom_out</span>
        </button>

        <button
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container"
          onClick={() => {
            const chart = f3ChartRef.current;
            chart?.fit?.();
          }}
        >
          <span className="material-symbols-outlined">center_focus_strong</span>
        </button>
      </div> */}

      <div className="flex w-full h-screen overflow-hidden">
        <div
          ref={chartRef}
          className="f3"
          style={{
            width: "100%",
            height: "900px",
            color: "#fff",
          }}
        />
        <PersonPanel
          person={selectedPerson}
           allPeople={chartDataRef.current} // 👈 here
          isOpen={isPanelOpen}
          isEditMember={() => setIsEditMember(true)}
          onClose={() => setIsPanelOpen(false)}
          onOpenAddRelative={handleOpenAddRelative}
        />

        {/* ✅ Modal */}
        {(isAddMember || isEditMember) && (
          <AddMemberModal
            memberDetails={addMemberDetails}
            onAddMemberDetails={handleAddMember}
            isAddMember={isAddMember}
            isEditMember={isEditMember}
            onClose={() => {
              setIsAddMember(false);
              setIsEditMember(false); // ✅ FIX
            }}
          />
        )}
      </div>
    </div>
  );
}
