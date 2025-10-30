import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import confessionService from '../services/confessionService';
import postService from '../services/postService';
import { useAuth } from '../context/AuthContext';

const ConfessionDetail = () => {
  const { id } = useParams();
  const [confession, setConfession] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadConfessionData();
  }, [id]);

  const loadConfessionData = async () => {
    try {
      const [confessionData, postsData] = await Promise.all([
        confessionService.getById(id),
        confessionService.getPosts(id),
      ]);
      setConfession(confessionData);
      setPosts(postsData);
    } catch (error) {
      console.error('Ma\'lumotlarni yuklashda xatolik:', error);
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
        await confessionService.unsubscribe(id);
      } else {
        await confessionService.subscribe(id);
      }
      loadConfessionData();
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
        await postService.unlike(postId);
      } else {
        await postService.like(postId);
      }
      loadConfessionData();
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

  if (!confession) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Konfessiya topilmadi</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center gap-6">
          {confession.icon && (
            <img
              src={confession.icon}
              alt={confession.name}
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{confession.name}</h1>
            <p className="text-gray-600 mb-4">{confession.description}</p>
            <div className="flex items-center gap-4 text-gray-600">
              <span>Obunachi: {confession.subscribers_count}</span>
              <span>Post: {confession.posts_count}</span>
            </div>
          </div>
          {isAuthenticated && (
            <button
              onClick={handleSubscribe}
              className={`px-6 py-2 rounded-lg font-semibold ${
                confession.is_subscribed
                  ? 'bg-gray-200 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {confession.is_subscribed ? 'Obunani bekor qilish' : 'Obuna bo\'lish'}
            </button>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Postlar</h2>

      {posts.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          Hozircha postlar yo'q
        </div>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <p className="text-sm text-gray-500">
                {post.author_info?.username} • {new Date(post.created_at).toLocaleDateString('uz-UZ')}
              </p>
            </div>

            <h3 className="text-2xl font-bold mb-3">{post.title}</h3>
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

export default ConfessionDetail;
