import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";
import authService from "./auth";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost(postData) {
    try {
      const currentUser = await authService.getCurrentUser();

      if (!currentUser) {
        console.error("User not authenticated! Cannot create post.");
        throw new Error("User not authenticated");
      }

      // Ensure we have a slug
      const slug = postData.slug || ID.unique();

      const response = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title: postData.title,
          content: postData.content,
          featuredImage: postData.featuredImage,
          status: postData.status,
          user: currentUser.$id, // Make sure this matches the field name in Appwrite
        }
      );

      console.log("Post Created Successfully:", response);
      return response;
    } catch (error) {
      console.error("Appwrite Service :: createPost :: error", error);
      throw error;
    }
  }

  async updatePost(slug, postData) {
    try {
      // First check if the user owns this post
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        throw new Error("User not authenticated!");
      }

      // Get the post to check ownership
      const post = await this.getPost(slug);
      if (!post) {
        throw new Error("Post not found");
      }

      // Check if current user is the author
      if (post.user !== currentUser.$id) {
        throw new Error("You don't have permission to update this post");
      }

      const response = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title: postData.title,
          content: postData.content,
          featuredImage: postData.featuredImage,
          status: postData.status,
        }
      );
      console.log("Post Updated Successfully:", response);
      return response;
    } catch (error) {
      console.error("Appwrite Service :: updatePost :: error", error);
      throw error;
    }
  }

  async getPost(slug) {
    try {
      const post = await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      console.log("Fetched individual post:", post);
      return post;
    } catch (error) {
      console.error("Appwrite Service :: getPost :: error", error);
      return null;
    }
  }

  async getPosts() {
    try {
      console.log(
        "Getting all posts with database ID:",
        conf.appwriteDatabaseId
      );
      console.log("Collection ID:", conf.appwriteCollectionId);

      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal("status", "active"), Query.orderDesc("$createdAt")]
      );

      console.log("Fetched All Posts Response:", response);
      return response.documents || [];
    } catch (error) {
      console.error("Appwrite Service :: getPosts :: error", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return [];
    }
  }

  // Method to get only the current user's posts
  async getUserPosts() {
    try {
      const currentUser = await authService.getCurrentUser();

      if (!currentUser) {
        console.log("No user logged in");
        return [];
      }

      console.log("Getting posts for user:", currentUser.$id);

      // Query posts where the user field equals the current user's ID
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal("user", currentUser.$id), Query.orderDesc("$createdAt")]
      );

      console.log("Fetched User Posts Response:", response);
      if (response && response.documents) {
        return response.documents;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Appwrite Service :: getUserPosts :: error", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return [];
    }
  }
  async deletePost(slug) {
    try {
      // First check if the user owns this post
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        throw new Error("User not authenticated!");
      }

      // Get the post to check ownership
      const post = await this.getPost(slug);
      if (!post) {
        throw new Error("Post not found");
      }

      // Check if current user is the author
      if (post.user !== currentUser.$id) {
        throw new Error("You don't have permission to delete this post");
      }

      const status = await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      console.log("Post Deleted Successfully");
      return status;
    } catch (error) {
      console.error("Appwrite Service :: deletePost :: error", error);
      throw error;
    }
  }

  async uploadFile(file) {
    try {
      const response = await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
      console.log("File Uploaded Successfully:", response);
      return response;
    } catch (error) {
      console.error("Appwrite Service :: uploadFile :: error", error);
      throw error;
    }
  }

  async deleteFile(fileId) {
    try {
      const status = await this.bucket.deleteFile(
        conf.appwriteBucketId,
        fileId
      );
      console.log("File Deleted Successfully");
      return status;
    } catch (error) {
      console.error("Appwrite Service :: deleteFile :: error", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    if (!fileId) return null;

    try {
      return this.bucket.getFilePreview(
        conf.appwriteBucketId,
        fileId,
        2000, // width
        1000, // height
        "center", // gravity
        100 // quality
      );
    } catch (error) {
      console.error("Appwrite Service :: getFilePreview :: error", error);
      return null;
    }
  }
}

const service = new Service();
export default service;
