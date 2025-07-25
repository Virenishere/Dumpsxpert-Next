import { useState, useEffect } from 'react';
import instance  from '@/lib/axios';
import useAuthStore from '@/store/useAuthStore';

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setUser: setAuthUser } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await instance.get('/api/user/me');
        setUser(response.data);
        setAuthUser({
          id: response.data._id,
          email: response.data.email,
          role: response.data.role,
        });
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setAuthUser]);

  const updateUser = async (data) => {
    try {
      const response = await instance.put('/api/user/me', data);
      setUser(response.data);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to update user data');
    }
  };

  return { user, loading, error, updateUser };
}