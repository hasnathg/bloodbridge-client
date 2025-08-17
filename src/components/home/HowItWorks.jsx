
import React from "react";
import { ClipboardList, UserPlus, HeartHandshake, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: <UserPlus className="w-7 h-7 text-red-600" />,
    title: "Join as a Donor",
    desc: "Register once. Manage your profile, blood group & location.",
  },
  {
    icon: <ClipboardList className="w-7 h-7 text-red-600" />,
    title: "Create / Find Requests",
    desc: "Need blood? Post a request. Donors can browse pending requests.",
  },
  {
    icon: <HeartHandshake className="w-7 h-7 text-red-600" />,
    title: "Donate & Coordinate",
    desc: "Confirm time & hospital. Status moves to “inprogress”.",
    chips: ["pending", "inprogress", "done", "canceled"],
  },
  {
    icon: <CheckCircle className="w-7 h-7 text-red-600" />,
    title: "Update Status",
    desc: "Mark as “done” or “canceled” after donation. Keep history clean.",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold text-center text-red-700">How BloodBridge Works</h2>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s, i) => (
          <article
            key={i}
            className="relative bg-green-50 shadow-md p-6 rounded-xl hover:shadow-lg transition h-full"
          >
            {/* slim red accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-200 rounded-t-xl" />
            <div className="flex items-center gap-3">
              <div className="shrink-0">{s.icon}</div>
              <h3 className="font-semibold text-lg">{s.title}</h3>
            </div>
            <p className="opacity-80 text-sm mt-3 min-h-12">{s.desc}</p>

            {s.chips && (
              <div className="mt-4 flex flex-wrap gap-2">
                {s.chips.map((c) => (
                  <span key={c} className="badge badge-outline">{c}</span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
