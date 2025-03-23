import conf from "../conf/conf.js";

/**
 * Utility to diagnose common Appwrite configuration issues
 */
export default class AppwriteChecker {
  static async checkConfiguration() {
    console.log("⭐ Checking Appwrite configuration...");
    console.log("Project ID:", conf.appwriteProjectId);
    console.log("Database ID:", conf.appwriteDatabaseId);
    console.log("Collection ID:", conf.appwriteCollectionId);
    console.log("Bucket ID:", conf.appwriteBucketId);
    console.log("API Endpoint:", conf.appwriteUrl);

    // Check if any configuration is missing
    const missingConfigs = [];
    if (!conf.appwriteProjectId) missingConfigs.push("Project ID");
    if (!conf.appwriteDatabaseId) missingConfigs.push("Database ID");
    if (!conf.appwriteCollectionId) missingConfigs.push("Collection ID");
    if (!conf.appwriteBucketId) missingConfigs.push("Bucket ID");
    if (!conf.appwriteUrl) missingConfigs.push("API Endpoint");

    if (missingConfigs.length > 0) {
      console.error(
        "❌ Missing configuration items:",
        missingConfigs.join(", ")
      );
      return {
        status: "error",
        message: "Missing configuration: " + missingConfigs.join(", "),
        fixes: [
          "Check your conf.js file and ensure all IDs are correctly defined",
          "Verify that your environment variables are properly set if using .env",
        ],
      };
    }

    console.log("✅ Configuration looks complete");
    return {
      status: "success",
      message: "Configuration looks complete",
    };
  }

  static getPermissionsGuide() {
    return {
      title: "Required Appwrite Permissions",
      steps: [
        {
          title: "Set Collection Permissions",
          instructions: [
            "1. Log in to your Appwrite Console",
            "2. Navigate to your database → collections → your posts collection",
            "3. Go to the Settings tab → Permissions",
            "4. Make sure you have the following permissions set:",
          ],
          permissions: [
            {
              role: "any",
              type: "read",
              description: "Allows non-logged-in users to read posts",
            },
            {
              role: "users",
              type: "create",
              description: "Allows logged-in users to create posts",
            },
            {
              role: "users",
              type: "read",
              description: "Allows logged-in users to read posts",
            },
            {
              role: "document:user",
              type: "update",
              description: "Allows users to update only their own posts",
            },
            {
              role: "document:user",
              type: "delete",
              description: "Allows users to delete only their own posts",
            },
          ],
        },
        {
          title: "Set Bucket Permissions",
          instructions: [
            "1. Navigate to Storage → your bucket",
            "2. Go to the Settings tab → Permissions",
            "3. Make sure you have the following permissions set:",
          ],
          permissions: [
            {
              role: "any",
              type: "read",
              description: "Allows anyone to view images",
            },
            {
              role: "users",
              type: "create",
              description: "Allows logged-in users to upload images",
            },
            {
              role: "document:user",
              type: "delete",
              description: "Allows users to delete only their own images",
            },
          ],
        },
      ],
    };
  }
}
