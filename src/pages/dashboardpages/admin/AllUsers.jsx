import React, { useState } from 'react';
import { useAuth } from '../../../provider/AuthContext';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/spinner/LoadingSpinner';
import { MoreHorizontal } from 'lucide-react';

const AllUsers = () => {
    const { user, role } = useAuth();
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const limit = 8;

    const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", filter, page],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        params: { status: filter, page, limit },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      });
      return res.data;
    },
    enabled: role === "admin", 
  });

  const users = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  const updateStatus = useMutation({
    mutationFn: async ({ email, status }) => {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/${email}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("Status updated");
      refetch();
    },
    onError: () => toast.error("Failed to update status"),
  });


  const updateRole = useMutation({
    mutationFn: async ({ email, role }) => {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/${email}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("Role updated");
      refetch();
    },
    onError: () => toast.error("Failed to update role"),
  });

  if (isLoading) return <LoadingSpinner/>;

    return (
         <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">All Users</h2>
        <div>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="select select-bordered select-sm"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/*  Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded shadow">
        <table className="table w-full text-sm">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <img
                    src={u.avatar || "https://i.ibb.co/7JfqXxB/user.png"}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className="badge">{u.role}</span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      u.status === "active" ? "badge-success" : "badge-error"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="text-right">
                  {/* Dropdown menu */}
                  <div className="dropdown dropdown-left">
                    <button
                      tabIndex={0}
                      className="btn btn-ghost btn-sm"
                      title="Actions"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
                    >
                      {u.status === "active" ? (
                        <li>
                          <button
                            onClick={() =>
                              updateStatus.mutate({
                                email: u.email,
                                status: "blocked",
                              })
                            }
                          >
                            Block
                          </button>
                        </li>
                      ) : (
                        <li>
                          <button
                            onClick={() =>
                              updateStatus.mutate({
                                email: u.email,
                                status: "active",
                              })
                            }
                          >
                            Unblock
                          </button>
                        </li>
                      )}
                      {u.role !== "volunteer" && (
                        <li>
                          <button
                            onClick={() =>
                              updateRole.mutate({
                                email: u.email,
                                role: "volunteer",
                              })
                            }
                          >
                            Make Volunteer
                          </button>
                        </li>
                      )}
                      {u.role !== "admin" && (
                        <li>
                          <button
                            onClick={() =>
                              updateRole.mutate({
                                email: u.email,
                                role: "admin",
                              })
                            }
                          >
                            Make Admin
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*  Mobile Cards */}
      <div className="md:hidden space-y-4">
        {users.map((u) => (
          <div
            key={u._id}
            className="bg-white p-4 rounded shadow flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <img
                src={u.avatar || "https://i.ibb.co/7JfqXxB/user.png"}
                alt={u.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm">{u.email}</p>
                <p className="text-xs">
                  {u.role} | {u.status}
                </p>
              </div>
            </div>
            <div className="dropdown dropdown-left">
              <button tabIndex={0} className="btn btn-ghost btn-sm">
                <MoreHorizontal size={18} />
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
              >
                {u.status === "active" ? (
                  <li>
                    <button
                      onClick={() =>
                        updateStatus.mutate({
                          email: u.email,
                          status: "blocked",
                        })
                      }
                    >
                      Block
                    </button>
                  </li>
                ) : (
                  <li>
                    <button
                      onClick={() =>
                        updateStatus.mutate({
                          email: u.email,
                          status: "active",
                        })
                      }
                    >
                      Unblock
                    </button>
                  </li>
                )}
                {u.role !== "volunteer" && (
                  <li>
                    <button
                      onClick={() =>
                        updateRole.mutate({
                          email: u.email,
                          role: "volunteer",
                        })
                      }
                    >
                      Make Volunteer
                    </button>
                  </li>
                )}
                {u.role !== "admin" && (
                  <li>
                    <button
                      onClick={() =>
                        updateRole.mutate({
                          email: u.email,
                          role: "admin",
                        })
                      }
                    >
                      Make Admin
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className={`btn btn-sm ${
                page === idx + 1 ? "btn-primary" : "btn-outline"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
    );
};

export default AllUsers;