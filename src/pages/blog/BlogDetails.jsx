import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { Link, useParams } from 'react-router';
import LoadingSpinner from '../../components/spinner/LoadingSpinner';
import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, 
    TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';

const BlogDetails = () => {
  const { id } = useParams();
   const shareUrl = window.location.href;

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/blogs/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  if (error) return <p className="text-red-500">Failed to load blog.</p>;
  if (!blog) return <p className="text-center">Blog not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link
        to="/blog"
        className="inline-block text-blue-600 hover:underline text-sm font-medium mb-4"
      >
        ← Back to Blogs
      </Link>

      <h1 className="text-3xl font-bold leading-tight text-gray-800">{blog.title}</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-500 gap-2">
        <p>By: {blog.authorEmail}</p>
        <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
      </div>

      <img
        src={blog.thumbnail}
        alt={blog.title}
        className="w-full max-h-[300px] object-cover rounded-md shadow"
      />

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      ></div>

      {/* Social Sharing */}
      <div className="mt-8 border-t pt-4">
        <h4 className="font-semibold text-gray-700 mb-2">Share this article:</h4>
        <div className="flex gap-3">
          <FacebookShareButton url={shareUrl} quote={blog.title}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl} title={blog.title}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <WhatsappShareButton url={shareUrl} title={blog.title}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <LinkedinShareButton url={shareUrl}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;