import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import confessionService from '../services/confessionService';

const Home = () => {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfessions();
  }, []);

  const loadConfessions = async () => {
    try {
      const data = await confessionService.getAll();
      setConfessions(data.results || data);
    } catch (error) {
      console.error('Konfessiyalarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Diniy Konfessiyalar Platformasi</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {confessions.map((confession) => (
          <Link
            key={confession.id}
            to={`/confession/${confession.id}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            {confession.icon && (
              <img
                src={confession.icon}
                alt={confession.name}
                className="w-20 h-20 mx-auto mb-4 rounded-full object-cover"
              />
            )}
            <h3 className="text-xl font-semibold text-center mb-2">{confession.name}</h3>
            <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2">
              {confession.description}
            </p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Obunachi: {confession.subscribers_count}</span>
              <span>Post: {confession.posts_count}</span>
            </div>
          </Link>
        ))}
      </div>

      {confessions.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          Hozircha konfessiyalar yo'q
        </div>
      )}
    </div>
  );
};

export default Home;
