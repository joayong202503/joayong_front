import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 border border-gray-100 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center mb-6 text-brand-purple">어플리케이션</h1>
        
        {user ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">환영합니다</p>
              <p className="font-medium">{user.username}님</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            
            <Button 
              onClick={handleLogout}
              className="w-full bg-brand-blue hover:bg-brand-lightBlue auth-button"
            >
              로그아웃
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-gray-600 mb-4">
              로그인하거나 계정을 만들어 시작하세요
            </p>
            
            <Button 
              onClick={handleLoginClick}
              className="w-full bg-brand-blue hover:bg-brand-lightBlue auth-button"
            >
              로그인
            </Button>
            
            <Button 
              onClick={handleSignupClick}
              variant="outline"
              className="w-full border-brand-blue text-brand-blue hover:bg-gray-50"
            >
              회원가입
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
