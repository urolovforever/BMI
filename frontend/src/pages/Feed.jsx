import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import postService from '../services/postService';
import { useAuth } from '../context/AuthContext';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const data = await postService.getFeed();
      setPosts(data.results || data);
    } catch (error) {
      console.error('Feedni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await postService.unlike(postId);
      } else {
        await postService.like(postId);
      }
      loadFeed(); // Qayta yuklash
    } catch (error) {
      console.error('Like xatolik:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Mening Feedim</h1>

      {posts.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">
            Hozircha feedda postlar yo'q. Konfessiyalarga obuna bo'ling!
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Konfessiyalarni ko'rish
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div>
                <Link
                  to={`/confession/${post.confession}`}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {post.confession_info?.name}
                </Link>
                <p className="text-sm text-gray-500">
                  {post.author_info?.username} • {new Date(post.created_at).toLocaleDateString('uz-UZ')}
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-3">{post.title}</h2>
            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full rounded-lg mb-4"
              />
            )}

            <div className="flex items-center gap-6 text-gray-600 border-t pt-4">
              <button
                onClick={() => handleLike(post.id, post.is_liked)}
                className={`flex items-center gap-2 ${
                  post.is_liked ? 'text-red-500' : 'hover:text-red-500'
                }`}
              >
                {post.is_liked ? '❤️' : '🤍'} {post.likes_count}
              </button>
              <span className="flex items-center gap-2">
                💬 {post.comments_count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
