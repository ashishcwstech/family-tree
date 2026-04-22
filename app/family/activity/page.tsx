"use client";

import { useState } from "react";
export default function ActivityLayout() {
  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">
                Activity Feed
              </h1>
              <p className="text-on-surface-variant text-lg">
                Tracing the recent pulse of your family legacy.
              </p>
            </div>
            <div className="flex gap-2 p-1 bg-surface-container-high rounded-xl w-fit">
              <button className="px-4 py-2 bg-surface-container-lowest shadow-sm rounded-lg text-sm font-semibold text-primary">
                All Updates
              </button>
              <button className="px-4 py-2 hover:bg-surface-container-low transition-colors rounded-lg text-sm font-medium text-on-surface-variant">
                Records
              </button>
              <button className="px-4 py-2 hover:bg-surface-container-low transition-colors rounded-lg text-sm font-medium text-on-surface-variant">
                Media
              </button>
            </div>
          </div>

          <div className="relative space-y-8">
            <div className="absolute left-6 top-4 bottom-4 w-px bg-outline-variant/30 hidden md:block"></div>

            <div className="relative flex items-center md:pl-16 mb-4">
              <div className="hidden md:block absolute left-[1.375rem] w-3 h-3 rounded-full bg-primary ring-4 ring-background"></div>
              <span className="text-xs font-bold tracking-[0.2em] text-on-surface-variant/60 uppercase">
                Today
              </span>
            </div>

            <div className="relative group">
              <div className="md:pl-16">
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_8px_24px_rgba(44,47,49,0.06)] border border-outline-variant/10 transition-all hover:shadow-[0px_12px_32px_rgba(44,47,49,0.08)]">
                  <div className="flex items-start gap-4">
                    <img
                      className="w-10 h-10 rounded-full bg-secondary-container"
                      data-alt="Close-up of a smiling young woman with curly black hair, outdoor natural lighting"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPTC_z7-hDbhagrsOBpGq1VrK2Nz0B-Qwqh0ElCud3ZxzengIwBqcYzUd_8IFzMmF1L1pkmeFRf2NOUB46wbuQWd5thvIetwBEMZw_uupZblGPWtLZmQt8dT-f_zEwH50wKpi8aO9S12WxcKvLnrQvy6PbLZLNjU6jT7iZZuHaNizh9ThvRt-Tz990oyKfLTD7IBMi7JLcftWIVF_BYCKQ_QTjSQRmFmTdyww1QPIGWVsJDnpqq82pYm2kdQngQK01VDWVQtQ9LEk"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-on-surface">
                            <span className="text-primary">Sarah Miller</span>{" "}
                            added 4 new photos to{" "}
                            <span className="text-indigo-600 underline underline-offset-4 decoration-indigo-200">
                              The Great Migration
                            </span>{" "}
                            album
                          </p>
                          <p className="text-xs text-on-surface-variant mt-1">
                            2 hours ago • Ancestral Journey
                          </p>
                        </div>
                        <span
                          className="material-symbols-outlined text-on-surface-variant/40 cursor-pointer hover:text-primary transition-colors"
                          data-icon="more_horiz"
                        >
                          more_horiz
                        </span>
                      </div>
                      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="aspect-square rounded-xl overflow-hidden group/img relative">
                          <img
                            className="w-full h-full object-crop transition-transform duration-500 group-hover/img:scale-110"
                            data-alt="Vintage sepia photograph of a large family gathering on a wooden porch, 1920s style clothing"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVwP0M4CbnmntrFUMmln7S3b1-BinPNfbJMXRiHBRcuW6i7dhVLMlQX3I47zm65CQuz1pJ_NRTDAN9tKPR__THZr47bMx8oTdydIKTF5DGyD6gmDjGl3b_VlVC4zXZgVOJ43Qh0jOkP5fiPuvFAbkQCcIqlb0GJkr3dlbyIQdwBYpOuPK_Ef-JLhYGeunSpqkvcriVl2UGH5c_i3WjBEu23YB4LR-hgK6fZocVuvieiobcrqH4C3Vmmrtghzboa3gDy7kGEGRxuW8"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="aspect-square rounded-xl overflow-hidden group/img relative">
                          <img
                            className="w-full h-full object-crop transition-transform duration-500 group-hover/img:scale-110"
                            data-alt="Black and white portrait of an elderly man with a long beard and weathered face, high contrast dramatic lighting"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTJ0u_4ZBdc8EUQSJ3GfxrsJkscVoKF3_cMQRrjMiKuo3C8DJeeOLQxBm3WtWaLioLdYqVtVrRGFrMQWsaaKtPruWOvmuta564l4Oq99o9w75lVfiQTLeuQle6wyro68QmwJd0x6EUxU77V0VyGqHJhEYPrWUFCZkcBEX5Mi_bm_GgEcfVRTNVKqy1rlRwz99x8kXUKQ-B7hgv5ZqQ9gBdTqx4_RdOMm-0hpTy7iG1A6IUL7ZdK4cHh4fGiuLW_Lc6f8Nwd9kTuLQ"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="aspect-square rounded-xl overflow-hidden group/img relative">
                          <img
                            className="w-full h-full object-crop transition-transform duration-500 group-hover/img:scale-110"
                            data-alt="Old handwritten letter with elegant cursive script on aged yellowed paper, soft atmospheric lighting"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMriJ4ZPkxX1qnDW2xfk-LuYnFbkhKNtiHsdUab8UgONI5LOx576bISwnUvHnzFJdpYhRESqsawlhJFIRrIAeVB3AZZJNsTfv5uQxKDipCv7wPW9zHEq8u6P0umGKGq7iMFZOsKun_gvLFhBz6xP0IL3mLb96CpBOLG0ZwlG_bBy3AaEDOniEt793gU-iMgtw3Y8EQY-KWOAuwAs9OxQ6w99SxX0aGZDNDKKksyR7SJQTwdAiB6ZesbVcpNfWn02t81wz1xuiG8j8"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="aspect-square rounded-xl overflow-hidden bg-surface-container-high flex items-center justify-center relative cursor-pointer">
                          <span className="text-primary font-bold">+12</span>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center gap-4 border-t border-outline-variant/10 pt-4">
                        <button className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors">
                          <span
                            className="material-symbols-outlined text-lg"
                            data-icon="favorite"
                          >
                            favorite
                          </span>{" "}
                          24 Hearts
                        </button>
                        <button className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors">
                          <span
                            className="material-symbols-outlined text-lg"
                            data-icon="comment"
                          >
                            comment
                          </span>{" "}
                          8 Comments
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="md:pl-16">
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_8px_24px_rgba(44,47,49,0.06)] border border-outline-variant/10 transition-all hover:shadow-[0px_12px_32px_rgba(44,47,49,0.08)]">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span
                        className="material-symbols-outlined"
                        data-icon="person_add"
                      >
                        person_add
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-on-surface">
                            New branch discovered by{" "}
                            <span className="text-primary">James Wilson</span>
                          </p>
                          <p className="text-xs text-on-surface-variant mt-1">
                            5 hours ago • System Update
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 bg-surface-container-low p-4 rounded-xl flex items-center gap-6">
                        <div className="flex -space-x-3 overflow-hidden">
                          <img
                            alt="Arthur"
                            className="inline-block h-12 w-12 rounded-full ring-4 ring-surface-container-lowest"
                            data-alt="Portrait of an older man with white hair and a kind expression, wearing a navy blue suit"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJxA9dOUUCtnuEmPkGDOTa-rZDH32d__ip7NZMtxM8tinlLnKgAJmY08sPSzF6_plPwlIKR818tExVBnpvQVgeBbxZnT0c8hD9aRby49vnp5Ih821OdMArZ_z8HQHR1xkojjK6jXQu_x0FX0LHfQQsB9FnDcxRK3EUZWKmHpGOW-xN2PX23uweSIwM--9eu0P-qySM_hqhyitgCVxwRXeC-XLAEmd1a3uaW00gcsj-KTYHwoCZd7cziM3h6G0zCnyQ9EwizH34jX0"
                          />
                          <div className="h-12 w-12 rounded-full ring-4 ring-surface-container-lowest bg-primary-container flex items-center justify-center">
                            <span
                              className="material-symbols-outlined text-white"
                              data-icon="account_tree"
                            >
                              account_tree
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-sm">
                            Arthur Pendragon (1842 - 1912)
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            Confirmed link found in 1880 Census Records
                          </p>
                        </div>
                        <button className="ml-auto text-primary text-xs font-bold px-4 py-2 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
                          View Link
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex items-center md:pl-16 mb-4 mt-12">
              <div className="hidden md:block absolute left-[1.375rem] w-3 h-3 rounded-full bg-outline-variant ring-4 ring-background"></div>
              <span className="text-xs font-bold tracking-[0.2em] text-on-surface-variant/60 uppercase">
                Yesterday
              </span>
            </div>

            <div className="relative group">
              <div className="md:pl-16">
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_8px_24px_rgba(44,47,49,0.06)] border border-outline-variant/10 transition-all hover:shadow-[0px_12px_32px_rgba(44,47,49,0.08)]">
                  <div className="flex items-start gap-4">
                    <img
                      className="w-10 h-10 rounded-full bg-secondary-container"
                      data-alt="Smiling woman with blonde hair in a ponytail, wearing a denim jacket, soft natural light"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDntEOQfDXi6jBkCZODSNq5h5WVrE7f4MJQjRsLL7iPHrnLkFqVDUjXaK23EFMsyNf95Qi1QKqk3y9MwwEUT4dspZidQN_iRyNM61ufp1E7WcqBBpDHIfw5aM_JEczi_zoIjdkW91iv0LASn8ISBiH_qqJtizlDeKG5uZy4_u269aCm2DKoWKcjFKluS7dX3iug36o8KkMUU-qaAJDVVhtRRPSciqvao_M5lYhyi__TKqay34_8B89C5zdkdKfvq52oVCWyeeNp4U8"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-on-surface">
                            <span className="text-primary">Emma Thompson</span>{" "}
                            updated birth records for{" "}
                            <span className="font-bold">Elizabeth Bennet</span>
                          </p>
                          <p className="text-xs text-on-surface-variant mt-1">
                            Yesterday at 14:45
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-4">
                        <div className="flex-1 p-3 bg-red-50/50 rounded-lg border-l-4 border-red-300">
                          <p className="text-[10px] font-bold text-red-700 uppercase mb-1">
                            Before
                          </p>
                          <p className="text-sm text-on-surface-variant line-through">
                            Born: June 18th, 1854 - Longbourn, UK
                          </p>
                        </div>
                        <div className="flex-1 p-3 bg-green-50/50 rounded-lg border-l-4 border-green-300">
                          <p className="text-[10px] font-bold text-green-700 uppercase mb-1">
                            After
                          </p>
                          <p className="text-sm text-on-surface font-semibold">
                            Born: June 12th, 1854 - Hertfordshire, UK
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs italic text-on-surface-variant">
                        "Source: Baptismal record discovered at local parish
                        archives."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="md:pl-16">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 shadow-xl text-white overflow-hidden relative">
                  <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
                    <span
                      className="material-symbols-outlined text-[200px]"
                      data-icon="stars"
                    >
                      stars
                    </span>
                  </div>
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      {/* <span className="material-symbols-outlined text-4xl text-yellow-300"
                                        data-icon="auto_awesome" data-weight="fill"
                                        style="font-variation-settings: 'FILL' 1;">auto_awesome</span> */}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">
                        Milestone Reached!
                      </h3>
                      <p className="text-indigo-100/80 max-w-md">
                        Your family tapestry has reached 1,000 confirmed
                        members. You've uncovered generations of stories and
                        connections.
                      </p>
                      <div className="mt-4 flex gap-3">
                        <button className="bg-white text-indigo-700 px-4 py-2 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-all">
                          Share Achievement
                        </button>
                        <button className="bg-white/10 text-white px-4 py-2 rounded-lg text-xs font-bold backdrop-blur-sm border border-white/20 active:scale-95 transition-all">
                          View Statistics
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <button className="px-8 py-3 rounded-xl border border-outline-variant/30 text-on-surface-variant font-bold text-sm hover:bg-surface-container-low transition-all active:scale-95">
              Load Older Activities
            </button>
          </div>
      </div>
    </div>  
  );
}
