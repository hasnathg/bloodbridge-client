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
      <div className="h-5 w-2/3 bg-base-200 rounded" />
      <div className="mt-2 h-4 w-1/2 bg-base-200 rounded" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-3/4 bg-base-200 rounded" />
        <div className="h-3 w-2/3 bg-base-200 rounded" />
        <div className="h-3 w-1/2 bg-base-200 rounded" />
      </div>
      <div className="mt-5 h-10 w-full bg-base-200 rounded" />
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

  return (
    <section className="py-16">
      {/* keep distinct soft background if you liked it; remove bg-red-50/60 if you want plain */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 rounded-2xl bg-red-50/60">
        <div className="flex items-end justify-between gap-4 pt-10 px-4 md:px-6">
          <div>
            <h2 className="text-3xl font-bold text-red-700 text-center">Recent Donation Requests</h2>
            <p className="opacity-80 text-sm mt-1 text-center">Latest public requests that need a donor.</p>
          </div>
          <NavLink
            to="/donation-request"
            className="btn btn-outline btn-sm text-lg text-red-500 border-white"
          >
            View all
          </NavLink>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-6 pb-10">
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
                className="relative bg-green-50 shadow-md p-6 rounded-xl hover:shadow-lg transition h-full flex flex-col"
              >
                {/* red accent bar to differentiate 'request' cards */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-red-200 rounded-t-xl" />

                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold">{r.recipientName}</h3>
                  <span className="inline-flex items-center gap-1 text-red-700 text-sm font-medium">
                    <Droplet className="w-4 h-4" />
                    {r.bloodGroup}
                  </span>
                </div>

                <p className="text-gray-600 mt-1">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    {r.recipientDistrict}, {r.recipientUpazila}
                  </span>
                </p>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm opacity-80">
                  <div className="inline-flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{r.donationDate}</span>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{r.donationTime}</span>
                  </div>
                </div>

                <div className="mt-5">
                  <NavLink
                    to="/donation-request"
                    className="btn btn-outline btn-sm text-lg text-red-500 border-white w-full"
                  >
                    View details
                  </NavLink>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
