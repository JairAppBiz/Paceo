// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { BestEffortsCard } from './BestEffortsCard';
import { FunStatsCard } from './FunStatsCard';
import { MoodVibesCard } from './MoodVibesCard';
import { HistoricalRunsSection } from './HistoricalRunsSection';

const { width: screenWidth } = Dimensions.get('window');

export function ActivityGraph({ userId }) {
  const [period, setPeriod] = useState('yearly');
  const [filterDate, setFilterDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [bestEfforts, setBestEfforts] = useState([]);
  const [funStats, setFunStats] = useState(null);
  const [moodStats, setMoodStats] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/users/activity-graph?userId=${userId}&period=${period}&filterDate=${filterDate.toISOString()}`
      );
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching activity graph:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, period, filterDate]);

  const fetchBestEfforts = useCallback(async () => {
    try {
      const res = await fetch(`/api/users/best-efforts?userId=${userId}`);
      if (res.ok) {
        const d = await res.json();
        setBestEfforts(d.bestEfforts || []);
      }
    } catch (error) {
      console.error('Error fetching best efforts:', error);
    }
  }, [userId]);

  const fetchFunStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/users/fun-stats?userId=${userId}`);
      if (res.ok) {
        const d = await res.json();
        setFunStats(d.funStats);
      }
    } catch (error) {
      console.error('Error fetching fun stats:', error);
    }
  }, [userId]);

  const fetchMoodStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/users/mood-stats?userId=${userId}`);
      if (res.ok) {
        const d = await res.json();
        setMoodStats(d.moodStats || []);
      }
    } catch (error) {
      console.error('Error fetching mood stats:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
    fetchBestEfforts();
    fetchFunStats();
    fetchMoodStats();
  }, [fetchData, fetchBestEfforts, fetchFunStats, fetchMoodStats]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPace = (pace) => {
    const mins = Math.floor(pace);
    const secs = Math.round((pace - mins) * 60);
    return `${mins}'${secs.toString().padStart(2, '0')}"`;
  };

  const getDateLabel = () => {
    if (period === 'weekly') {
      const start = new Date(filterDate);
      start.setDate(filterDate.getDate() - filterDate.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} - ${end.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}`;
    } else if (period === 'monthly') {
      return filterDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    } else if (period === 'yearly') {
      return filterDate.getFullYear().toString();
    } else {
      return 'All Time';
    }
  };

  const handlePeriodChange = (newPeriod) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPeriod(newPeriod);
  };

  const renderGraph = () => {
    if (!data || !data.graphData || data.graphData.length === 0) {
      return (
        <View
          style={{
            height: 140,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#999', fontSize: 13 }}>No data yet</Text>
        </View>
      );
    }

    const graphData = data.graphData;
    const maxValue = Math.max(...graphData.map((d) => d.value), 1);
    const avgValue = graphData.reduce((sum, d) => sum + d.value, 0) / graphData.length;

    // Calculate scale to nice round numbers
    const scale = Math.max(Math.ceil(maxValue / 50) * 50, 150);

    const graphWidth = screenWidth - 60;
    const graphHeight = 140;
    const barWidth = Math.min((graphWidth - graphData.length * 6) / graphData.length, 32);

    return (
      <View style={{ marginTop: 20, paddingRight: 35 }}>
        {/* Y-axis labels */}
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            height: graphHeight + 15,
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <Text style={{ fontSize: 10, color: '#bbb', fontWeight: '500' }}>150</Text>
          <Text style={{ fontSize: 10, color: '#bbb', fontWeight: '500' }}>100</Text>
          <Text style={{ fontSize: 10, color: '#bbb', fontWeight: '500' }}>50</Text>
          <Text style={{ fontSize: 10, color: '#bbb', fontWeight: '500' }}>0mi</Text>
        </View>

        {/* Grid lines */}
        <View style={{ position: 'absolute', left: 0, right: 35, top: 0 }}>
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={{
                position: 'absolute',
                top: (index * graphHeight) / 3,
                left: 0,
                right: 0,
                height: 1,
                backgroundColor: index === 3 ? '#ddd' : '#f0f0f0',
              }}
            />
          ))}

          {/* Average line (dashed) */}
          {avgValue > 0 && (
            <>
              <View
                style={{
                  position: 'absolute',
                  top: graphHeight - (avgValue / scale) * graphHeight,
                  left: 0,
                  right: 0,
                  height: 0,
                  borderTopWidth: 1,
                  borderTopColor: '#bbb',
                  borderStyle: 'dashed',
                }}
              />
              <Text
                style={{
                  position: 'absolute',
                  right: -32,
                  top: graphHeight - (avgValue / scale) * graphHeight - 8,
                  fontSize: 9,
                  color: '#bbb',
                  fontWeight: '500',
                }}
              >
                {avgValue.toFixed(1)}
              </Text>
            </>
          )}
        </View>

        {/* Bars */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            height: graphHeight,
            justifyContent: 'space-between',
          }}
        >
          {graphData.map((item, index) => {
            const barHeight = (item.value / scale) * graphHeight;
            return (
              <View
                key={index}
                style={{
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  height: graphHeight,
                }}
              >
                <View
                  style={{
                    width: barWidth,
                    height: Math.max(barHeight, 2),
                    backgroundColor: '#60a5fa',
                    borderRadius: 3,
                  }}
                />
              </View>
            );
          })}
        </View>

        {/* X-axis labels */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 6,
          }}
        >
          {graphData.map((item, index) => (
            <View key={index} style={{ alignItems: 'center', width: barWidth }}>
              <Text style={{ fontSize: 11, color: '#000', fontWeight: '500' }}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View
        style={{
          backgroundColor: '#111',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#1f1f1f',
          padding: 20,
          marginTop: 12,
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
        }}
      >
        <ActivityIndicator size="large" color="#F53D2D" />
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: '#111',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#1f1f1f',
        padding: 16,
        marginTop: 12,
      }}
    >
      {/* Period Toggle */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#1a1a1a',
          borderRadius: 50,
          padding: 3,
          marginBottom: 16,
        }}
      >
        {['weekly', 'monthly', 'yearly'].map((p) => (
          <TouchableOpacity
            key={p}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setPeriod(p);
            }}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 50,
              backgroundColor: period === p ? '#F53D2D' : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: period === p ? '#fff' : '#555',
              }}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats Row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginBottom: 16,
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff' }}>
            {data?.stats.totalDistance ? data.stats.totalDistance.toFixed(1) : '0'}
          </Text>
          <Text style={{ fontSize: 12, color: '#555' }}>Miles</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff' }}>
            {data?.stats.totalRuns ?? 0}
          </Text>
          <Text style={{ fontSize: 12, color: '#555' }}>Runs</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff' }}>
            {data?.stats.totalDuration ? formatTime(data.stats.totalDuration) : '0:00:00'}
          </Text>
          <Text style={{ fontSize: 12, color: '#555' }}>Time</Text>
        </View>
      </View>

      {/* Graph */}
      {renderGraph()}

      {/* New Cards Below Graph */}
      <View style={{ marginTop: 20 }}>
        <BestEffortsCard
          bestEfforts={bestEfforts}
          onPress={() => Alert.alert('Best Efforts', 'Full view coming soon!')}
        />

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
          <FunStatsCard
            funStats={funStats}
            onPress={() => Alert.alert('Fun Stats', 'Full view coming soon!')}
          />
          <MoodVibesCard
            moodStats={moodStats}
            onPress={() => Alert.alert('Mood Vibes', 'Full breakdown coming soon!')}
          />
        </View>

        <HistoricalRunsSection userId={userId} />
      </View>
    </View>
  );
}
