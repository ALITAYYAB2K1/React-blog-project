import React, { useState, useEffect } from "react";
import { Container } from "./index";
import appwriteService from "../appwrite/config";
import conf from "../conf/conf";

function AppwriteDebug() {
  const [checking, setChecking] = useState(true);
  const [dbStatus, setDbStatus] = useState(null);
  const [collectionStatus, setCollectionStatus] = useState(null);
  const [bucketStatus, setBucketStatus] = useState(null);
  const [postsData, setPostsData] = useState(null);
  const [confData, setConfData] = useState({
    appwriteUrl: conf.appwriteUrl,
    appwriteProjectId: conf.appwriteProjectId,
    appwriteDatabaseId: conf.appwriteDatabaseId,
    appwriteCollectionId: conf.appwriteCollectionId,
    appwriteBucketId: conf.appwriteBucketId,
  });

  useEffect(() => {
    const runDiagnostics = async () => {
      try {
        setChecking(true);

        // Check if we can fetch any posts at all
        console.log("Attempting to fetch posts...");
        const posts = await appwriteService.getPosts();
        setPostsData({
          count: Array.isArray(posts) ? posts.length : 0,
          sample: Array.isArray(posts) && posts.length > 0 ? posts[0] : null,
        });

        // Set statuses based on fetch results
        setDbStatus("connected");
        setCollectionStatus("accessible");
        setBucketStatus("unknown"); // We can't easily check this
      } catch (error) {
        console.error("Diagnostics error:", error);
        // Try to determine what failed
        if (error.message.includes("database")) {
          setDbStatus("error");
        } else if (error.message.includes("collection")) {
          setDbStatus("connected");
          setCollectionStatus("error");
        } else {
          setDbStatus("unknown");
          setCollectionStatus("unknown");
        }
      } finally {
        setChecking(false);
      }
    };

    runDiagnostics();
  }, []);

  return (
    <Container>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden my-10">
        <div className="bg-gradient-to-r from-red-600 to-orange-500 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Appwrite Debugger</h2>
          <p className="text-red-100">Diagnose why posts aren't showing up</p>
        </div>

        <div className="p-6">
          {checking ? (
            <div className="flex items-center justify-center p-6">
              <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
              <span className="ml-3">Running diagnostics...</span>
            </div>
          ) : (
            <>
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  Configuration Values
                </h3>
                <div className="bg-gray-50 p-4 rounded overflow-x-auto">
                  <pre className="text-sm">
                    {JSON.stringify(confData, null, 2)}
                  </pre>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  Connection Status
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">
                          Component
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b border-gray-200">
                          Database
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              dbStatus === "connected"
                                ? "bg-green-100 text-green-800"
                                : dbStatus === "error"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {dbStatus === "connected"
                              ? "Connected"
                              : dbStatus === "error"
                              ? "Error"
                              : "Unknown"}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b border-gray-200">
                          Collection
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              collectionStatus === "accessible"
                                ? "bg-green-100 text-green-800"
                                : collectionStatus === "error"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {collectionStatus === "accessible"
                              ? "Accessible"
                              : collectionStatus === "error"
                              ? "Error"
                              : "Unknown"}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b border-gray-200">
                          Bucket
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800`}
                          >
                            Not checked
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Posts Data</h3>
                {postsData ? (
                  <div>
                    <p className="mb-2">
                      Number of posts found: <strong>{postsData.count}</strong>
                    </p>

                    {postsData.count === 0 ? (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <p className="text-yellow-700">
                          No posts were found. This could be because:
                        </p>
                        <ul className="list-disc ml-5 mt-2 text-yellow-700">
                          <li>There are no posts in your collection</li>
                          <li>All posts have status="inactive"</li>
                          <li>Permission issues are preventing access</li>
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <p className="mb-2">Sample post data:</p>
                        <div className="bg-gray-50 p-4 rounded overflow-x-auto">
                          <pre className="text-sm">
                            {JSON.stringify(postsData.sample, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <p className="text-red-700">
                      Could not fetch posts data due to an error.
                    </p>
                  </div>
                )}
              </section>

              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Fix Permissions</h3>
                <p className="mb-4">
                  To fix permissions issues with your Appwrite collections and
                  buckets, follow these steps:
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Collection Permissions
                  </h4>
                  <ol className="list-decimal ml-5 text-blue-700">
                    <li>Go to your Appwrite Console</li>
                    <li>
                      Navigate to Databases → Select your database → Collections
                      → Select your posts collection
                    </li>
                    <li>Click the Settings tab → Permissions</li>
                    <li>
                      Add these permissions:
                      <ul className="list-disc ml-5 mt-1">
                        <li>
                          <code className="bg-blue-100 px-1 rounded">any</code>{" "}
                          with{" "}
                          <code className="bg-blue-100 px-1 rounded">read</code>{" "}
                          permission - allows all users to read posts
                        </li>
                        <li>
                          <code className="bg-blue-100 px-1 rounded">
                            users
                          </code>{" "}
                          with{" "}
                          <code className="bg-blue-100 px-1 rounded">read</code>{" "}
                          permission - allows logged-in users to read posts
                        </li>
                        <li>
                          <code className="bg-blue-100 px-1 rounded">
                            users
                          </code>{" "}
                          with{" "}
                          <code className="bg-blue-100 px-1 rounded">
                            create
                          </code>{" "}
                          permission - allows logged-in users to create posts
                        </li>
                        <li>
                          <code className="bg-blue-100 px-1 rounded">
                            document:user
                          </code>{" "}
                          with{" "}
                          <code className="bg-blue-100 px-1 rounded">
                            update
                          </code>{" "}
                          and{" "}
                          <code className="bg-blue-100 px-1 rounded">
                            delete
                          </code>{" "}
                          permissions - allows users to manage their own posts
                        </li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Storage Bucket Permissions
                  </h4>
                  <ol className="list-decimal ml-5 text-green-700">
                    <li>Go to your Appwrite Console</li>
                    <li>Navigate to Storage → Select your bucket</li>
                    <li>Click the Settings tab → Permissions</li>
                    <li>
                      Add these permissions:
                      <ul className="list-disc ml-5 mt-1">
                        <li>
                          <code className="bg-green-100 px-1 rounded">any</code>{" "}
                          with{" "}
                          <code className="bg-green-100 px-1 rounded">
                            read
                          </code>{" "}
                          permission - allows all users to view images
                        </li>
                        <li>
                          <code className="bg-green-100 px-1 rounded">
                            users
                          </code>{" "}
                          with{" "}
                          <code className="bg-green-100 px-1 rounded">
                            create
                          </code>{" "}
                          permission - allows logged-in users to upload images
                        </li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </section>

              <section className="mb-4">
                <h3 className="text-lg font-semibold mb-4">
                  Collection Structure
                </h3>
                <p className="mb-4">
                  Ensure your posts collection has the correct attribute
                  structure:
                </p>

                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">
                          Attribute
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">
                          Type
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">
                          Required
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b border-gray-200">
                          <code>title</code>
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          String
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          Yes
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          Post title
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b border-gray-200">
                          <code>content</code>
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          String
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          No
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          Post content (HTML)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b border-gray-200">
                          <code>featuredImage</code>
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          String
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          No
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          Image ID from storage
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b border-gray-200">
                          <code>status</code>
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          String
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          Yes
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          Must be "active" to show
                        </td>
                      </tr>
                      <tr className="bg-yellow-50">
                        <td className="py-2 px-4 border-b border-gray-200">
                          <code>user</code>
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          String
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          Yes
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          User ID (author)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                  <p>
                    <strong>Important:</strong> Make sure the field that stores
                    the user ID is named{" "}
                    <code className="bg-yellow-100 px-1 rounded">user</code>{" "}
                    (not userId or anything else).
                  </p>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}

export default AppwriteDebug;
