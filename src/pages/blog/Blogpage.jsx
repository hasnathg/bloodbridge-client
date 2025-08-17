import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';

// reading time
const calculateReadingTime = (htmlContent) => {
  const text = (htmlContent || '').replace(/<[^>]+>/g, ''); // strip HTML
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes || 1} min read`;
};

const Blogpage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading } = useQuery({
    queryKey: ['publicBlogs', search, page],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`, {
        params: { status: 'published', search, page, limit },
      });
      return res.data;
    },
  });

  const blogs = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {blogs.map((blog) => {
            const preview = (blog.content || '')
              .replace(/<[^>]+>/g, '')
              .slice(0, 180);

            return (
              <article
                key={blog._id}
                className="border rounded-xl shadow-sm bg-white p-4 flex flex-col h-full"
              >
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="h-48 w-full object-cover rounded"
                  loading="lazy"
                />

                <h3 className="text-xl font-semibold mt-3">{blog.title}</h3>

                <p className="text-sm text-gray-500 mt-1 flex justify-between">
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span>{calculateReadingTime(blog.content)}</span>
                </p>

                <p className="text-sm text-gray-700 mt-2 flex-1">
                  {preview}...
                </p>

                <Link
                  to={`/blog/${blog._id}`}
                  className="text-red-600 font-medium hover:underline mt-3"
                >
                  Read more →
                </Link>
              </article>
            );
          })}
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
                page === idx + 1
                  ? 'btn bg-red-700 text-white hover:bg-red-800'
                  : 'btn-outline'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default Blogpage;
