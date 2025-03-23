import React from "react";
import { Container } from "./index";

function AppwriteGuide() {
  return (
    <Container>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden my-10">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white">
            Appwrite Configuration Guide
          </h2>
          <p className="text-blue-100">
            Follow these steps to fix visibility and permission issues
          </p>
        </div>

        <div className="p-6">
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              Step 1: Collection Permissions
            </h3>
            <p className="mb-4">
              To allow non-logged-in users to view posts and proper editing
              permissions:
            </p>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Log in to your Appwrite Console</li>
                <li>
                  Go to{" "}
                  <strong>
                    Databases → Your Database → Collections → Posts Collection
                  </strong>
                </li>
                <li>
                  Click on the <strong>Settings</strong> tab
                </li>
                <li>
                  Select <strong>Permissions</strong>
                </li>
                <li>Add or update these permissions:</li>
              </ol>

              <div className="overflow-x-auto mt-4">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Purpose
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 border-b border-gray-200 font-mono text-sm">
                        any
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 text-blue-600">
                        read
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        Allow anyone to view posts
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b border-gray-200 font-mono text-sm">
                        users
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 text-blue-600">
                        read
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        Allow logged in users to view posts
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b border-gray-200 font-mono text-sm">
                        users
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 text-blue-600">
                        create
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        Allow logged in users to create posts
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b border-gray-200 font-mono text-sm">
                        document:user
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 text-blue-600">
                        update
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        Allow users to update only their own posts
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b border-gray-200 font-mono text-sm">
                        document:user
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 text-blue-600">
                        delete
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        Allow users to delete only their own posts
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              Step 2: Storage Bucket Permissions
            </h3>
            <p className="mb-4">To allow images to be visible to everyone:</p>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Go to <strong>Storage → Your Bucket</strong>
                </li>
                <li>
                  Click on the <strong>Settings</strong> tab
                </li>
                <li>
                  Select <strong>Permissions</strong>
                </li>
                <li>Add or update these permissions:</li>
              </ol>

              <div className="overflow-x-auto mt-4">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Purpose
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 border-b border-gray-200 font-mono text-sm">
                        any
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 text-blue-600">
                        read
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        Allow anyone to view images
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b border-gray-200 font-mono text-sm">
                        users
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 text-blue-600">
                        create
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        Allow logged in users to upload images
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b border-gray-200 font-mono text-sm">
                        users
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 text-blue-600">
                        read
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        Allow logged in users to view images
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b border-gray-200 font-mono text-sm">
                        document:user
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 text-blue-600">
                        delete
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        Allow users to delete only their own images
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <h3 className="text-lg font-semibold mb-4">
              Step 3: Verify Collection Structure
            </h3>
            <p className="mb-4">
              Ensure your posts collection has these required attributes:
            </p>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <ul className="space-y-2">
                <li>
                  <strong>title</strong> - String (required)
                </li>
                <li>
                  <strong>content</strong> - String
                </li>
                <li>
                  <strong>featuredImage</strong> - String
                </li>
                <li>
                  <strong>status</strong> - String (required)
                </li>
                <li>
                  <strong>user</strong> - String (required) - references the
                  user ID
                </li>
              </ul>

              <div className="mt-4 text-sm text-gray-700">
                <p className="font-bold">Important:</p>
                <p>
                  Make sure the user field is named "user" (not "userId" or
                  something else)
                </p>
              </div>
            </div>
          </section>

          <div className="mt-6 text-sm text-gray-600">
            <p>
              After making these changes, refresh your page to see if posts are
              now visible.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default AppwriteGuide;
