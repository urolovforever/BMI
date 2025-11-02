import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const response = await api.get('/posts/feed/');
      setPosts(response.data.results || response.data);
    } catch (error) {
      console.error('Feed yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await api.post(`/posts/${postId}/unlike/`);
      } else {
        await api.post(`/posts/${postId}/like/`);
      }
      loadFeed();
    } catch (error) {
      console.error('Like xatolik:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-gray-600">⏳ Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">📰 Mening Feedim</h1>

      {posts.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl text-gray-600 mb-6">
            Hozircha feedda postlar yo'q. Konfessiyalarga obuna bo'ling!
          </p>
          <Link
            to="/"
            className="inline-block btn-primary px-8 py-3 text-lg"
          >
            Konfessiyalarni ko'rish
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Link
                  to={`/confession/${post.confession}`}
                  className="text-blue-600 hover:underline font-bold text-lg"
                >
                  {post.confession_info?.name}
                </Link>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500">
                  {post.author_info?.username} • 
                  {new Date(post.created_at).toLocaleDateString('uz-UZ', { 
                    year: 'numeric', month: 'long', day: 'numeric' 
                  })}
                </span>
              </div>

              <h2 className="text-3xl font-bold mb-4 text-gray-800">{post.title}</h2>
              <p className="text-gray-700 mb-4 whitespace-pre-wrap text-lg leading-relaxed">
                {post.content}
              </p>

              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full rounded-lg mb-4 shadow-md"
                />
              )}

              <div className="flex items-center gap-8 text-gray-600 border-t pt-4 mt-4">
                <button
                  onClick={() => handleLike(post.id, post.is_liked)}
                  className={`flex items-center gap-2 text-lg font-semibold transition-colors ${
                    post.is_liked ? 'text-red-500' : 'hover:text-red-500'
                  }`}
                >
                  {post.is_liked ? '❤️' : '🤍'} <span>{post.likes_count || 0}</span>
                </button>
                <span className="flex items-center gap-2 text-lg">
                  💬 <span>{post.comments_count || 0}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
