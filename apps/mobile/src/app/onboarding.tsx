// @ts-nocheck
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { MapPin, Bell, ChevronRight, Check, User, AtSign } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/utils/auth';

const RED = '#F53D2D';
const WHITE = '#FFFFFF';
const DARK = '#111111';
const BORDER = '#1f1f1f';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [locationGranted, setLocationGranted] = useState(false);
  const [notifGranted, setNotifGranted] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationGranted(status === 'granted');
    } catch (e) {
      console.log('Location permission error:', e);
    }
  };

  const requestNotifications = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setNotifGranted(status === 'granted');
    } catch (e) {
      console.log('Notification permission error:', e);
    }
  };

  const handleFinish = async () => {
    if (!name.trim() || !username.trim()) return;
    setIsCreating(true);
    setError('');
    try {
      const res = await fetch('/api/users/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), username: username.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setIsCreating(false);
        return;
      }
      // Store auth
      const authPayload = {
        jwt: data.token,
        user: {
          id: String(data.user.id),
          email: data.user.email || '',
          name: name.trim(),
          image: data.user.profile_image || '',
        },
      };
      useAuthStore.getState().setAuth(authPayload);
      await AsyncStorage.setItem('onboarding_complete', 'true');
      router.replace('/(tabs)/home');
    } catch (e) {
      console.error('Onboarding error:', e);
      setError('Network error. Please try again.');
      setIsCreating(false);
    }
  };

  const usernameValid = /^[a-zA-Z0-9_.]+$/.test(username) && username.length >= 3;
  const canFinish = name.trim().length > 0 && usernameValid;

  // ── Step 0: Intro ──────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <StatusBar style="light" />
        <View
          style={{
            flex: 1,
            paddingTop: insets.top + 60,
            paddingBottom: insets.bottom + 40,
            paddingHorizontal: 32,
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                backgroundColor: RED,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 28,
              }}
            >
              <Text style={{ fontSize: 36 }}>🏃</Text>
            </View>
            <Text
              style={{
                fontSize: 42,
                fontWeight: '800',
                color: WHITE,
                letterSpacing: -1,
                textAlign: 'center',
              }}
            >
              RunStreak
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: '#888',
                marginTop: 12,
                textAlign: 'center',
                lineHeight: 26,
              }}
            >
              Track every mile.{'\n'}Compete with your city.
            </Text>
          </View>

          {/* CTA */}
          <View>
            <TouchableOpacity
              onPress={() => setStep(1)}
              style={{
                backgroundColor: RED,
                paddingVertical: 18,
                borderRadius: 16,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
              }}
              activeOpacity={0.85}
            >
              <Text style={{ color: WHITE, fontSize: 18, fontWeight: '700' }}>Get Started</Text>
              <ChevronRight size={20} color={WHITE} />
            </TouchableOpacity>
            <Text style={{ color: '#555', textAlign: 'center', marginTop: 16, fontSize: 13 }}>
              Free to use · No credit card needed
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // ── Step 1: Permissions ────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <StatusBar style="light" />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={{
              paddingTop: insets.top + 24,
              paddingBottom: insets.bottom + 40,
              paddingHorizontal: 24,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={{ marginBottom: 40 }}>
              <Text style={{ fontSize: 28, fontWeight: '800', color: WHITE, marginBottom: 8 }}>
                Set Up Your Experience
              </Text>
              <Text style={{ fontSize: 16, color: '#888', lineHeight: 24 }}>
                Allow these to get the most out of RunStreak
              </Text>
            </View>

            {/* Location */}
            <TouchableOpacity
              onPress={requestLocation}
              style={{
                backgroundColor: DARK,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: locationGranted ? RED : BORDER,
                padding: 20,
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
              }}
              activeOpacity={0.8}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: locationGranted ? RED : '#1a1a1a',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {locationGranted ? (
                  <Check size={24} color={WHITE} />
                ) : (
                  <MapPin size={24} color="#888" />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: WHITE, marginBottom: 4 }}>
                  Location
                </Text>
                <Text style={{ fontSize: 13, color: '#888', lineHeight: 18 }}>
                  Compete on local leaderboards and track your routes
                </Text>
              </View>
            </TouchableOpacity>

            {/* Notifications */}
            <TouchableOpacity
              onPress={requestNotifications}
              style={{
                backgroundColor: DARK,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: notifGranted ? RED : BORDER,
                padding: 20,
                marginBottom: 40,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
              }}
              activeOpacity={0.8}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: notifGranted ? RED : '#1a1a1a',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {notifGranted ? <Check size={24} color={WHITE} /> : <Bell size={24} color="#888" />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: WHITE, marginBottom: 4 }}>
                  Notifications
                </Text>
                <Text style={{ fontSize: 13, color: '#888', lineHeight: 18 }}>
                  Get notified about medals, followers and milestones
                </Text>
              </View>
            </TouchableOpacity>

            {/* Continue button */}
            <TouchableOpacity
              onPress={() => setStep(2)}
              style={{
                backgroundColor: RED,
                paddingVertical: 18,
                borderRadius: 16,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
              }}
              activeOpacity={0.85}
            >
              <Text style={{ color: WHITE, fontSize: 18, fontWeight: '700' }}>Continue</Text>
              <ChevronRight size={20} color={WHITE} />
            </TouchableOpacity>

            <Text style={{ color: '#555', textAlign: 'center', marginTop: 16, fontSize: 13 }}>
              You can change these later in Settings
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // ── Step 2: Create Profile ─────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 40,
            paddingHorizontal: 24,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={{ marginBottom: 40 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: WHITE, marginBottom: 8 }}>
              Create Your Profile
            </Text>
            <Text style={{ fontSize: 16, color: '#888', lineHeight: 24 }}>
              Choose a name and username to get started
            </Text>
          </View>

          {/* Name */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: '#888',
                marginBottom: 8,
                letterSpacing: 0.5,
              }}
            >
              YOUR NAME
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: DARK,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: name.length > 0 ? RED : BORDER,
                paddingHorizontal: 16,
                gap: 12,
              }}
            >
              <User size={18} color="#555" />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Alex Johnson"
                placeholderTextColor="#444"
                style={{
                  flex: 1,
                  color: WHITE,
                  fontSize: 16,
                  paddingVertical: 16,
                }}
                autoCapitalize="words"
                returnKeyType="next"
                maxLength={50}
              />
            </View>
          </View>

          {/* Username */}
          <View style={{ marginBottom: 12 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: '#888',
                marginBottom: 8,
                letterSpacing: 0.5,
              }}
            >
              USERNAME
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: DARK,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: username.length > 0 ? (usernameValid ? RED : '#f59e0b') : BORDER,
                paddingHorizontal: 16,
                gap: 12,
              }}
            >
              <AtSign size={18} color="#555" />
              <TextInput
                value={username}
                onChangeText={(t) => setUsername(t.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                placeholder="e.g. alexruns"
                placeholderTextColor="#444"
                style={{
                  flex: 1,
                  color: WHITE,
                  fontSize: 16,
                  paddingVertical: 16,
                }}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                maxLength={30}
              />
            </View>
            <Text style={{ fontSize: 12, color: '#555', marginTop: 6, marginLeft: 4 }}>
              Letters, numbers, underscores and periods · Min 3 characters
            </Text>
          </View>

          {/* Error */}
          {error ? (
            <Text style={{ color: '#ef4444', fontSize: 14, marginBottom: 16, textAlign: 'center' }}>
              {error}
            </Text>
          ) : null}

          {/* Create button */}
          <View style={{ marginTop: 32 }}>
            <TouchableOpacity
              onPress={handleFinish}
              disabled={!canFinish || isCreating}
              style={{
                backgroundColor: canFinish && !isCreating ? RED : '#1a1a1a',
                paddingVertical: 18,
                borderRadius: 16,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
              }}
              activeOpacity={0.85}
            >
              {isCreating ? (
                <ActivityIndicator color={WHITE} />
              ) : (
                <>
                  <Text
                    style={{
                      color: canFinish ? WHITE : '#444',
                      fontSize: 18,
                      fontWeight: '700',
                    }}
                  >
                    Create My Account
                  </Text>
                  <ChevronRight size={20} color={canFinish ? WHITE : '#444'} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
