"use client";
import { UserRoundPlus, X } from "lucide-react";

interface Person {
  id: string;
  data: {
    firstName?: string;
    lastName?: string;
    birthDay?: string;
    birthMonth?: string;
    birthYear?: string;
    birthPlace?: string;
    death?: string;
    deathPlace?: string;
    gender?: string;
    avatar?: string;
    image?: string;
    summary?: string;
    generation?: string;
  };
  rels?:any;
}

interface Props {
  person: Person | null;
   allPeople?: Person[]; // 👈 add this
  isOpen: boolean;
  onClose: () => void;
  isEditMember: () => void;
  onOpenAddRelative?: (person: any) => void;
}

export default function PersonPanel({
  person,
  allPeople,
  isEditMember,
  isOpen,
  onClose,
  onOpenAddRelative,
}: Props) {
  if (!person) return null;

  const dd = person.data;
  const firstName = dd["firstName"] || "";
  const lastName = dd["lastName"] || "";
  const name = `${firstName} ${lastName}`.trim() || "Unknown";
  const initials = name
    .split(" ")
    .map((n) => n[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const image = dd.avatar || dd.image || "";
  const birthday = dd.birthDay || "—";
  const birthPlace = dd.birthPlace || "";
  const death = dd.death || "—";
  const deathPlace = dd.deathPlace || (dd.death ? "" : "Active");
  const summary = dd.summary || "";
  const generation = dd.generation || "";


  const pronoun =
  dd.gender === "M"
    ? "He"
    : dd.gender === "F"
      ? "She"
      : "They";

const spouseNames =
  person.rels?.spouses
    ?.map((id:any) => {
      const spouse = allPeople?.find((p) => p.id === id);
      return spouse
        ? `${spouse.data.firstName || ""} ${spouse.data.lastName || ""}`.trim()
        : null;
    })
    .filter(Boolean)
    .join(", ") || "";

const childrenNames =
  person.rels?.children
    ?.map((id:any) => {
      const child = allPeople?.find((p) => p.id === id);
      return child
        ? `${child.data.firstName || ""} ${child.data.lastName || ""}`.trim()
        : null;
    })
    .filter(Boolean)
    .join(", ") || "";

  return (
    <>
      {/* Backdrop (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`
          flex-shrink-0 overflow-y-auto
          bg-surface-container-lowest border-l border-surface-container-high
          shadow-[-8px_0px_24px_rgba(44,47,49,0.08)]
          transition-all duration-300 ease-in-out relative z-40
          ${isOpen ? "w-96 p-8" : "w-0 p-0 overflow-hidden"}
        `}
        style={{ height: "100vh" }}
      >
        {isOpen && (
          <>
            <div className="flex justify-between items-start mb-8">
              {/* Close button — now on the LEFT */}
              <button
                onClick={onClose}
                className="shadow-[0px_8px_24px_rgba(44,47,49,0.06)] border border-outline-variant/10 bg-surface-container-lowest w-12 h-12 rounded-xl flex items-center justify-center hover:bg-surface-container-low transition-colors"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>

              {/* Icon — now on the RIGHT */}
              <div
                onClick={() => onOpenAddRelative?.(person)}
                className="shadow-[0px_8px_24px_rgba(44,47,49,0.06)] border border-outline-variant/10 signature-gradient w-12 h-12 rounded-xl flex items-center justify-center"
              >
                <UserRoundPlus className="w-5 h-5 text-primary" />
              </div>
            </div>

            {/* Avatar + name */}
            <div className="mb-8 text-center">
              <div className="w-32 h-32 rounded-3xl overflow-hidden mx-auto mb-4 border-4 border-white shadow-xl bg-surface-container-low flex items-center justify-center">
                {image ? (
                  <img
                    src={image}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-4xl font-bold text-on-surface-variant">
                    {initials}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-on-surface">{name}</h2>
              {generation && (
                <p className="text-primary font-semibold text-sm mt-1">
                  {generation}
                </p>
              )}
            </div>

            {/* Born / Died */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-surface-container-low p-4 rounded-2xl">
                <p className="text-[10px] text-on-surface-variant uppercase mb-1 tracking-wider">
                  Born
                </p>
                <p className="font-bold text-sm">{birthday}</p>
                {birthPlace && (
                  <p className="text-[10px] text-on-surface-variant mt-0.5">
                    {birthPlace}
                  </p>
                )}
              </div>
              <div className="bg-surface-container-low p-4 rounded-2xl">
                <p className="text-[10px] text-on-surface-variant uppercase mb-1 tracking-wider">
                  Died
                </p>
                <p className="font-bold text-sm">{death}</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                  {deathPlace}
                </p>
              </div>
            </div>

            {/* Life Summary */}

            {/* Biography */}
            {/* Biography */}
            {/* Biography */}
{/* Biography */}
<div className="mb-8">
  <h3 className="text-xs text-on-surface-variant uppercase tracking-wider mb-3">
    Biography
  </h3>

  <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/10">
    <div className="flex items-start gap-4">

      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined text-primary">
          auto_stories
        </span>
      </div>

      {/* Content */}
      <div className="space-y-4">

        {/* Main Bio */}
        <p className="text-sm leading-7 text-on-surface">
          <span className="font-semibold">{name}</span>

          {(dd.birthDay || dd.birthMonth || dd.birthYear) && (
            <>
              {" "}was born on{" "}
              <span className="font-medium">
                {[dd.birthDay, dd.birthMonth, dd.birthYear]
                  .filter(Boolean)
                  .join(" ")}
              </span>
            </>
          )}

          {birthPlace && (
            <>
              {" "}in{" "}
              <span className="font-medium">{birthPlace}</span>
            </>
          )}
          .
        </p>

        {/* Spouse */}
        {spouseNames && (
          <p className="text-sm leading-7 text-on-surface">
            {pronoun} is married to{" "}
            <span className="font-medium">{spouseNames}</span>.
          </p>
        )}

        {/* Children */}
        {childrenNames && (
          <p className="text-sm leading-7 text-on-surface">
            {pronoun} has children named{" "}
            <span className="font-medium">{childrenNames}</span>.
          </p>
        )}

        {/* Generation */}
        <p className="text-sm leading-7 text-on-surface">
          {pronoun} is part of the{" "}
          <span className="font-medium">
            {generation || "family lineage"}
          </span>.
        </p>

        {/* Summary */}
        {summary && (
          <div className="pt-3 border-t border-outline-variant/10">
            <p className="text-sm text-on-surface-variant leading-7">
              {summary}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
</div>

            {/* Documents placeholder */}
            <div className="space-y-3 mb-8">
              <h3 className="text-xs text-on-surface-variant uppercase tracking-wider mb-3">
                Documents
              </h3>
              <div className="flex items-center gap-4 p-3 bg-white border border-surface-container rounded-2xl cursor-pointer hover:bg-surface-container-lowest transition-colors">
                <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <div>
                  <p className="text-xs font-bold">Birth Certificate.pdf</p>
                  <p className="text-[10px] text-on-surface-variant">
                    Added Oct 12, 2023
                  </p>
                </div>
              </div>
            </div>

            {/* Edit button */}
            <button
              onClick={isEditMember}
              className="w-full py-3 rounded-2xl bg-surface-container-high text-sm font-bold hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              Edit Profile
            </button>
          </>
        )}
      </div>
    </>
  );
}
