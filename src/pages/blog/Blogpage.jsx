import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';

//  reading time
const calculateReadingTime = (htmlContent) => {
  const text = htmlContent.replace(/<[^>]+>/g, ""); // Remove HTML tags
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200); // Average 200 WPM
  return `${minutes} min read`;
};

const Blogpage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading } = useQuery({
    queryKey: ["publicBlogs", search, page],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`, {
        params: {
          status: "published",
          search,
          page,
          limit,
        },
      });
      return res.data;
    },
  });

  const blogs = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <div className="max-w-6xl mx-auto mt-2 p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">📝 Blood Bridge Blog</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search blogs..."
          className="input input-bordered w-full max-w-md"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="border rounded shadow p-4 bg-white space-y-2">
              {/* Thumbnail */}
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="h-48 w-full object-cover rounded"
              />

              {/* Blog Title */}
              <h3 className="text-xl font-semibold">{blog.title}</h3>

              {/* Meta Info */}
              <p className="text-sm text-gray-500 flex justify-between">
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                <span>{calculateReadingTime(blog.content)}</span>
              </p>

              {/* Blog Preview */}
              <p className="text-sm text-gray-700 line-clamp-3">
                {blog.content?.replace(/<[^>]+>/g, "").slice(0, 180)}...
              </p>

              {/* Read More */}
              <Link
                to={`/blog/${blog._id}`}
                className="text-red-600 font-medium hover:underline"
              >
                Read more →
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className={`btn btn-sm ${
                page === idx + 1 ? "btn bg-red-700 text-white hover:bg-red-800" : "btn-outline"
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

export default Blogpage;