'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';

interface User {
  id: string;
  name: string;
  photoUrl: string;
}

interface UserSearchProps {
  onUserSelect: (userId: string) => void;
}

export default function UserSearch({ onUserSelect }: UserSearchProps) {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/users/search?query=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchUsers(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, searchUsers]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {/* Results Dropdown */}
      {query && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <li
                  key={user.id}
                  onClick={() => {
                    onUserSelect(user.id);
                    setQuery('');
                    setUsers([]);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
                >
                  <div className="relative h-8 w-8">
                    <Image
                      src={user.photoUrl || '/default-avatar.png'}
                      alt={user.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <span className="text-gray-900">{user.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">No users found</div>
          )}
        </div>
      )}
    </div>
  );
} 