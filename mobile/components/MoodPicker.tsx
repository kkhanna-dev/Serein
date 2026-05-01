import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import type { MoodValue } from '../types';

const MOODS: { value: MoodValue; emoji: string; label: string }[] = [
  { value: 1, emoji: '😔', label: 'Very Low' },
  { value: 2, emoji: '😕', label: 'Low'      },
  { value: 3, emoji: '😐', label: 'Okay'     },
  { value: 4, emoji: '🙂', label: 'Good'     },
  { value: 5, emoji: '😊', label: 'Great'    },
];

interface Props {
  selected: MoodValue | null;
  onChange: (mood: MoodValue) => void;
  size?: 'sm' | 'md';
}

export default function MoodPicker({ selected, onChange, size = 'md' }: Props) {
  const isSm = size === 'sm';

  return (
    <View style={styles.row}>
      {MOODS.map((m) => {
        const isSelected = selected === m.value;
        return (
          <TouchableOpacity
            key={m.value}
            onPress={() => onChange(m.value)}
            style={[
              styles.item,
              isSm && styles.itemSm,
              isSelected && {
                backgroundColor: theme.colors.mood[m.value] + '22',
                borderColor: theme.colors.mood[m.value],
                borderWidth: 2,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Mood: ${m.label}`}
            accessibilityState={{ selected: isSelected }}
          >
            <Text style={[styles.emoji, isSm && styles.emojiSm]}>{m.emoji}</Text>
            {!isSm && (
              <Text
                style={[
                  styles.label,
                  isSelected && { color: theme.colors.mood[m.value], fontWeight: '600' },
                ]}
              >
                {m.label}
              </Text>
            )}
          </TouchableOpacity>
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
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  itemSm: {
    paddingVertical: 8,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  emojiSm: {
    fontSize: 22,
    marginBottom: 0,
  },
  label: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
