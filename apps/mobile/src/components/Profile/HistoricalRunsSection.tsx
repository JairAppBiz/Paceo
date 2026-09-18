// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { format, isToday, isYesterday, differenceInDays } from 'date-fns';
import { Play } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import RunDetailModal from './RunDetailModal';

export function HistoricalRunsSection({ userId }) {
  const [period, setPeriod] = useState('all');
  const [runs, setRuns] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState(null);

  const fetchHistoricalRuns = useCallback(async () => {
    setLoading(true);
    try {
      const limit = period === 'all' ? 100 : 50;
      const response = await fetch(`/api/runs/list?userId=${userId}&limit=${limit}`);

      if (response.ok) {
        const data = await response.json();
        let filteredRuns = data.runs || [];

        const now = new Date();
        if (period === 'weekly') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filteredRuns = filteredRuns.filter((run) => new Date(run.date) >= weekAgo);
        } else if (period === 'monthly') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filteredRuns = filteredRuns.filter((run) => new Date(run.date) >= monthAgo);
        } else if (period === 'yearly') {
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          filteredRuns = filteredRuns.filter((run) => new Date(run.date) >= yearAgo);
        }

        setRuns(filteredRuns);
        setTotal(filteredRuns.length);
      }
    } catch (error) {
      console.error('Error fetching historical runs:', error);
    } finally {
      setLoading(false);
    }
  }, [period, userId]);

  useEffect(() => {
    fetchHistoricalRuns();
  }, [fetchHistoricalRuns]);

  const handlePeriodChange = (newPeriod) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPeriod(newPeriod);
  };

  const handleRunPress = (run) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedRun(run);
  };

  const getRunDateLabel = (date) => {
    const runDate = new Date(date);

    if (isToday(runDate)) {
      return 'Today';
    } else if (isYesterday(runDate)) {
      return 'Yesterday';
    } else {
      const daysAgo = differenceInDays(new Date(), runDate);
      if (daysAgo <= 7) {
        return format(runDate, 'EEEE');
      } else {
        return format(runDate, 'MMM d');
      }
    }
  };

  const getRunTimeLabel = (date) => {
    const runDate = new Date(date);
    const hour = runDate.getHours();

    if (hour < 12) {
      return 'Morning Run';
    } else if (hour < 17) {
      return 'Afternoon Run';
    } else {
      return 'Evening Run';
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPace = (pace) => {
    const mins = Math.floor(pace);
    const secs = Math.round((pace - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View
        style={{
          backgroundColor: '#111',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#1f1f1f',
          padding: 16,
          marginTop: 12,
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
        }}
      >
        <ActivityIndicator size="large" color="#60a5fa" />
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
      {/* Header */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          color: '#fff',
          marginBottom: 16,
        }}
      >
        Historical Logs
      </Text>

      {/* Period Filter */}
      <View
        style={{
          backgroundColor: '#1a1a1a',
          borderRadius: 50,
          padding: 3,
          flexDirection: 'row',
          marginBottom: 20,
        }}
      >
        {[
          { label: 'W', value: 'weekly' },
          { label: 'M', value: 'monthly' },
          { label: 'Y', value: 'yearly' },
          { label: 'All', value: 'all' },
        ].map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => handlePeriodChange(option.value)}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 50,
              backgroundColor: period === option.value ? '#F53D2D' : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: period === option.value ? '#fff' : '#555',
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Run List */}
      <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
        {runs.length === 0 ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Text style={{ color: '#555', fontSize: 14 }}>No runs found for this period</Text>
          </View>
        ) : (
          runs.map((run, index) => (
            <TouchableOpacity
              key={run.id}
              onPress={() => handleRunPress(run)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomWidth: index < runs.length - 1 ? 1 : 0,
                borderBottomColor: '#1f1f1f',
              }}
            >
              {/* Left: icon */}
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#1a1a1a',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}
              >
                <Play size={18} color="#F53D2D" fill="#F53D2D" />
              </View>

              {/* Middle: Date and description */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: 2,
                  }}
                >
                  {getRunDateLabel(run.date)}
                </Text>
                <Text style={{ fontSize: 14, color: '#555' }}>{getRunTimeLabel(run.date)}</Text>
              </View>

              {/* Right: Stats grid */}
              <View style={{ alignItems: 'flex-end' }}>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  {/* Miles */}
                  <View style={{ alignItems: 'center', minWidth: 50 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '700',
                        color: '#fff',
                        marginBottom: 2,
                      }}
                    >
                      {run.distance.toFixed(2)}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#555' }}>mi</Text>
                  </View>

                  {/* Avg. Pace */}
                  <View style={{ alignItems: 'center', minWidth: 50 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '700',
                        color: '#fff',
                        marginBottom: 2,
                      }}
                    >
                      {formatPace(run.pace)}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#555' }}>avg pace</Text>
                  </View>

                  {/* Time */}
                  <View style={{ alignItems: 'center', minWidth: 60 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '700',
                        color: '#fff',
                        marginBottom: 2,
                      }}
                    >
                      {formatTime(run.duration)}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#555' }}>time</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Footer */}
      {total > 0 && (
        <View style={{ marginTop: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 13, color: '#555' }}>
            {total} run{total > 1 ? 's' : ''} shown
          </Text>
        </View>
      )}

      {/* Run Detail Modal */}
      <RunDetailModal
        visible={!!selectedRun}
        run={selectedRun}
        onClose={() => setSelectedRun(null)}
      />
    </View>
  );
}

export default HistoricalRunsSection;
