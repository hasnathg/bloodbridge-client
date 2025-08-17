// src/components/home/RecentRequests.jsx
import React from "react";
import { NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Droplet, MapPin, Calendar, Clock } from "lucide-react";

const apiBase = import.meta.env.VITE_API_URL;

function CardSkeleton() {
  return (
    <div className="relative bg-green-50 shadow-md p-6 rounded-xl h-full animate-pulse">
      <div className="absolute top-0 left-0 right-0 h-1 bg-red-200 rounded-t-xl" />
      <div className="h-6 w-2/3 bg-base-200 rounded" />
      <div className="mt-2 h-4 w-1/2 bg-base-200 rounded" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-3/4 bg-base-200 rounded" />
        <div className="h-3 w-2/3 bg-base-200 rounded" />
        <div className="h-3 w-1/2 bg-base-200 rounded" />
      </div>
      <div className="mt-6 h-11 w-full bg-base-200 rounded" />
    </div>
  );
}

export default function RecentRequests() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recent-public-donations"],
    queryFn: async () => {
      if (!apiBase) return { data: [] };
      const res = await fetch(`${apiBase}/donations/public?limit=4&page=1`);
      if (!res.ok) throw new Error("Failed to load");
      return res.json(); // { data, total }
    },
    retry: 1,
  });

  const items = data?.data || [];
  if ((!items || items.length === 0) && !isLoading && !isError) return null;

  // Stagger DOWNWARDS (never above the heading)
  // md (2 cols): left lower, right higher; next row repeats
  const yMd = ["md:mt-6", "md:mt-2", "md:mt-6", "md:mt-2"];
  // lg (4 cols): lower → higher → lowest → medium
  const yLg = ["lg:mt-8", "lg:mt-2", "lg:mt-10", "lg:mt-4"];

  return (
    <section className="py-16">
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 rounded-2xl bg-red-50/60">
      {/* centered title + right CTA */}
      <div className="pt-10 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
          <div className="hidden md:block" />
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-700">
              Recent Donation Requests
            </h2>
            <p className="opacity-80 text-sm mt-1">
              Latest public requests that need a donor.
            </p>
          </div>
          <div className="justify-self-center md:justify-self-end">
            <NavLink
              to="/donation-request"
              className="btn btn-outline btn-sm text-lg text-red-500 border-white"
            >
              View all
            </NavLink>
          </div>
        </div>
      </div>

      {/* card grid (allow overflow so hover scale isn't clipped) */}
      <div className="mt-6 px-4 md:px-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative overflow-visible">
          {isLoading ? (
            <>
              <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
            </>
          ) : isError ? (
            <p className="opacity-70 text-sm">Couldn’t load requests right now.</p>
          ) : (
            items.map((r) => (
              <article
                key={r._id || r.id}
                tabIndex={0}
                className={[
                  "relative bg-green-50 p-6 rounded-xl shadow-md transition h-full flex flex-col",
                  "transform-gpu will-change-transform focus:outline-none",
                  // bigger on hover/focus, but keep layout in the same grid line
                  "hover:scale-105 md:hover:scale-110 lg:hover:scale-[1.14] xl:hover:scale-[1.16]",
                  "focus-within:scale-105 md:focus-within:scale-110 lg:focus-within:scale-[1.14] xl:focus-within:scale-[1.16]",
                  // lift and sit on top when enlarged
                  "hover:-translate-y-2 hover:shadow-2xl hover:z-30",
                  "focus-within:-translate-y-2 focus-within:shadow-2xl focus-within:z-30",
                  // subtle ring accent
                  "ring-0 hover:ring-2 hover:ring-red-200 focus-within:ring-2 focus-within:ring-red-200",
                ].join(" ")}
              >
                {/* slim red accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-red-200 rounded-t-xl" />

                <div className="flex items-start justify-between">
                  <h3 className="text-2xl font-semibold leading-tight">
                    {r.recipientName}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-red-700 text-sm font-medium">
                    <Droplet className="w-5 h-5" />
                    {r.bloodGroup}
                  </span>
                </div>

                <p className="text-gray-700 mt-2 text-base">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-600" />
                    {r.recipientDistrict}, {r.recipientUpazila}
                  </span>
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm opacity-90">
                  <div className="inline-flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{r.donationDate}</span>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{r.donationTime}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <NavLink
                    to="/donation-request"
                    className="btn btn-outline text-red-500 border-white hover:bg-red-800"
                  >
                    View details
                  </NavLink>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  </section>
  );
}
