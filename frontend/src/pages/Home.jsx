import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Home = () => {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfessions();
  }, []);

  const loadConfessions = async () => {
    try {
      const response = await api.get('/confessions/');
      setConfessions(response.data.results || response.data);
    } catch (error) {
      console.error('Konfessiyalarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
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
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Diniy Konfessiyalar Platformasi
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          O'zingizga yoqqan diniy konfessiyalarga obuna bo'ling va yangiliklar oling
        </p>
      </div>

      {confessions.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-xl text-gray-600">Hozircha konfessiyalar yo'q</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {confessions.map((confession) => (
            <Link
              key={confession.id}
              to={`/confession/${confession.id}`}
              className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {confession.icon && (
                <div className="flex justify-center mb-4">
                  <img
                    src={confession.icon}
                    alt={confession.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                  />
                </div>
              )}
              <h3 className="text-xl font-bold text-center mb-2 text-gray-800">
                {confession.name}
              </h3>
              <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2">
                {confession.description || 'Tavsif yo\'q'}
              </p>
              <div className="flex justify-around text-sm border-t pt-3">
                <div className="text-center">
                  <div className="font-bold text-blue-600">{confession.subscribers_count || 0}</div>
                  <div className="text-gray-500">Obunachi</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-600">{confession.posts_count || 0}</div>
                  <div className="text-gray-500">Post</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
