import React from "react";

export default function ImpactStats({
  donors = 1280,
  fulfilled = 942,
  funds = 356000,
  volunteers = 210,
}) {
  const currency = "৳";
  const tiles = [
    { label: "Registered Donors", value: donors.toLocaleString() },
    { label: "Requests Fulfilled", value: fulfilled.toLocaleString() },
    { label: "Funds Raised", value: `${currency}${funds.toLocaleString()}` },
    { label: "Active Volunteers", value: volunteers.toLocaleString() },
  ];

  return (
    <section className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold text-center text-red-700">Our Impact</h2>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiles.map((t) => (
          <article
            key={t.label}
            className="relative bg-green-50 shadow-md p-6 rounded-xl hover:shadow-lg transition text-center h-full"
          >
            {/* slim red accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-200 rounded-t-xl" />
            <div className="text-3xl font-extrabold">{t.value}</div>
            <div className="opacity-80 mt-1">{t.label}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
