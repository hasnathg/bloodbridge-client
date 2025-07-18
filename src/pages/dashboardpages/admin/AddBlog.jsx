import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import JoditEditor from "jodit-react";
import axiosSecure from '../../../utilities/axiosSecure';

const AddBlog = () => {
    const [content, setContent] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!content.trim()) return toast.error("Blog content is required.");

    try {
      const formData = new FormData();
      formData.append("image", data.thumbnail[0]);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData
      );

      const blogData = {
        title: data.title,
        thumbnail: imgRes.data.data.url,
        content,
        status: "draft",
        createdAt: new Date(),
      };

      await axiosSecure.post("/blogs", blogData);
      
      toast.success("Blog created as draft!");
      reset();
      setContent("");
      navigate("/dashboard/content-management");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create blog.");
    }
  };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Blog</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          {...register("title", { required: true })}
          className="input input-bordered w-full"
        />
        {errors.title && <p className="text-red-500">Title is required</p>}

        <input
          type="file"
          accept="image/*"
          {...register("thumbnail", { required: true })}
          className="file-input file-input-bordered w-full"
        />
        {errors.thumbnail && <p className="text-red-500">Thumbnail required</p>}

        <label className="font-medium">Content</label>
        <JoditEditor value={content} onBlur={(newContent) => setContent(newContent)} />

        <button type="submit" className="btn btn-primary">
          Create Blog
        </button>
      </form>
    </div>

    );
};

export default AddBlog;