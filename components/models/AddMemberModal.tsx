"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { initialNodes, addNode } from "@/store/familySlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { FamilyNode } from "@/types/family";

type Step = 1 | 2 | 3;

type FormData = z.infer<typeof memberSchema>;

export const memberSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  gender: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Gender is required" : "Not a string",
    })
    .min(1, "Select gender"),
  day: z.string(),
  month: z.string().min(1, "Select month"),
  year: z.string(),
  motherId: z.string().optional(),
  fatherId: z.string().optional(),
  profileImage: z.any().optional(),
});

export default function AddMemberModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>(1);
  const dispatch = useDispatch();
  const nodes = useSelector((state: RootState) => state.family.nodes);

  const [motherQuery, setMotherQuery] = useState("");
  const [fatherQuery, setFatherQuery] = useState("");

  const [showMother, setShowMother] = useState(false);
  const [showFather, setShowFather] = useState(false);

  const mothers = nodes.filter(
    (n) =>
      n.data.gender === "female" &&
      n.data.label.toLowerCase().includes(motherQuery.toLowerCase()),
  );

  const fathers = nodes.filter(
    (n) =>
      n.data.gender === "male" &&
      n.data.label.toLowerCase().includes(fatherQuery.toLowerCase()),
  );

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

  const onSubmit = (data: FormData) => {
    if (step < 3) {
      setStep((s) => (s + 1) as Step);
    } else {
      const newNode: FamilyNode = {
        id: `n${Date.now()}`,
        type: "custom",
        position: { x: 0, y: 0 },
        data: {
          parentId:
            data.motherId || data.fatherId
              ? [data.fatherId, data.motherId].filter((id): id is string => id !== undefined)
              : [],
          marriageId: data.motherId && data.fatherId ? `${data.fatherId}-${data.motherId}` : undefined,
          label: `${data.firstName} ${data.lastName}`,
          subText: data.year ? `Born ${data.year}` : "",

          gender: data.gender,
          spouseRole: undefined,
            
          image:
            data.profileImage instanceof File
              ? URL.createObjectURL(data.profileImage)
              : null,

          description: "",
        },
      };
      console.log("newNode:", newNode);

      dispatch(addNode(newNode));
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
                      { label: "Female", icon: "female" },
                      { label: "Male", icon: "male" },
                      { label: "Other", icon: "diversity_3" },
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
                        type="string"
                        placeholder="DD"
                        className="w-full bg-surface-container-low border border-transparent rounded-lg p-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                        {...register("day")}
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
                        type="string"
                        placeholder="YYYY"
                        min={1900}
                        max={2099}
                        {...register("year")}
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
                  {/* <input
                    type="text"
                    placeholder="Search mother..."
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  /> */}
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
                  {showMother && (
                    <div className="absolute z-10 w-full bg-white shadow-lg rounded-lg mt-1 max-h-48 overflow-y-auto">
                      {mothers.length > 0 ? (
                        mothers.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => {
                              setValue("motherId", m.id); // 👈 store selected id
                              setMotherQuery(m.data.label);
                              setShowMother(false);
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
                  {showFather && (
                    <div className="absolute z-10 w-full bg-white shadow-lg rounded-lg mt-1 max-h-48 overflow-y-auto">
                      {fathers.length > 0 ? (
                        fathers.map((f) => (
                          <div
                            key={f.id}
                            onClick={() => {
                              setValue("fatherId", f.id); // 👈 store selected id
                              setFatherQuery(f.data.label);
                              setShowFather(false);
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
                  placeholder="Search spouse..."
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
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
                  {typeof errors.profileImage?.message === "string" ? errors.profileImage.message : ""}
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
