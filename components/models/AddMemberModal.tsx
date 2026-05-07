"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Step = 1 | 2;

type FormData = z.infer<typeof memberSchema>;

export const memberSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  // gender: z
  //   .string({
  //     error: (issue) => issue.input === undefined ? "Gender is required" : "Not a string",
  //   })
  //   .min(1, "Select gender"),
  birthMonth: z.string().min(1, "Select month"),
  birthDay: z.number().min(1).max(31).or(z.nan()),
  birthYear: z.number().min(1900).max(new Date().getFullYear()).or(z.nan()),
  profileImage: z.any().optional(),
});

type AddMemberProps = {
  onAddMemberDetails: (data: any) => void; // ✅ function, not data
  memberDetails?: any;
  // 👈 define what it receives
  isAddMember: Boolean;
  isEditMember: Boolean;
  onClose: () => void;
};

export default function AddMemberModal({
  onAddMemberDetails,
  memberDetails,
  isAddMember,
  isEditMember,
  onClose,
}: AddMemberProps) {
  const [step, setStep] = useState<Step>(1);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      firstName: memberDetails.data.firstName || "",
      lastName: memberDetails.data.lastName || "",
      // gender: memberDetails.data.gender || "",   // ✅ ADD THIS
      birthDay: memberDetails.data.birthDay || "",
      birthMonth: memberDetails.data.birthMonth || "",
      birthYear: memberDetails.data.birthYear || "",
    },
  });

  const profileImage = watch("profileImage") as FileList;
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  useEffect(() => {
    if (!profileImage?.[0] || typeof profileImage[0] === "string") {
      // ✅ Handle AI enhanced image (already a base64 string)
      setPreviewImage(typeof profileImage === "string" ? profileImage : null);
      return;
    }
    const url = URL.createObjectURL(profileImage[0]);
    setPreviewImage(url);
    return () => URL.revokeObjectURL(url); // ✅ cleanup
  }, [profileImage]);

  //const selectedGender = watch("gender");
  const onSubmit = async (data: FormData) => {
    if (step < 2) {
      setStep((s) => (s + 1) as Step);
    } else {
      let avatar: string =
        memberDetails?.data?.avatar ??
        "https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg";

      try {
        if (typeof data.profileImage === "string") {
          // ✅ AI enhanced — base64 string, convert to File then upload
          const base64 = data.profileImage.split(",")[1];
          const byteArray = Uint8Array.from(atob(base64), (c) =>
            c.charCodeAt(0),
          );
          const file = new File([byteArray], "enhanced.png", {
            type: "image/png",
          });
          avatar = await uploadImage(file);
        } else if (data.profileImage?.[0] instanceof File) {
          // ✅ Regular file upload
          avatar = await uploadImage(data.profileImage[0]);
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        // continue with default avatar
      }

      const memberData = {
        id: memberDetails.id,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          birthYear: `${data.birthYear}`,
          avatar,
          gender: memberDetails.data.gender,
        },
        rels: {
          spouses: memberDetails.rels.spouses,
          children: memberDetails.rels.children,
          parents: memberDetails.rels.parents,
        },
      };
      console.log("memberData", memberData);
      onAddMemberDetails(memberData); // ✅ now actually a function
      onClose();
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    return data.url; // ← "/uploads/filename.png"
  };

  const [isEnhancing, setIsEnhancing] = useState(false);
  const handleAiEnhance = async (file: File) => {
    console.log("handel");
    if (!(file instanceof File)) return; // ✅ guard against base64 string
    console.log("file", file);
    setIsEnhancing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/image/enhance", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      console.log("asfdasdf", data);
      setIsEnhancing(false);
      setValue("profileImage", data.image);
    } catch (error) {
      console.error(error);
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
                {/* {step === 2 &&
                  "Define how this person connects to your family."} */}
                {step === 2 && "Upload images and documents for this person."}
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
            {[1, 2].map((s) => (
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
                  {/* {s === 2 && "Step 2: Lineage"} */}
                  {s === 2 && "Step 2: Visuals"}
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
                {/* <div className="col-span-2">
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
                </div> */}

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
                        {...register("birthDay", {
                          valueAsNumber: true,
                          min: 1,
                          max: 31,
                        })}
                        className="w-full bg-surface-container-low border border-transparent rounded-lg p-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                      />
                      <p className="text-red-500 text-sm">
                        {errors.birthDay?.message}
                      </p>
                    </div>
                    <div>
                      <select
                        {...register("birthMonth")}
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
                        {errors.birthMonth?.message}
                      </p>
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="YYYY"
                        max={2099}
                        {...register("birthYear", {
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
                        {errors.birthYear?.message}
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

          {step === 2 && (
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider ml-1">
                  Profile Photo
                </label>

                <div className="relative border border-dashed border-outline-variant/30 rounded-2xl bg-surface-container-lowest p-6 text-center hover:bg-surface-container-low transition-all overflow-hidden">
                  {/* Preview */}
                  {previewImage ? (
                    <div className="flex flex-col items-center gap-4">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className={`w-32 h-32 rounded-2xl object-cover border shadow-md transition-all duration-300 ${
                          isEnhancing ? "blur-sm brightness-75 scale-95" : ""
                        }`}
                      />

                      <div>
                        <p className="text-sm font-medium text-on-surface">
                          Image Selected
                        </p>

                        <p className="text-xs text-on-surface-variant">
                          Click to change image
                        </p>
                      </div>

                      {/* AI Buttons */}
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (profileImage?.[0] instanceof File) {
                              handleAiEnhance(profileImage[0]);
                            }
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 transition-all"
                        >
                          <span className="material-symbols-outlined text-base">
                            auto_fix_high
                          </span>
                          {isEnhancing ? "Enhancing..." : "AI Enhance"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setValue("profileImage", null);
                            setIsEnhancing(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high text-sm font-medium hover:bg-surface-container-highest transition-all"
                        >
                          <span className="material-symbols-outlined text-base">
                            delete
                          </span>
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-primary mb-2">
                        add_a_photo
                      </span>

                      <p className="text-sm text-on-surface">
                        Upload profile image
                      </p>

                      <p className="text-xs text-on-surface-variant">
                        PNG, JPG (max 5MB)
                      </p>

                      {/* Input */}
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        {...register("profileImage")}
                      />
                    </div>
                  )}
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
              {step === 2 ? "Complete Profile" : "Next Step"}
              <span className="material-symbols-outlined text-sm">
                {step === 2 ? "check" : "arrow_forward"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
