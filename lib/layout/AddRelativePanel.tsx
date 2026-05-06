"use client";

import { useState } from "react";
import { X, UserPlus } from "lucide-react";

type RelType = "father" | "mother" | "spouse" | "son" | "daughter";

interface NewPersonData {
  firstName: string;
  lastName:  string;
  birthday:  string;
  gender:    string;
}

interface Props {
  isOpen:       boolean;
  targetPerson: any;
  onChoose:     (rel: RelType, data: NewPersonData) => void;
  onCancel:     () => void;
}

const RELATIONS: { type: RelType; label: string; icon: string; color: string; defaultGender: string }[] = [
  { type: "father",   label: "Father",   icon: "♂", color: "#1d4ed8", defaultGender: "M" },
  { type: "mother",   label: "Mother",   icon: "♀", color: "#b00d6a", defaultGender: "F" },
  { type: "spouse",   label: "Spouse",   icon: "♥", color: "#8126cf", defaultGender: "M" },
  { type: "son",      label: "Son",      icon: "♂", color: "#0369a1", defaultGender: "M" },
  { type: "daughter", label: "Daughter", icon: "♀", color: "#9d005d", defaultGender: "F" },
];

export default function AddRelativePanel({ isOpen, targetPerson, onChoose, onCancel }: Props) {
  const [step, setStep]           = useState<"pick" | "form">("pick");
  const [relType, setRelType]     = useState<RelType | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [birthday, setBirthday]   = useState("");
  const [gender, setGender]       = useState("M");

  if (!isOpen) return null;

  const targetName = [
    targetPerson?.data?.["firstName"],
    targetPerson?.data?.["lastName"],
  ].filter(Boolean).join(" ") || "this person";

  const selectedRel = RELATIONS.find(r => r.type === relType);

  const handlePickRel = (rel: typeof RELATIONS[0]) => {
    setRelType(rel.type);
    setGender(rel.defaultGender);
    setFirstName("");
    setLastName("");
    setBirthday("");
    setStep("form");
  };

  const handleSubmit = () => {
    if (!relType) return;
    onChoose(relType, { firstName, lastName, birthday, gender });
    // reset
    setStep("pick");
    setRelType(null);
  };

  const handleBack = () => {
    setStep("pick");
    setRelType(null);
  };

  const inputClass = `
    w-full px-4 py-3 rounded-xl text-sm
    bg-surface-container-low border border-outline-variant/20
    text-on-surface placeholder:text-on-surface-variant
    focus:outline-none focus:ring-2 focus:ring-primary/30
    transition-all
  `;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      bg-surface-container-lowest rounded-3xl shadow-2xl w-96
                      border border-outline-variant/20 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            {step === "form" && (
              <button
                onClick={handleBack}
                className="w-8 h-8 rounded-xl bg-surface-container-low flex items-center
                           justify-center hover:bg-surface-container transition-colors"
              >
                <span className="text-on-surface-variant text-sm">←</span>
              </button>
            )}
            <div>
              <h2 className="text-base font-bold text-on-surface">
                {step === "pick" ? "Add Relative" : `Add ${selectedRel?.label}`}
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {step === "pick"
                  ? <>For <span className="font-semibold text-primary">{targetName}</span></>
                  : <>Adding {selectedRel?.label.toLowerCase()} to <span className="font-semibold text-primary">{targetName}</span></>
                }
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-xl bg-surface-container-low flex items-center
                       justify-center hover:bg-surface-container transition-colors"
          >
            <X className="w-4 h-4 text-on-surface-variant" />
          </button>
        </div>

        {/* ── Step 1: Pick relation ── */}
        {step === "pick" && (
          <div className="px-4 pb-6 space-y-2">
            {RELATIONS.map((rel) => (
              <button
                key={rel.type}
                onClick={() => handlePickRel(rel)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl
                           bg-surface-container-low hover:bg-surface-container
                           transition-colors text-left group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center
                              text-lg font-bold flex-shrink-0"
                  style={{ background: `${rel.color}18`, color: rel.color }}
                >
                  {rel.icon}
                </div>
                <span className="text-sm font-semibold text-on-surface
                                 group-hover:text-primary transition-colors flex-1">
                  Add {rel.label}
                </span>
                <span className="text-on-surface-variant text-sm
                                 group-hover:text-primary transition-colors">→</span>
              </button>
            ))}
          </div>
        )}

        {/* ── Step 2: Fill in details ── */}
        {step === "form" && (
          <div className="px-6 pb-6 space-y-4">

            {/* Gender toggle */}
            <div className="flex gap-2">
              {["M", "F"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold
                              border transition-all ${
                    gender === g
                      ? "bg-primary text-on-primary border-primary"
                      : "bg-surface-container-low text-on-surface-variant border-outline-variant/20 hover:bg-surface-container"
                  }`}
                >
                  {g === "M" ? "♂ Male" : "♀ Female"}
                </button>
              ))}
            </div>

            {/* First name */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant
                                uppercase tracking-wider mb-1.5">
                First Name
              </label>
              <input
                className={inputClass}
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            {/* Last name */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant
                                uppercase tracking-wider mb-1.5">
                Last Name
              </label>
              <input
                className={inputClass}
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* Birthday */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant
                                uppercase tracking-wider mb-1.5">
                Birthday
              </label>
              <input
                className={inputClass}
                placeholder="e.g. 1990"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-white
                         flex items-center justify-center gap-2
                         transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${selectedRel?.color}, #8126cf)`,
                boxShadow:  `0 4px 16px ${selectedRel?.color}40`,
              }}
            >
              <UserPlus className="w-4 h-4" />
              Add {selectedRel?.label}
            </button>
          </div>
        )}
      </div>
    </>
  );
}