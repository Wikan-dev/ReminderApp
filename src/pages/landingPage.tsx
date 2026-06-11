import { useState } from 'react';
import { GoogleLogin } from "../function/googleLogin"

export default function MainPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await GoogleLogin();
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGoogleLogin} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login Google'}
      </button>
    </div>
  )
}