import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

interface Props {
  entry: JournalEntry;
  onPress?: () => void;
  onDelete?: () => void;
}

export default function JournalEntryCard({ entry, onPress, onDelete }: Props) {
  const preview = entry.content.length > 120
    ? entry.content.slice(0, 120) + '…'
    : entry.content;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
    >
      {/* Left mood stripe */}
      <View style={[styles.stripe, { backgroundColor: theme.colors.mood[entry.mood] }]} />

      <View style={styles.body}>
        {/* Header row */}
        <View style={styles.header}>
          <Text style={styles.emoji}>{MOOD_EMOJI[entry.mood]}</Text>
          <Text style={styles.date}>{dayjs(entry.date).format('ddd, D MMM YYYY')}</Text>
          {onDelete && (
            <TouchableOpacity
              onPress={onDelete}
              style={styles.deleteBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Delete entry"
            >
              <Text style={styles.deleteText}>✕</Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  emoji: {
    fontSize: 18,
    marginRight: 8,
  },
  date: {
    flex: 1,
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  deleteBtn: {
    padding: 4,
  },
  deleteText: {
    fontSize: 14,
    color: theme.colors.textLight,
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
    marginTop: 8,
  },
  tag: {
    backgroundColor: theme.colors.primary + '18',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: {
    ...theme.typography.small,
    color: theme.colors.primaryDark,
  },
});
