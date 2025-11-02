import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
            🕌 Diniy Platformasi
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-blue-200 transition-colors font-medium">
              Bosh sahifa
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/feed" className="hover:text-blue-200 transition-colors font-medium">
                  📰 Feedim
                </Link>
                <div className="flex items-center gap-4">
                  <div className="text-sm bg-blue-700 px-3 py-1 rounded-full">
                    👤 {user?.username}
                    {user?.role === 'superadmin' && ' (SuperAdmin)'}
                    {user?.role === 'confession_admin' && ' (Admin)'}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    Chiqish
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-200 transition-colors font-medium"
                >
                  Kirish
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
