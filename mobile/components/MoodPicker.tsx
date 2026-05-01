import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { theme } from '../constants/theme';
import type { MoodValue } from '../types';

const MOODS: { value: MoodValue; emoji: string; label: string }[] = [
  { value: 1, emoji: '😔', label: 'Low'   },
  { value: 2, emoji: '😕', label: 'Meh'   },
  { value: 3, emoji: '😐', label: 'Okay'  },
  { value: 4, emoji: '🙂', label: 'Good'  },
  { value: 5, emoji: '😊', label: 'Great' },
];

interface Props {
  selected: MoodValue | null;
  onChange: (mood: MoodValue) => void;
  size?: 'sm' | 'md';
}

export default function MoodPicker({ selected, onChange, size = 'md' }: Props) {
  const isSm = size === 'sm';
  const scales = useRef(MOODS.map(() => new Animated.Value(1))).current;

  function handlePress(mood: MoodValue, index: number) {
    Animated.sequence([
      Animated.spring(scales[index], {
        toValue: 1.20,
        useNativeDriver: true,
        tension: 500,
        friction: 8,
      }),
      Animated.spring(scales[index], {
        toValue: 1,
        useNativeDriver: true,
        tension: 400,
        friction: 10,
      }),
    ]).start();
    onChange(mood);
  }

  return (
    <View style={styles.row}>
      {MOODS.map((m, index) => {
        const isSelected = selected === m.value;
        const moodColor  = theme.colors.mood[m.value];
        return (
          <Animated.View
            key={m.value}
            style={[styles.itemWrap, { transform: [{ scale: scales[index] }] }]}
          >
            <TouchableOpacity
              onPress={() => handlePress(m.value, index)}
              style={[
                styles.item,
                isSm && styles.itemSm,
                isSelected && {
                  backgroundColor: moodColor + '26',
                  borderColor:     moodColor,
                  borderWidth:     2,
                },
              ]}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={`Mood: ${m.label}`}
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={[styles.emoji, isSm && styles.emojiSm]}>{m.emoji}</Text>
              {!isSm && (
                <Text
                  style={[
                    styles.label,
                    isSelected && { color: moodColor, fontWeight: '700' },
                  ]}
                >
                  {m.label}
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  itemWrap: { flex: 1 },
  item: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  itemSm: {
    paddingVertical: 9,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 5,
  },
  emojiSm: {
    fontSize: 24,
    marginBottom: 0,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
