"use client";

import { useState } from "react";
export default function SettingLayout() {
  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">
              Settings
            </h1>
            <p className="text-on-surface-variant max-w-2xl">
              Manage your digital heritage, security protocols, and discovery
              preferences for your ancestral research.
            </p>
          </div>

          
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-12 space-y-8">
              <section
                className="bg-surface-container-lowest rounded-2xl p-8 transition-shadow hover:shadow-lg"
                id="security"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-on-surface">
                      Account Security
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      Keep your historical data safe and secure.
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-primary/20"
                        type="email"
                        value="julian.thorne@heritage.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        Authentication
                      </label>
                      <button className="w-full text-left bg-surface-container-low py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-between">
                        Two-Factor Enabled
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      </button>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button className="bg-surface-container-high text-on-surface px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-surface-container-highest transition-colors">
                      Update Password
                    </button>
                  </div>
                </div>
              </section>
              <section className="space-y-4" id="privacy">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined">shield_person</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-on-surface">
                      Privacy &amp; Visibility
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      Control who can discover your branch of the tree.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-on-surface mb-1">
                        Tree Visibility
                      </h3>
                      <p className="text-xs text-on-surface-variant mb-6">
                        Make your primary tree searchable by distant relatives.
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">
                        Publicly Searchable
                      </span>
                      <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-on-surface mb-1">
                        DNA Profile
                      </h3>
                      <p className="text-xs text-on-surface-variant mb-6">
                        Allow genetic matching with new connections.
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-on-surface-variant">
                        Matches Disabled
                      </span>
                      <div className="w-12 h-6 bg-surface-container-high rounded-full relative p-1 cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute left-1 shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section
                className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/10"
                id="notifications"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-on-surface">
                      Notification Preferences
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      Stay updated on new discoveries and matches.
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">
                    notifications_active
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl hover:bg-white transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                        hub
                      </span>
                      <span className="text-sm font-medium">New Record Hints</span>
                    </div>
                    <input
                      // checked=""
                      className="rounded text-primary focus:ring-primary border-outline-variant/30"
                      type="checkbox"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl hover:bg-white transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                        genetics
                      </span>
                      <span className="text-sm font-medium">DNA Match Alerts</span>
                    </div>
                    <input
                      // checked=""
                      className="rounded text-primary focus:ring-primary border-outline-variant/30"
                      type="checkbox"
                    />
                  </div>
                </div>
              </section>
              <div className="py-8 border-t border-outline-variant/20 ">
                <div className="bg-error/5 p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-error">Danger Zone</h3>
                    <p className="text-xs text-error/70">
                      Permanently remove your account and all ancestral
                      research.
                    </p>
                  </div>
                  <button className="text-error font-bold text-sm border border-error/20 px-6 py-2 rounded-xl hover:bg-error hover:text-white transition-all">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>



      </div>
    </div>
  );
}
