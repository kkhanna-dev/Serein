import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { theme } from '../constants/theme';
import type { JournalEntry } from '../types';

const MOOD_EMOJI: Record<number, string> = {
  1: '😔',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😊',
};

const MOOD_LABEL: Record<number, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Okay',
  4: 'Good',
  5: 'Great',
};

interface Props {
  entry: JournalEntry;
  onPress?: () => void;
  onDelete?: () => void;
}

export default function JournalEntryCard({ entry, onPress, onDelete }: Props) {
  const preview = entry.content.length > 130
    ? entry.content.slice(0, 130) + '…'
    : entry.content;

  const moodColor = theme.colors.mood[entry.mood];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
    >
      {/* Left mood stripe */}
      <View style={[styles.stripe, { backgroundColor: moodColor }]} />

      <View style={styles.body}>
        {/* Header row */}
        <View style={styles.header}>
          <View style={[styles.moodBadge, { backgroundColor: moodColor + '20' }]}>
            <Text style={styles.emoji}>{MOOD_EMOJI[entry.mood]}</Text>
            <Text style={[styles.moodLabel, { color: moodColor }]}>{MOOD_LABEL[entry.mood]}</Text>
          </View>
          <Text style={styles.date}>{dayjs(entry.date).format('D MMM YYYY')}</Text>
          {onDelete && (
            <TouchableOpacity
              onPress={onDelete}
              style={styles.deleteBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Delete entry"
            >
              <Ionicons name="trash-outline" size={15} color={theme.colors.textLight} />
            </TouchableOpacity>
          )}
        </View>

        {/* Content preview */}
        <Text style={styles.content}>{preview}</Text>

        {/* Tags */}
        {entry.tags.length > 0 && (
          <View style={styles.tagRow}>
            {entry.tags.map((tag, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  stripe: {
    width: 5,
  },
  body: {
    flex: 1,
    padding: theme.spacing.md,
    paddingLeft: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  emoji: {
    fontSize: 14,
  },
  moodLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  date: {
    flex: 1,
    ...theme.typography.small,
    color: theme.colors.textLight,
    textAlign: 'right',
  },
  deleteBtn: {
    padding: 2,
  },
  content: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 22,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tag: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
    fontWeight: '500',
  },
});
