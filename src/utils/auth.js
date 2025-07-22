// utils/auth.js
export const isTokenValid = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
  
    try {
      // Add your token validation logic (e.g., decode JWT and check expiry)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch (error) {
      return false;
    }
  };
  