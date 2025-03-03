import { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await appwriteService.getPosts();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      {posts.length > 0 ? (
        posts.map((post) => <div key={post.$id}>{post.title}</div>)
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
};

export default Home;
