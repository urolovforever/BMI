import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold">
            Diniy Platformasi
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-blue-200 transition-colors">
              Bosh sahifa
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/feed" className="hover:text-blue-200 transition-colors">
                  Mening Feedim
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-sm">
                    {user?.username} ({user?.role === 'superadmin' ? 'SuperAdmin' : user?.role === 'confession_admin' ? 'Admin' : 'Foydalanuvchi'})
                  </span>
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    Chiqish
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-200 transition-colors"
                >
                  Kirish
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
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
