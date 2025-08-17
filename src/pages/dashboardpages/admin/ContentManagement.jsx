import React, { useState } from 'react';
import { useAuth } from '../../../provider/AuthContext';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import axiosSecure from '../../../utilities/axiosSecure';

const ContentManagement = () => {
    const { role } = useAuth();
  const [filter, setFilter] = useState("all");

  // Fetch all blogs
  const { data = {}, isLoading, refetch } = useQuery({
  queryKey: ["blogs", filter],
  queryFn: async () => {
    const res = await axiosSecure.get(
      `/blogs${filter !== "all" ? `?status=${filter}` : ""}`
    );
    return res.data;
  },
});
  const blogs = data.data || [];

  // Mutations for publish/unpublish/delete
  const updateStatus = useMutation({
  mutationFn: async ({ id, status }) => {
    await axiosSecure.patch(`/blogs/${id}/status`, { status });
  },
  onSuccess: () => {
    toast.success("Status updated!");
    refetch();
  },
});

  const deleteBlog = useMutation({
  mutationFn: async (id) => {
    await axiosSecure.delete(`/blogs/${id}`);
  },
  onSuccess: () => {
    toast.success("Blog deleted");
    refetch();
  },
});
    return (
        <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Management</h2>
        {(role === "admin" || role === "volunteer") && (
          <Link
            to="/dashboard/content-management/add-blog"
            className="btn btn-sm btn-accent text-black"
          >
            Add Blog
          </Link>
        )}
      </div>

      {/* Filter */}
      <div className="mb-4">
        <label className="font-medium mr-2">Filter by status:</label>
        <select
          className="select select-bordered select-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Blogs list */}
      {isLoading ? (
        <p>Loading...</p>
      ) : blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.isArray(blogs) && blogs.map((blog) => (
            <div
              key={blog._id}
              className="border rounded shadow p-4 bg-white space-y-2"
            >
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="h-40 w-full object-cover rounded"
              />
              <h3 className="text-lg font-semibold">{blog.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                {blog.content?.replace(/<[^>]+>/g, "").slice(0, 150)}...
              </p>
              <p>
                <span className={`badge px-2 py-1 rounded text-sm font-medium
    ${blog.status === "draft"
      ? "border border-red-500 text-red-150 bg-white"
      : "border border-green-500 text-green-700 bg-green-100"}
  `}
>
                  {blog.status === "draft" ? "Draft" : "Published"}
                </span>
              </p>

              {/* Action buttons */}
              {role === "admin" && (
                <div className="flex gap-2">
                  {blog.status === "draft" ? (
                    <button
                      className="btn btn-sm bg-red-700 text-white hover:bg-red-800"
                      onClick={() =>
                        updateStatus.mutate({ id: blog._id, status: "published" })
                      }
                    >
                      Publish
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm bg-red-700 text-white hover:bg-red-800"
                      onClick={() =>
                        updateStatus.mutate({ id: blog._id, status: "draft" })
                      }
                    >
                      Unpublish
                    </button>
                  )}
                  <button
                    className="btn btn-sm bg-red-700 text-white hover:bg-red-800"
                    onClick={() => deleteBlog.mutate(blog._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    );
};

export default ContentManagement;