// @ts-nocheck
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { UserPlus, UserMinus, UserCheck, Clock } from 'lucide-react-native';
import { useAuthStore } from '@/utils/auth';

export default function FollowButton({ userId, onFollowChange }) {
  const [loading, setLoading] = useState(false);
  const [followStatus, setFollowStatus] = useState({
    isFollowing: false,
    isPending: false,
    followsYou: false,
  });
  const { auth } = useAuthStore();

  const getAuthHeaders = useCallback(() => {
    const headers = {};
    if (auth?.jwt) {
      headers['Authorization'] = `Bearer ${auth.jwt}`;
    }
    return headers;
  }, [auth]);

  const fetchFollowStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/follow-status?userId=${userId}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch follow status');
      const data = await response.json();
      setFollowStatus(data);
    } catch (error) {
      console.error('Error fetching follow status:', error);
    }
  }, [userId, getAuthHeaders]);

  useEffect(() => {
    fetchFollowStatus();
  }, [fetchFollowStatus]);

  const handleFollow = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to follow');
      }

      const data = await response.json();

      // Update local state based on response
      setFollowStatus({
        ...followStatus,
        isFollowing: data.status === 'accepted',
        isPending: data.status === 'pending',
      });

      // Notify parent component
      if (onFollowChange) {
        onFollowChange(data.status === 'accepted' ? 1 : 0);
      }
    } catch (error) {
      console.error('Error following user:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/unfollow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('Failed to unfollow');

      setFollowStatus({
        ...followStatus,
        isFollowing: false,
        isPending: false,
      });

      // Notify parent component
      if (onFollowChange) {
        onFollowChange(-1);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      alert('Failed to unfollow');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: '#2A2A2A',
          paddingVertical: 10,
          paddingHorizontal: 24,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 120,
        }}
        disabled
      >
        <ActivityIndicator size="small" color="#FFF" />
      </TouchableOpacity>
    );
  }

  if (followStatus.isPending) {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: '#2A2A2A',
          paddingVertical: 10,
          paddingHorizontal: 24,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
        onPress={handleUnfollow}
      >
        <Clock size={18} color="#888" />
        <Text style={{ color: '#888', fontSize: 16, fontWeight: '600' }}>Requested</Text>
      </TouchableOpacity>
    );
  }

  if (followStatus.isFollowing) {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: '#2A2A2A',
          paddingVertical: 10,
          paddingHorizontal: 24,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
        onPress={handleUnfollow}
      >
        <UserCheck size={18} color="#FFF" />
        <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>Following</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#FFF',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
      onPress={handleFollow}
    >
      <UserPlus size={18} color="#000" />
      <Text style={{ color: '#000', fontSize: 16, fontWeight: '600' }}>Follow</Text>
    </TouchableOpacity>
  );
}
