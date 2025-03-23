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
          user: currentUser.$id, // Changed from userId to user to match collection schema
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
      const response = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title: postData.title,
          content: postData.content,
          featuredImage: postData.featuredImage,
          status: postData.status,
          // Note: We typically don't update the user field on updates
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
      throw error;
    }
  }

  async getPosts() {
    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [
          Query.equal("status", "active"), // Only fetch active posts
          Query.orderDesc("$createdAt"), // Sort by creation date, newest first
        ]
      );
      console.log("Fetched Posts:", response);
      return response;
    } catch (error) {
      console.error("Appwrite Service :: getPosts :: error", error);
      throw error;
    }
  }

  async deletePost(slug) {
    try {
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
