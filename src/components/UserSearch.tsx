'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  photo: string | null;
}

interface UserSearchProps {
  onUserSelect: (user: User) => void;
}

export default function UserSearch({ onUserSelect }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setUsers([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        }
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      
      {searchQuery && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : users.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto">
              {users.map((user) => (
                <li
                  key={user.id}
                  onClick={() => onUserSelect(user)}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="relative h-10 w-10">
                    <Image
                      src={user.photo || '/default-avatar.png'}
                      alt={`${user.firstName}'s profile`}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
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