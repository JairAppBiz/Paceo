// @ts-nocheck
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight, Award } from 'lucide-react-native';
import { format } from 'date-fns';

export const BestEffortsCard = ({ bestEfforts, onPress }) => {
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
    return `${mins}:${secs.toString().padStart(2, '0')} /mi`;
  };

  if (!bestEfforts || bestEfforts.length === 0) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#111',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1f1f1f',
        padding: 16,
        marginBottom: 12,
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
          <Award size={18} color="#fbbf24" />
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>Best Efforts</Text>
        </View>
        <ChevronRight size={20} color="#555" />
      </View>

      {bestEfforts.slice(0, 3).map((effort, index) => (
        <View
          key={effort.distance}
          style={{
            paddingVertical: 10,
            borderTopWidth: index > 0 ? 1 : 0,
            borderTopColor: '#1f1f1f',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>
                {effort.distance}
              </Text>
              <Text style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
                {format(new Date(effort.date), 'MMM d, yyyy')}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#F53D2D' }}>
                {formatTime(effort.duration)}
              </Text>
              <Text style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
                {formatPace(effort.pace)}
              </Text>
            </View>
          </View>
        </View>
      ))}

      {bestEfforts.length > 3 && (
        <View
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: '#1f1f1f',
          }}
        >
          <Text style={{ fontSize: 13, color: '#F53D2D', textAlign: 'center' }}>
            View all {bestEfforts.length} records
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
