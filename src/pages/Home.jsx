import { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";
import { Link, useSearchParams } from "react-router-dom";
import AppwriteChecker from "../utils/AppwriteChecker";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [configStatus, setConfigStatus] = useState(null);

  // Get search param from URL if present
  const [searchParams] = useSearchParams();
  const urlSearchTerm = searchParams.get("search") || "";

  useEffect(() => {
    // Check Appwrite configuration first
    const checkConfig = async () => {
      const status = await AppwriteChecker.checkConfiguration();
      setConfigStatus(status);

      if (status.status === "success") {
        fetchPosts();
      }
    };

    const fetchPosts = async () => {
      try {
        setLoading(true);
        console.log("Fetching posts for home page...");

        // Get all posts
        const postsData = await appwriteService.getPosts();
        console.log("Home - Posts Data:", postsData);

        if (Array.isArray(postsData)) {
          setPosts(postsData);

          // Apply search filter if URL has search param
          if (urlSearchTerm) {
            setSearchTerm(urlSearchTerm);
            const filtered = postsData.filter((post) =>
              post.title.toLowerCase().includes(urlSearchTerm.toLowerCase())
            );
            setFilteredPosts(filtered);
          } else {
            setFilteredPosts(postsData);
          }

          // Set featured posts (top 3 most recent)
          setFeaturedPosts(postsData.slice(0, 3));
        } else {
          console.error("Unexpected response format:", postsData);
          setError("Failed to load posts. Unexpected data format.");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts: " + (err.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    checkConfig();
  }, [urlSearchTerm]);

  // Handle search input changes
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) =>
        post.title.toLowerCase().includes(term)
      );
      setFilteredPosts(filtered);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Container>
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blog posts...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (configStatus?.status === "error") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Container>
          <div className="py-8 max-w-3xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-red-800">
                    Configuration Error
                  </h3>
                  <p className="text-red-700">{configStatus.message}</p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4">Suggested Fixes:</h2>
            <ul className="list-disc pl-5 space-y-2 mb-8">
              {configStatus.fixes.map((fix, index) => (
                <li key={index} className="text-gray-800">
                  {fix}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Container>
          <div className="py-8 max-w-3xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-red-800">
                    Error Loading Posts
                  </h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>

            {/* Permission Guide */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">
                Appwrite Permissions Guide
              </h2>
              <p className="mb-4">
                Your blog posts aren't showing up because Appwrite permissions
                need to be configured correctly.
              </p>

              {AppwriteChecker.getPermissionsGuide().steps.map(
                (step, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    {step.instructions.map((instruction, i) => (
                      <p key={i} className="mb-1">
                        {instruction}
                      </p>
                    ))}

                    <div className="mt-3 bg-gray-50 p-4 rounded-md">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="text-left font-medium text-gray-600 py-2">
                              Role
                            </th>
                            <th className="text-left font-medium text-gray-600 py-2">
                              Type
                            </th>
                            <th className="text-left font-medium text-gray-600 py-2">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {step.permissions.map((perm, permIndex) => (
                            <tr
                              key={permIndex}
                              className="border-t border-gray-200"
                            >
                              <td className="py-2 font-mono text-sm">
                                {perm.role}
                              </td>
                              <td className="py-2 text-blue-600">
                                {perm.type}
                              </td>
                              <td className="py-2 text-gray-700">
                                {perm.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              )}

              <p className="text-sm text-gray-600 mt-4">
                After setting these permissions, refresh your page to see the
                changes.
              </p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug information for zero posts */}
      {posts.length === 0 && (
        <div className="bg-yellow-50 border-t border-b border-yellow-400 p-4">
          <Container>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-yellow-800">
                  No Posts Found
                </h3>
                <div className="mt-2 text-yellow-700">
                  <p>This could be due to:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>No posts exist in your collection yet</li>
                    <li>
                      Appwrite permissions are not set to allow "any" role to
                      read posts
                    </li>
                    <li>
                      Only inactive posts exist (we only show posts with
                      status="active")
                    </li>
                  </ul>

                  <p className="mt-3">
                    <a
                      href="/add-post"
                      className="font-medium underline text-yellow-800 hover:text-yellow-900"
                    >
                      Create your first post
                    </a>{" "}
                    or check the Appwrite permissions settings.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </div>
      )}

      {/* Hero Section with Featured Posts */}
      {featuredPosts.length > 0 && !searchTerm && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-12">
          <Container>
            <h1 className="text-4xl font-bold mb-6 text-center">
              Welcome to the Blog
            </h1>
            <p className="text-xl mb-12 text-center max-w-3xl mx-auto">
              Discover insightful articles, tutorials, and stories from our
              community.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {featuredPosts.map((post) => (
                <div
                  key={post.$id}
                  className="transform transition duration-300 hover:scale-105"
                >
                  <Link to={`/post/${post.$id}`}>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg h-full">
                      {post.featuredImage && (
                        <img
                          src={appwriteService.getFilePreview(
                            post.featuredImage
                          )}
                          alt={post.title}
                          className="w-full h-40 object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/300x200?text=Blog+Post";
                          }}
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                        <p className="text-white/70 text-sm">
                          {new Date(post.$createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </Container>
        </div>
      )}

      {/* Search and Posts Section */}
      <Container>
        <div className="py-10">
          {/* Search Bar */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts by title..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-4 pl-12 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilteredPosts(posts);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>

            {searchTerm && (
              <p className="mt-2 text-sm text-gray-600 pl-2">
                Found {filteredPosts.length}{" "}
                {filteredPosts.length === 1 ? "result" : "results"} for "
                {searchTerm}"
              </p>
            )}
          </div>

          {/* Posts Grid */}
          <h2 className="text-2xl font-bold mb-6">
            {searchTerm ? "Search Results" : "Latest Posts"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post.$id} className="h-full">
                  <PostCard {...post} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                {searchTerm ? (
                  <div>
                    <p className="text-gray-500">
                      No posts found matching "{searchTerm}"
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setFilteredPosts(posts);
                      }}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No posts available. Check back soon!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Home;
