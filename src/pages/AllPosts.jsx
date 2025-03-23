import { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function AllPosts() {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);

        if (!userData) {
          setError("You must be logged in to view your posts");
          setLoading(false);
          return;
        }

        console.log("Fetching posts for user ID:", userData.$id);

        // ONLY get the current user's posts
        const userPostsData = await appwriteService.getUserPosts();
        console.log("User Posts Data:", userPostsData);

        if (Array.isArray(userPostsData)) {
          setUserPosts(userPostsData);
        } else {
          console.error("Unexpected format for user posts:", userPostsData);
          setError("Failed to load your posts. Unexpected data format.");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError(
          "Failed to load your posts: " + (error.message || "Unknown error")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [userData]);

  if (loading) {
    return (
      <div className="w-full py-8">
        <Container>
          <div className="text-center py-10">
            <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your posts...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-8">
        <Container>
          <div className="text-center py-10">
            <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-2xl mx-auto">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">My Posts</h1>
          <Link
            to="/add-post"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Create New Post
          </Link>
        </div>

        {/* No posts message */}
        {userPosts.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              You Haven't Created Any Posts Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start sharing your thoughts with the community!
            </p>

            <Link
              to="/add-post"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Create Your First Post
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPosts.map((post) => (
            <div key={post.$id} className="h-full">
              <PostCard {...post} />
              <div className="mt-2 flex justify-end space-x-2">
                <Link
                  to={`/edit-post/${post.$id}`}
                  className="text-sm text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600"
                >
                  Edit
                </Link>
                <Link
                  to={`/post/${post.$id}`}
                  className="text-sm text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;
