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

  async createPost({ title, slug, content, featuredImage, status }) {
    try {
      const currentUser = await authService.getCurrentUser(); // Fetch user ID

      if (!currentUser) {
        console.error("User not authenticated! Cannot create post.");
        return null;
      }

      const response = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug || ID.unique(),
        {
          title,
          content,
          featuredImage,
          status,
          userId: currentUser.$id, // Use the authenticated user ID
        }
      );

      console.log("Post Created Successfully:", response);
      return response;
    } catch (error) {
      console.error("Appwrite Service :: createPost :: error", error);
      return null;
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      const response = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
      console.log("Post Updated Successfully:", response);
      return response;
    } catch (error) {
      console.error("Appwrite Service :: updatePost :: error", error);
      return null;
    }
  }

  async getPosts() {
    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId
      );
      console.log("Fetched Posts:", response);
      return response?.documents || []; // Ensure an array is returned
    } catch (error) {
      console.error("Appwrite Service :: getPosts :: error", error);
      return []; // Return an empty array instead of undefined
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
      return null;
    }
  }
}

const service = new Service();
export default service;
