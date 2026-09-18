// @ts-nocheck
import { useState, useEffect, useCallback } from "react";

export function useHomeData(currentUserId) {
  const [stats, setStats] = useState({
    weekly: 0,
    monthly: 0,
    yearly: 0,
    total: 0,
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  const fetchData = useCallback(async () => {
    if (!currentUserId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      // Fetch user info
      const userRes = await fetch(`/api/users/get?userId=${currentUserId}`);
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
      }

      // Fetch stats
      const statsRes = await fetch(`/api/users/stats?userId=${currentUserId}`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch feed
      const feedRes = await fetch(
        `/api/posts/feed?userId=${currentUserId}&limit=20`
      );
      if (feedRes.ok) {
        const feedData = await feedRes.json();
        setPosts(feedData.posts);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  return {
    stats,
    posts,
    setPosts,
    loading,
    refreshing,
    user,
    onRefresh,
  };
}