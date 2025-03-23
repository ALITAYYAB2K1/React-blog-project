import React from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImage, content }) {
  // Generate a short excerpt from the content
  const createExcerpt = (htmlContent) => {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText;
    return textContent.length > 100
      ? textContent.substring(0, 100) + "..."
      : textContent;
  };

  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="w-full mb-4 overflow-hidden rounded-xl aspect-video">
          {featuredImage ? (
            <img
              src={appwriteService.getFilePreview(featuredImage)}
              alt={title}
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x200?text=Image+Not+Available";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-xl">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col">
          <h2 className="text-xl font-bold mb-2 text-gray-800">{title}</h2>
          {content && (
            <p className="text-gray-600 text-sm mb-3">
              {createExcerpt(content)}
            </p>
          )}
          <div className="mt-auto">
            <span className="text-blue-500 text-sm font-medium">Read more</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
