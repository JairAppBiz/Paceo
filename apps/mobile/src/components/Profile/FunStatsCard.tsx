// @ts-nocheck
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Sparkles } from 'lucide-react-native';

export const FunStatsCard = ({ funStats, onPress }) => {
  if (!funStats) {
    return null;
  }

  const formatPace = (pace) => {
    const mins = Math.floor(pace);
    const secs = Math.round((pace - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        <Sparkles size={18} color="#fbbf24" />
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Fun Stats</Text>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 12 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: '#667eea',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 14, color: '#fff', fontWeight: '900' }}>
            {formatPace(parseFloat(funStats.signaturePace))}
          </Text>
        </View>
      </View>

      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>Signature Pace</Text>
        <Text style={{ fontSize: 12, color: '#555', marginTop: 2 }}>Your comfort zone</Text>
      </View>

      <View
        style={{
          marginTop: 12,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: '#1f1f1f',
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#F53D2D' }}>
              {funStats.runVibesScore}%
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: '#555',
                marginTop: 2,
                textAlign: 'center',
              }}
            >
              Vibes
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#F53D2D' }}>
              {funStats.efficiencyBreakdown.cardio}%
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: '#555',
                marginTop: 2,
                textAlign: 'center',
              }}
            >
              Cardio
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
