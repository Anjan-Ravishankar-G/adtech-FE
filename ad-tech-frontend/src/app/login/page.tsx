'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { token, logout, user, loading } = useAuth();
  const router = useRouter();
  const [protectedData, setProtectedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!loading && !token) {
      router.push('/login');
    }
  }, [token, loading, router]);
  
  useEffect(() => {
    const fetchProtectedData = async () => {
      if (!token) return;
      
      try {
        const response = await fetch('http://localhost:8000/protected-resource', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setProtectedData(data);
        } else {
          const errorData = await response.json();
          setError(errorData.detail || 'Failed to fetch data');
        }
      } catch (error) {
        setError('Network error occurred');
      }
    };
    
    fetchProtectedData();
  }, [token]);
  
  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }
  
  if (!token) {
    return null; // Will redirect to login
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Protected Home Page</h1>
      {user && (
        <div className="mt-4">
          <p>Welcome, {user.email}</p>
        </div>
      )}
      
      {protectedData && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <h2 className="font-semibold">Protected Data:</h2>
          <p>{protectedData.message}</p>
          <p className="text-sm text-gray-600">User: {protectedData.user}</p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <button 
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

