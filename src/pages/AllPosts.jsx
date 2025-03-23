import { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // "all" or "mine"

  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        // Get all posts for everyone to see
        const allPostsData = await appwriteService.getPosts();
        console.log("All Posts Data:", allPostsData);

        if (Array.isArray(allPostsData)) {
          setPosts(allPostsData);
        } else {
          console.error("Unexpected format for all posts:", allPostsData);
        }

        // Get user's posts if logged in
        if (userData) {
          const userPostsData = await appwriteService.getUserPosts();
          console.log("User Posts Data:", userPostsData);

          if (Array.isArray(userPostsData)) {
            setUserPosts(userPostsData);
          } else {
            console.error("Unexpected format for user posts:", userPostsData);
          }
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts: " + (error.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userData]);

  const displayPosts = activeTab === "all" ? posts : userPosts;

  if (loading) {
    return (
      <div className="w-full py-8">
        <Container>
          <div className="text-center py-10">
            <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
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
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Posts</h1>

          {userData && (
            <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-4 md:mb-0">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 ${
                  activeTab === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                All Posts
              </button>
              <button
                onClick={() => setActiveTab("mine")}
                className={`px-4 py-2 ${
                  activeTab === "mine"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                My Posts
              </button>
            </div>
          )}
        </div>

        {/* No posts message with debug info */}
        {displayPosts.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 text-center">
            {activeTab === "all" ? (
              <>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No Posts Found
                </h3>
                <p className="text-gray-600 mb-4">
                  There are no published posts to display.
                </p>

                {userData && (
                  <Link
                    to="/add-post"
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    Create the First Post
                  </Link>
                )}
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  You Haven't Created Any Posts
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
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayPosts.map((post) => (
            <div key={post.$id} className="h-full">
              <PostCard {...post} />

              {/* Show edit button for user's own posts */}
              {userData && post.user === userData.$id && (
                <div className="mt-2 flex justify-end">
                  <Link
                    to={`/edit-post/${post.$id}`}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;
