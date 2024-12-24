import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthSection = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-section">
      <div className="auth-toggle">
        <button
          className={isLogin ? 'active' : ''}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={!isLogin ? 'active' : ''}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>
      {isLogin ? (
        <Login onLoginSuccess={onAuthSuccess} />
      ) : (
        <Register onRegisterSuccess={onAuthSuccess} />
      )}
    </div>
  );
};

export default AuthSection;
