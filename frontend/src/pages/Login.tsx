import { Auth } from '../components/Auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const handleAuth = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Auth onAuth={handleAuth} />
    </div>
  );
} 