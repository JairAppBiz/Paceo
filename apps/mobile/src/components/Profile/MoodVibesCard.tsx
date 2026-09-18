// @ts-nocheck
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Smile } from 'lucide-react-native';
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

export const MoodVibesCard = ({ moodStats, onPress }) => {
  if (!moodStats || moodStats.length === 0) {
    return null;
  }

  const topMood = moodStats[0];
  const moodConfig = MOOD_CONFIG[topMood.mood] || {
    label: topMood.mood,
    gradient: ['#666', '#888'],
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#111',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1f1f1f',
        padding: 16,
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          marginBottom: 12,
        }}
      >
        <Smile size={18} color="#fbbf24" />
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Mood Vibes</Text>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 12 }}>
        <CategoryIcon
          category={topMood.mood}
          size={48}
          iconSize={24}
          customGradient={moodConfig.gradient}
        />
      </View>

      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>
          {topMood.percentage}%
        </Text>
        <Text style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{moodConfig.label}</Text>
      </View>

      {moodStats.length > 1 && (
        <View
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: '#1f1f1f',
          }}
        >
          <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
            {moodStats.slice(1, 4).map((stat) => {
              const config = MOOD_CONFIG[stat.mood] || {
                label: stat.mood,
                gradient: ['#666', '#888'],
              };
              return (
                <View key={stat.mood} style={{ alignItems: 'center' }}>
                  <CategoryIcon
                    category={stat.mood}
                    size={28}
                    iconSize={14}
                    customGradient={config.gradient}
                  />
                  <Text style={{ fontSize: 10, color: '#555', marginTop: 4 }}>
                    {stat.percentage}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};
