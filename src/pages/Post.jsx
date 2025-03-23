import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  // Check if the current user is the author (using 'user' field instead of 'userId')
  const isAuthor = post && userData ? post.user === userData.$id : false;

  useEffect(() => {
    if (slug) {
      setLoading(true);
      appwriteService
        .getPost(slug)
        .then((post) => {
          if (post) {
            setPost(post);
            console.log("Post data:", post); // For debugging
          } else {
            setError("Post not found");
            setTimeout(() => navigate("/"), 2000);
          }
        })
        .catch((err) => {
          console.error("Error fetching post:", err);
          setError(`Failed to load post: ${err.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  const deletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      appwriteService
        .deletePost(post.$id)
        .then((status) => {
          if (status) {
            if (post.featuredImage) {
              appwriteService.deleteFile(post.featuredImage);
            }
            navigate("/");
          }
        })
        .catch((err) => {
          console.error("Error deleting post:", err);
          alert(`Failed to delete post: ${err.message}`);
        });
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="py-8 text-center">
          <p>Loading post...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </Container>
    );
  }

  return post ? (
    <div className="py-8">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="w-full mb-8 relative border rounded-xl p-2 bg-white shadow-md">
            {post.featuredImage ? (
              <img
                src={appwriteService.getFilePreview(post.featuredImage)}
                alt={post.title}
                className="rounded-xl w-full aspect-video object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/1200x600?text=Image+Not+Available";
                }}
              />
            ) : (
              <div className="w-full aspect-video bg-gray-200 flex items-center justify-center rounded-xl">
                <span className="text-gray-400">No image available</span>
              </div>
            )}

            {isAuthor && (
              <div className="absolute right-6 top-6">
                <Link to={`/edit-post/${post.$id}`}>
                  <Button bgColor="bg-green-500" className="mr-3">
                    Edit
                  </Button>
                </Link>
                <Button bgColor="bg-red-500" onClick={deletePost}>
                  Delete
                </Button>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              {post.title}
            </h1>

            <div className="text-sm text-gray-500 mb-6">
              Posted on {new Date(post.$createdAt).toLocaleDateString()}
            </div>

            <div className="prose prose-lg max-w-none">
              {post.content ? parse(post.content) : <p>No content available</p>}
            </div>
          </div>
        </div>
      </Container>
    </div>
  ) : null;
}
