import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../components";
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from "react-router-dom";

function EditPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      setLoading(true);
      appwriteService
        .getPost(slug)
        .then((post) => {
          if (post) {
            setPost(post);
          } else {
            setError("Post not found");
            setTimeout(() => navigate("/"), 2000);
          }
        })
        .catch((err) => {
          console.error("Error fetching post for edit:", err);
          setError(`Failed to load post: ${err.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="py-8">
        <Container>
          <div className="text-center">
            <p>Loading post for editing...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <Container>
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </Container>
      </div>
    );
  }

  return post ? (
    <div className="py-8">
      <Container>
        <h1 className="text-2xl font-bold mb-8 text-center">Edit Post</h1>
        <PostForm post={post} />
      </Container>
    </div>
  ) : null;
}

export default EditPost;
