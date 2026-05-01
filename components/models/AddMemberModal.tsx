"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { initialNodes, addNode, setTree } from "@/store/familySlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { FamilyEdge, FamilyNode } from "@/types/family";
import { getLayoutedElements } from "@/lib/layout/dagreLayout";
import { useAppSelector } from "@/store/hooks";

type Step = 1 | 2 | 3;

type FormData = z.infer<typeof memberSchema>;

export const memberSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  gender: z
    .string({
      error: (issue) => issue.input === undefined ? "Gender is required" : "Not a string",
    })
    .min(1, "Select gender"),
  month: z.string().min(1, "Select month"),
  day: z.number().min(1).max(31).or(z.nan()),
  year: z.number().min(1900).max(new Date().getFullYear()).or(z.nan()),
  motherId: z.string().optional(),
  fatherId: z.string().optional(),
  profileImage: z.any().optional(),
  spouseId: z.string().optional(),
});

export default function AddMemberModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>(1);
  const dispatch = useDispatch();
  const nodes = useSelector((state: RootState) => state.family.nodes);
  const edges = useAppSelector((s) => s.family.edges);

  const [selectedMotherId, setSelectedMotherId] = useState<string | null>(null);
  const [selectedFatherId, setSelectedFatherId] = useState<string | null>(null);
  const [selectedSpouseId, setSelectedSpouseId] = useState<string | null>(null);

  const [motherQuery, setMotherQuery] = useState("");
  const [fatherQuery, setFatherQuery] = useState("");
  const [spouseQuery, setSpouseQuery] = useState("");

  const [showMother, setShowMother] = useState(false);
  const [showFather, setShowFather] = useState(false);
  const [showSpouse, setShowSpouse] = useState(false);

  const mothers = nodes.filter(
    (n) =>
      n.data.gender == "female" &&
      n.data.label.toLowerCase().includes(motherQuery.toLowerCase()),
  );

  const filteredMothers = selectedFatherId
    ? edges
        .filter(
          (e) =>
            e.data?.edgeType === "marriage" && e.source === selectedFatherId,
        )
        .map((e) => nodes.find((n) => n.id === e.target))
        .filter(Boolean)
    : mothers;

  const fathers = nodes.filter(
    (n) =>
      n.data.gender == "male" &&
      n.data.label.toLowerCase().includes(fatherQuery.toLowerCase()),
  );
  const filteredFathers = selectedMotherId
    ? edges
        .filter(
          (e) =>
            e.data?.edgeType === "marriage" && e.target === selectedMotherId,
        )
        .map((e) => nodes.find((n) => n.id === e.source))
        .filter(Boolean)
    : fathers;

  const onMotherSelect = (id: string) => {
    console.log("Selected mother ID:", motherQuery);
    setSelectedMotherId(id);
  };
  const onFatherSelect = (id: string) => {
    console.log("Selected father ID:", id);
    setSelectedFatherId(id);
  };

  const onSpouseSelect = (id: string) => {
    console.log("Selected spouse ID:", id);
    setSelectedSpouseId(id);
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(memberSchema),
  });
  const selectedGender = watch("gender");
  const spouses = nodes.filter((n) => {
    if (!selectedGender) return true;
    // prevent same gender (basic logic, adjust if needed)
    return n.data.gender !== selectedGender;
  });

  const onSubmit = async (data: FormData) => {
    if (step < 3) {
      setStep((s) => (s + 1) as Step);
    } else {
      const newNode: FamilyNode = {
        id: `n${Date.now()}`,
        type: "custom",
        position: { x: 0, y: 0 },
        data: {
          parentIds:
            data.motherId || data.fatherId
              ? [data.fatherId, data.motherId].filter(
                  (id): id is string => id !== undefined,
                )
              : [],
          parentMarriageId:
            data.motherId && data.fatherId
              ? `${data.fatherId}-${data.motherId}`
              : undefined,
          label: `${data.firstName} ${data.lastName}`,
          subText: data.year ? `Born ${data.year}` : "",
          gender: data.gender,
          spouseRole: undefined,
          image:
            data.profileImage instanceof File
              ? URL.createObjectURL(data.profileImage)
              : data.gender == "male"
                ? "https://randomuser.me/api/portraits/men/32.jpg"
                : "https://randomuser.me/api/portraits/women/44.jpg",
          description: "",
        },
      };

      // 🔥 get current state
      const currentNodes = [...nodes, newNode];
      let currentEdges = [...edges];
      // ✅ add marriage edge if both parents exist
      if (data.fatherId && data.motherId) {
        const edgeId = `${data.fatherId}-${data.motherId}`;
        const alreadyExists = currentEdges.some((e) => e.id === edgeId);
        if (!alreadyExists) {
          currentEdges.push({
            id: edgeId,
            source: data.fatherId,
            target: data.motherId,
            type: "marriage",
            sourceHandle: "spouse-out",
            targetHandle: "spouse-in",
            data: { edgeType: "marriage" },
            animated: false,
            style: { stroke: "#e11d48", strokeWidth: 2 },
          });
        }
      }

      //spouse edge
      let updatedNodes = currentNodes;

      if (data.spouseId) {
        const edgeId = `${newNode.id}-${data.spouseId}`;
        currentEdges.push({
          id: edgeId,
          source:data.spouseId,
          target: newNode.id ,
          type: "marriage",
          sourceHandle: "spouse-out",
          targetHandle: "spouse-in",
          data: { edgeType: "marriage" },
          animated: false,
          style: { stroke: "#e11d48", strokeWidth: 2 },
        });

        // ✅ FIX: no "const" here
        updatedNodes = currentNodes.map((n) => {
          if (n.id === newNode.id) {
            return {
              ...n,
              data: { ...n.data, spouseRole: "target" },
            };
          }
          if (n.id === data.spouseId) {
            return {
              ...n,
              data: { ...n.data, spouseRole: "source" },
            };
          }
          return n;
        });
      }

      

      // 🔥 APPLY DAGRE LAYOUT HERE
      const finalNodes = data.spouseId ? updatedNodes : currentNodes;

    // ✅ await ELK async layout
    const { nodes: layoutedNodes, edges: layoutedEdges } =
      await getLayoutedElements(finalNodes, currentEdges);

      dispatch(
        setTree({
          nodes: layoutedNodes as FamilyNode[],
          edges: layoutedEdges as FamilyEdge[],
        }),
      );
      onClose(); // close modal
    }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-surface-container-lowest shadow-[0px_8px_24px_rgba(44,47,49,0.06)] md:rounded-xl rounded-none overflow-hidden border border-outline-variant/15">
        {/* ── Header + Progress ── */}
        <div className="p-8 pb-4">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-on-surface tracking-tight">
                Add Family Member
              </h1>
              <p className="text-on-surface-variant text-sm mt-1">
                {step === 1 &&
                  "Populate your living archive with a new connection."}
                {step === 2 &&
                  "Define how this person connects to your family."}
                {step === 3 && "Upload images and documents for this person."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-container-low rounded-full transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex flex-col gap-2">
                <div
                  className={`h-1.5 w-full rounded-full transition-all ${
                    step >= s ? "bg-primary" : "bg-surface-container-high"
                  }`}
                />
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest ${
                    step >= s ? "text-primary" : "text-on-surface-variant"
                  }`}
                >
                  {s === 1 && "Step 1: Identity"}
                  {s === 2 && "Step 2: Lineage"}
                  {s === 3 && "Step 3: Visuals"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Step Content ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-4">
          {/* Step 1 — Identity */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2 ml-1">
                    First Name
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="e.g. Eleanor"
                    type="text"
                    {...register("firstName")}
                  />
                  <p className="text-red-500 text-sm">
                    {errors.firstName?.message}
                  </p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2 ml-1">
                    Last Name
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="e.g. Vance"
                    type="text"
                    {...register("lastName")}
                  />
                  <p className="text-red-500 text-sm">
                    {errors.lastName?.message}
                  </p>
                </div>

                {/* Gender */}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2 ml-1">
                    Gender
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "female", icon: "female" },
                      { label: "male", icon: "male" },
                      { label: "other", icon: "diversity_3" },
                    ].map((g) => (
                      <button
                        key={g.label}
                        type="button"
                        onClick={() =>
                          setValue("gender", g.label, { shouldValidate: true })
                        }
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-all
                            ${
                              selectedGender === g.label
                                ? "bg-primary text-on-primary ring-2 ring-primary/40"
                                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                            }
                        `}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {g.icon}
                        </span>
                        {g.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-red-500 text-sm">
                    {errors.gender?.message}
                  </p>
                </div>

                {/* Date of Birth */}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2 ml-1">
                    Date of Birth
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <input
                        type="number"
                        placeholder="DD"
                        min={1}
                        max={31}
                        onInput={(e) => {
                          const value = Number(e.currentTarget.value);
                          if (value > 31) e.currentTarget.value = "31";
                          if (value < 1) e.currentTarget.value = "1";
                        }}
                        {...register("day", {
                          valueAsNumber: true,
                          min: 1,
                          max: 31,
                        })}
                        className="w-full bg-surface-container-low border border-transparent rounded-lg p-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                      />
                      <p className="text-red-500 text-sm">
                        {errors.day?.message}
                      </p>
                    </div>
                    <div>
                      <select
                        {...register("month")}
                        className="w-full bg-surface-container-low border border-transparent rounded-lg p-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                      >
                        <option value="">Month</option>
                        {[
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ].map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                      <p className="text-red-500 text-sm">
                        {errors.month?.message}
                      </p>
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="YYYY"
                        max={2099}
                        {...register("year", {
                          valueAsNumber: true,
                          min: { value: 1900, message: "Min year is 1900" },
                          max: {
                            value: new Date().getFullYear(),
                            message: "Invalid future year",
                          },
                        })}
                        className="w-full bg-surface-container-low border border-transparent rounded-lg p-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                      />
                      <p className="text-red-500 text-sm">
                        {errors.year?.message}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-on-surface/60">
                    Enter a valid date (DD / Month / YYYY)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
                <span className="material-symbols-outlined text-primary text-xl">
                  info
                </span>
                <p className="text-xs text-primary leading-relaxed">
                  Adding accurate birth data helps our Living Archive algorithm
                  suggest potential historical records.
                </p>
              </div>
            </div>
          )}

          {/* Step 2 — Lineage */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2 ml-1">
                    Mother
                  </label>
                  <input
                    type="text"
                    value={motherQuery}
                    onChange={(e) => {
                      setMotherQuery(e.target.value);
                      setShowMother(true);
                    }}
                    onFocus={() => setShowMother(true)}
                    placeholder="Search mother..."
                    className="w-full bg-surface-container-low rounded-lg p-3"
                  />
                  {showMother && motherQuery.trim() !== "" && (
                    <div className="absolute z-10 w-full bg-white shadow-lg rounded-lg mt-1 max-h-48 overflow-y-auto">
                      {filteredMothers.length > 0 ? (
                        filteredMothers.map((m: any) => (
                          <div
                            key={m.id}
                            onClick={() => {
                              setValue("motherId", m.id); // 👈 store selected id
                              setMotherQuery(m.data.label);
                              setShowMother(false);
                              onMotherSelect(m.id);
                            }}
                            className="p-3 hover:bg-gray-100 cursor-pointer"
                          >
                            {m.data.label}
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-sm text-gray-400">
                          No results
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2 ml-1">
                    Father
                  </label>
                  {/* <input
                    type="text"
                    placeholder="Search father..."
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  /> */}
                  <input
                    type="text"
                    value={fatherQuery}
                    onChange={(e) => {
                      setFatherQuery(e.target.value);
                      setShowFather(true);
                    }}
                    onFocus={() => setShowFather(true)}
                    placeholder="Search father..."
                    className="w-full bg-surface-container-low rounded-lg p-3"
                  />
                  {showFather  && fatherQuery.trim() !== "" && (
                    <div className="absolute z-10 w-full bg-white shadow-lg rounded-lg mt-1 max-h-48 overflow-y-auto">
                      {filteredFathers.length > 0 ? (
                        filteredFathers.map((f: any) => (
                          <div
                            key={f.id}
                            onClick={() => {
                              setValue("fatherId", f.id); // 👈 store selected id
                              setFatherQuery(f.data.label);
                              setShowFather(false);
                              onFatherSelect(f.id);
                            }}
                            className="p-3 hover:bg-gray-100 cursor-pointer"
                          >
                            {f.data.label}
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-sm text-gray-400">
                          No results
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2 ml-1">
                  Spouse
                </label>
                <input
                  type="text"
                  value={spouseQuery}
                  onChange={(e) => {
                    setSpouseQuery(e.target.value);
                    setShowSpouse(true);
                  }}
                  onFocus={() => setShowSpouse(true)}
                  placeholder="Search spouse..."
                  className="w-full bg-surface-container-low rounded-lg p-3"
                />
                {showSpouse && spouseQuery.trim() !== "" && (
                  <div className="absolute z-10 w-full bg-white shadow-lg rounded-lg mt-1 max-h-48 overflow-y-auto">
                    {spouses
                      .filter((s) =>
                        s.data.label
                          .toLowerCase()
                          .includes(spouseQuery.toLowerCase()),
                      )
                      .map((s) => (
                        <div
                          key={s.id}
                          onClick={() => {
                            setValue("spouseId", s.id); // 👈 store selected id
                            setSpouseQuery(s.data.label);
                            setShowSpouse(false);
                            onSpouseSelect(s.id);
                          }}
                          className="p-3 hover:bg-gray-100 cursor-pointer"
                        >
                          {s.data.label}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">
                    Children
                  </label>
                  <button
                    type="button"
                    className="text-primary text-xs font-bold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">
                      add
                    </span>
                    Add Child
                  </button>
                </div>
                <div className="p-6 border border-dashed border-outline-variant/30 rounded-lg text-center bg-surface-container-lowest">
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant/40 mb-2 block">
                    child_care
                  </span>
                  <p className="text-xs text-on-surface-variant">
                    No children added yet.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Visuals */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">
                  Profile Photo
                </label>
                <div className="relative flex flex-col items-center justify-center border border-dashed border-outline-variant/30 rounded-lg bg-surface-container-lowest p-8 text-center cursor-pointer hover:bg-surface-container-low transition-all">
                  <span className="material-symbols-outlined text-3xl text-primary mb-2">
                    add_a_photo
                  </span>
                  <p className="text-sm text-on-surface">
                    Upload profile image
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    PNG, JPG (max 5MB)
                  </p>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    {...register("profileImage")}
                  />
                </div>
                <p className="text-red-500 text-sm">
                  {typeof errors.profileImage?.message === "string"
                    ? errors.profileImage.message
                    : ""}
                </p>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">
                  Documents
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: "Birth Certificate", icon: "description" },
                    { label: "Census Records", icon: "analytics" },
                  ].map((doc) => (
                    <button
                      type="button"
                      key={doc.label}
                      className="flex items-center gap-3 p-4 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-all text-left"
                    >
                      <span className="material-symbols-outlined text-primary">
                        {doc.icon}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{doc.label}</p>
                        <p className="text-xs text-on-surface-variant">
                          Upload file
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="p-8 border-t border-outline-variant/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                step === 1 ? onClose() : setStep((s) => (s - 1) as Step)
              }
              className="px-6 py-2.5 text-on-surface-variant font-semibold hover:bg-surface-container-low rounded-lg transition-all active:scale-95"
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>
            <button
              type="submit"
              className="bg-primary px-8 py-2.5 text-on-primary font-bold rounded-lg shadow-lg active:scale-95 transition-all flex items-center gap-2"
            >
              {step === 3 ? "Complete Profile" : "Next Step"}
              <span className="material-symbols-outlined text-sm">
                {step === 3 ? "check" : "arrow_forward"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
