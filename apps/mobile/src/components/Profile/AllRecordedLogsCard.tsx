// @ts-nocheck
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ChevronRight, Calendar } from 'lucide-react-native';
import { format } from 'date-fns';
import CategoryIcon from '@/components/CategoryIcon';

const MOOD_CONFIG = {
  unstoppable: { label: 'Unstoppable', gradient: ['#ff6b6b', '#ff8c42'] },
  relaxed: { label: 'Relaxed', gradient: ['#a8e6cf', '#80d4ff'] },
  grinding: { label: 'Grinding', gradient: ['#b24592', '#f15f79'] },
  focused: { label: 'Focused', gradient: ['#667eea', '#764ba2'] },
  happy: { label: 'Happy', gradient: ['#ffd89b', '#ff9a9e'] },
  meh: { label: 'Meh', gradient: ['#757575', '#9e9e9e'] },
  clearing: { label: 'Clearing', gradient: ['#4facfe', '#00f2fe'] },
  race: { label: 'Race', gradient: ['#e52d27', '#b31217'] },
};

export const AllRecordedLogsCard = ({ runs, total, onPress, onRunPress }) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const formatPace = (pace) => {
    const mins = Math.floor(pace);
    const secs = Math.round((pace - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!runs || runs.length === 0) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#111',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1f1f1f',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Calendar size={18} color="#fbbf24" />
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>All Recorded Logs</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 13, color: '#666' }}>{total} total</Text>
          <ChevronRight size={20} color="#666" />
        </View>
      </View>

      {runs.slice(0, 3).map((run, index) => {
        const moodConfig = run.mood && MOOD_CONFIG[run.mood];

        return (
          <TouchableOpacity
            key={run.id}
            onPress={() => onRunPress?.(run)}
            style={{
              paddingVertical: 12,
              borderTopWidth: index > 0 ? 1 : 0,
              borderTopColor: '#1f1f1f',
            }}
          >
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {/* Left: Image or Mood Icon */}
              {run.post?.imageUrl ? (
                <Image
                  source={{ uri: run.post.imageUrl }}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 8,
                  }}
                  resizeMode="cover"
                />
              ) : moodConfig ? (
                <View style={{ justifyContent: 'center' }}>
                  <CategoryIcon
                    category={run.mood}
                    size={56}
                    iconSize={28}
                    customGradient={moodConfig.gradient}
                  />
                </View>
              ) : (
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 8,
                    backgroundColor: '#1a1a1a',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Calendar size={24} color="#555" />
                </View>
              )}

              {/* Right: Run Info */}
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>
                    {run.distance.toFixed(2)} mi
                  </Text>
                  <Text style={{ fontSize: 13, color: '#666' }}>
                    {format(new Date(run.date), 'MMM d')}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Text style={{ fontSize: 12, color: '#666' }}>{formatTime(run.duration)}</Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>{formatPace(run.pace)} /mi</Text>
                  {run.post?.caption && (
                    <Text style={{ fontSize: 12, color: '#60a5fa' }}>• Caption</Text>
                  )}
                </View>

                {run.post?.caption && (
                  <Text style={{ fontSize: 12, color: '#555', marginTop: 4 }} numberOfLines={1}>
                    {run.post.caption}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      {runs.length > 3 && (
        <View
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: '#1f1f1f',
          }}
        >
          <Text style={{ fontSize: 13, color: '#60a5fa', textAlign: 'center' }}>
            View all {total} runs
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
