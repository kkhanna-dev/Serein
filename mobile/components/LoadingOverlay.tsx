import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

export default function LoadingOverlay() {
  const pulse = useRef(new Animated.Value(0.5)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1,    duration: 900, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0.5,  duration: 900, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(scale, { toValue: 1,    duration: 900, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.92, duration: 900, useNativeDriver: true }),
        ]),
      ]),
    ).start();
  }, [pulse, scale]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoCircle, { opacity: pulse, transform: [{ scale }] }]}>
        <Text style={styles.logoEmoji}>🌿</Text>
      </Animated.View>
      <Text style={styles.name}>Serein</Text>
      <Text style={styles.tagline}>Your safe space.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...theme.shadows.colored,
  },
  logoEmoji: { fontSize: 40 },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 3,
  },
  tagline: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 6,
    letterSpacing: 0.5,
  },
});
