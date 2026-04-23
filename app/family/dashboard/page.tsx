"use client";

import { useAppSelector } from "@/store/hooks";

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs text-on-surface-variant">{title}</p>
        <h2 className="text-xl font-bold">{value}</h2>
      </div>

      <span className="material-symbols-outlined text-primary">
        {icon}
      </span>
    </div>
  );
}

function QuickCard({ title, icon }: { title: string; icon: string }) {
  return (
    <button className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col items-center gap-2 hover:scale-105 transition-all">
      <span className="material-symbols-outlined text-primary">
        {icon}
      </span>
      <span className="text-sm font-medium">{title}</span>
    </button>
  );
}

export default function DashboardPage() {
  const nodes = useAppSelector((s) => s.family.nodes);

  const totalMembers = nodes.length;

  return (
    <div className="space-y-8">
      {/* ─── Welcome ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">
            Family Dashboard
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Overview of your family structure and activity
          </p>
        </div>

        {/* <button className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow">
          <span className="material-symbols-outlined text-sm">add</span>
          Add Member
        </button> */}
      </div>

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Members" value={totalMembers} icon="group" />
        <StatCard title="Families" value="6" icon="diversity_3" />
        <StatCard title="Generations" value="4" icon="timeline" />
        <StatCard title="Connections" value="12" icon="hub" />
      </div>

      {/* ─── Quick Actions ─── */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-on-surface">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickCard title="Add Member" icon="person_add" />
          <QuickCard title="Add Marriage" icon="favorite" />
          <QuickCard title="Upload Docs" icon="upload_file" />
          <QuickCard title="View Tree" icon="account_tree" />
        </div>
      </div>

      {/* ─── Bottom Section ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Members */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold mb-4 text-on-surface">
            Recent Members
          </h3>

          <div className="space-y-3">
            {nodes.slice(0, 5).map((n) => (
              <div key={n.id} className="flex items-center gap-3">
                <img
                  src={n.data.image || "/images/default-profile.png"}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{n.data.label}</p>
                  <p className="text-xs text-on-surface-variant">
                    {n.data.subText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold mb-4 text-on-surface">Activity</h3>

          <div className="space-y-3 text-sm text-on-surface-variant">
            <p>• Added new member</p>
            <p>• Connected parents</p>
            <p>• Updated family tree</p>
          </div>
        </div>

        {/* Tree Preview */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold mb-4 text-on-surface">
            Family Tree Preview
          </h3>

          <div className="h-40 rounded-lg bg-surface-container-low flex items-center justify-center text-sm text-on-surface-variant">
            Tree Preview (React Flow Mini)
          </div>
        </div>
      </div>
    </div>
  );
}