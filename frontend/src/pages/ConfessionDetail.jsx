import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ConfessionDetail = () => {
  const { id } = useParams();
  const [confession, setConfession] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [confessionRes, postsRes] = await Promise.all([
        api.get(`/confessions/${id}/`),
        api.get(`/confessions/${id}/get_posts/`),
      ]);
      setConfession(confessionRes.data);
      setPosts(postsRes.data);
    } catch (error) {
      console.error('Malumotlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      alert('Tizimga kirishingiz kerak!');
      return;
    }

    try {
      if (confession.is_subscribed) {
        await api.post(`/confessions/${id}/unsubscribe/`);
      } else {
        await api.post(`/confessions/${id}/subscribe/`);
      }
      loadData();
    } catch (error) {
      console.error('Obuna xatolik:', error);
    }
  };

  const handleLike = async (postId, isLiked) => {
    if (!isAuthenticated) {
      alert('Tizimga kirishingiz kerak!');
      return;
    }

    try {
      if (isLiked) {
        await api.post(`/posts/${postId}/unlike/`);
      } else {
        await api.post(`/posts/${postId}/like/`);
      }
      loadData();
    } catch (error) {
      console.error('Like xatolik:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl">Yuklanmoqda...</div>
      </div>
    );
  }

  if (!confession) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl text-gray-600">Konfessiya topilmadi</h2>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Bosh sahifaga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="card mb-8">
        <div className="flex items-center gap-6">
          {confession.icon && (
            <img
              src={confession.icon}
              alt={confession.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-3">{confession.name}</h1>
            <p className="text-gray-600 mb-4 text-lg">{confession.description}</p>
            <div className="flex items-center gap-6 text-gray-600">
              <span>{confession.subscribers_count || 0} obunachi</span>
              <span>{confession.posts_count || 0} post</span>
            </div>
          </div>
          {isAuthenticated && (
            <button
              onClick={handleSubscribe}
              className={`px-8 py-3 rounded-lg font-bold ${
                confession.is_subscribed
                  ? 'bg-gray-200 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {confession.is_subscribed ? 'Obuna bekor qilish' : 'Obuna bolish'}
            </button>
          )}
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-6">Postlar</h2>

      {posts.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-xl text-gray-600">Hozircha postlar yoq</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="card">
              <div className="mb-4 text-sm text-gray-500">
                <span>{post.author_info?.username}</span>
                <span className="mx-2">•</span>
                <span>{new Date(post.created_at).toLocaleDateString('uz-UZ')}</span>
              </div>

              <h3 className="text-2xl font-bold mb-3">{post.title}</h3>
              <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

              {post.image && (
                <img src={post.image} alt={post.title} className="w-full rounded-lg mb-4" />
              )}

              <div className="flex items-center gap-8 border-t pt-4">
                <button
                  onClick={() => handleLike(post.id, post.is_liked)}
                  className={`flex items-center gap-2 ${
                    post.is_liked ? 'text-red-500' : 'hover:text-red-500'
                  }`}
                >
                  {post.is_liked ? '❤️' : '🤍'} {post.likes_count || 0}
                </button>
                <span className="flex items-center gap-2">
                  💬 {post.comments_count || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfessionDetail;
