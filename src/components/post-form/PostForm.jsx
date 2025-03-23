import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import authService from "../../appwrite/auth"; // Import auth service directly
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ID } from "appwrite";

export default function PostForm({ post }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  // Check authentication status when component loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setError("You must be logged in to create posts");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setError("Authentication error: " + error.message);
      }
    };

    checkAuth();
  }, []);

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
  }, []);

  // Automatically update slug when the title changes
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  const submit = async (data) => {
    setError("");
    setLoading(true);

    try {
      // Double-check authentication before submitting
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        setError("You must be logged in to create posts");
        setLoading(false);
        return;
      }

      let fileId = post?.featuredImage || null;

      // Only upload a file if a new image was selected
      if (data.image && data.image[0]) {
        try {
          const file = await appwriteService.uploadFile(data.image[0]);
          if (file && file.$id) {
            fileId = file.$id;
            console.log("File uploaded successfully with ID:", fileId);
          }
        } catch (fileError) {
          console.error("File upload error:", fileError);
          setError("Error uploading image. " + fileError.message);
          setLoading(false);
          return;
        }
      }

      const postData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        featuredImage: fileId,
      };

      console.log("Submitting Post Data:", postData);

      if (post) {
        // Update existing post
        const updatedPost = await appwriteService.updatePost(
          post.$id,
          postData
        );
        if (updatedPost) {
          console.log("Post updated successfully:", updatedPost);
          navigate("/");
        }
      } else {
        // Create new post
        const newPost = await appwriteService.createPost(postData);
        if (newPost) {
          console.log("Post created successfully:", newPost);
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Submit Error:", error);
      setError(error.message || "Failed to save post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated && !loading) {
    return (
      <div className="p-4 text-center">
        <div className="p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
          You must be logged in to create posts.
        </div>
        <Button onClick={() => navigate("/login")}>Login</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      {error && (
        <div className="w-full p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: "Slug is required" })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}

        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
        {errors.content && (
          <p className="text-red-500">{errors.content.message}</p>
        )}
      </div>

      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {errors.image && <p className="text-red-500">{errors.image.message}</p>}

        {post && post.featuredImage && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        {errors.status && <p className="text-red-500">Status is required</p>}

        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
          disabled={loading}
        >
          {loading ? "Saving..." : post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
