import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

import { useAuthStore }    from '../../store/authStore';
import { useJournalStore } from '../../store/journalStore';
import MoodPicker          from '../../components/MoodPicker';
import MoodTrendChart      from '../../components/MoodTrendChart';
import JournalEntryCard    from '../../components/JournalEntryCard';
import { theme }           from '../../constants/theme';
import type { MoodValue }  from '../../types';

const MOOD_EMOJI: Record<number, string> = { 1:'😔', 2:'😕', 3:'😐', 4:'🙂', 5:'😊' };
const MOOD_LABEL: Record<number, string> = { 1:'Very Low', 2:'Low', 3:'Okay', 4:'Good', 5:'Great' };

function greeting(name: string): string {
  const hour = new Date().getHours();
  const prefix =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
                'Good evening';
  return `${prefix}, ${name.split(' ')[0]} 👋`;
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <View style={[statStyles.card, { borderTopColor: color }]}>
      <Ionicons name={icon} size={18} color={color} style={statStyles.icon} />
      <Text style={[statStyles.value, { color }]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderTopWidth: 3,
    ...theme.shadows.small,
  },
  icon:  { marginBottom: 4 },
  value: { fontSize: 20, fontWeight: '700', lineHeight: 26 },
  label: { ...theme.typography.small, color: theme.colors.textSecondary, marginTop: 2, textAlign: 'center' },
});

export default function DashboardScreen() {
  const router  = useRouter();
  const user    = useAuthStore((s) => s.user);
  const { entries, moodHistory, isLoading, totalEntries, fetchEntries, fetchMoodHistory, logMood } =
    useJournalStore();

  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);
  const [moodLogged,   setMoodLogged]   = useState(false);
  const [moodDays,     setMoodDays]     = useState<7 | 30>(7);
  const [refreshing,   setRefreshing]   = useState(false);

  // Check if mood already logged today
  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD');
    const todayEntry = moodHistory.find(
      (e) => dayjs(e.date).format('YYYY-MM-DD') === today,
    );
    if (todayEntry) {
      setMoodLogged(true);
      setSelectedMood(todayEntry.mood as MoodValue);
    }
  }, [moodHistory]);

  const load = useCallback(async () => {
    await Promise.all([fetchEntries(1), fetchMoodHistory(moodDays)]);
  }, [fetchEntries, fetchMoodHistory, moodDays]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  async function handleMoodCheckin(mood: MoodValue) {
    if (moodLogged) return;
    setSelectedMood(mood);
    try {
      await logMood(mood);
      setMoodLogged(true);
    } catch {
      Alert.alert('Error', 'Could not save your mood. Try again.');
      setSelectedMood(null);
    }
  }

  const recentEntries = entries.slice(0, 3);

  const avgMood = moodHistory.length > 0
    ? (moodHistory.reduce((s, e) => s + e.mood, 0) / moodHistory.length).toFixed(1)
    : '—';

  const initial = (user?.name ?? 'U')[0].toUpperCase();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <Text style={styles.dateLabel}>{dayjs().format('dddd, D MMMM')}</Text>
            <Text style={styles.greeting}>{greeting(user?.name ?? 'friend')}</Text>
          </View>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => useAuthStore.getState().clearAuth()}
            accessibilityLabel="Sign out"
          >
            <Text style={styles.avatarText}>{initial}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Stats strip ──────────────────────────────────────────────── */}
        <View style={styles.statsRow}>
          <StatCard
            icon="flame"
            value={user?.streakDays ?? 0}
            label="Day streak"
            color={theme.colors.warning}
          />
          <StatCard
            icon="book-outline"
            value={totalEntries}
            label="Entries"
            color={theme.colors.primary}
          />
          <StatCard
            icon="happy-outline"
            value={avgMood}
            label="Avg mood"
            color={theme.colors.success}
          />
        </View>

        {/* ── Mood check-in ─────────────────────────────────────────────── */}
        <View style={styles.card}>
          {moodLogged && selectedMood ? (
            <View style={styles.moodLoggedWrap}>
              <View style={[
                styles.moodLoggedCircle,
                { backgroundColor: theme.colors.mood[selectedMood] + '20' },
              ]}>
                <Text style={styles.moodLoggedEmoji}>{MOOD_EMOJI[selectedMood]}</Text>
              </View>
              <View style={styles.moodLoggedText}>
                <Text style={[styles.moodLoggedTitle, { color: theme.colors.mood[selectedMood] }]}>
                  Feeling {MOOD_LABEL[selectedMood]} today
                </Text>
                <Text style={styles.moodLoggedSub}>
                  Mood logged ✓ — come back tomorrow.
                </Text>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>How are you feeling today?</Text>
              <Text style={styles.sectionSub}>Your check-in takes 2 seconds.</Text>
              <View style={{ marginTop: 12 }}>
                <MoodPicker selected={selectedMood} onChange={handleMoodCheckin} />
              </View>
            </>
          )}
        </View>

        {/* ── Mood trend chart ──────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Mood Trend</Text>
            <View style={styles.periodToggle}>
              {([7, 30] as const).map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.periodBtn,
                    moodDays === d && styles.periodBtnActive,
                  ]}
                  onPress={() => setMoodDays(d)}
                >
                  <Text
                    style={[
                      styles.periodBtnText,
                      moodDays === d && styles.periodBtnTextActive,
                    ]}
                  >
                    {d}d
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <MoodTrendChart data={moodHistory} />
        </View>

        {/* ── Recent journal entries ───────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => router.push('/(tabs)/journal')}
          >
            <Text style={styles.seeAll}>See all</Text>
            <Ionicons name="chevron-forward" size={14} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {recentEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📓</Text>
            <Text style={styles.emptyText}>
              No entries yet.{'\n'}Head to the Journal tab to write your first one.
            </Text>
          </View>
        ) : (
          recentEntries.map((entry) => (
            <JournalEntryCard key={entry._id} entry={entry} />
          ))
        )}

        {/* ── Quick action — start chat ─────────────────────────────── */}
        <TouchableOpacity
          style={styles.chatCTA}
          onPress={() => router.push('/(tabs)/chat')}
          accessibilityRole="button"
          activeOpacity={0.88}
        >
          <View style={styles.chatCTAIcon}>
            <Ionicons name="chatbubble-ellipses" size={22} color="#fff" />
          </View>
          <View style={styles.chatCTAText}>
            <Text style={styles.chatCTATitle}>Need to talk?</Text>
            <Text style={styles.chatCTASubtitle}>
              Serein is here — no judgment, always listening.
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={theme.colors.primary} />
        </TouchableOpacity>

        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.sm },

  /* Top bar */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingTop: 4,
  },
  topBarLeft: { flex: 1 },
  dateLabel: {
    ...theme.typography.small,
    color: theme.colors.textLight,
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  greeting: {
    ...theme.typography.h2,
    color: theme.colors.text,
    lineHeight: 30,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.md,
    ...theme.shadows.colored,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: theme.spacing.md,
  },

  /* Cards */
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  sectionSub: {
    ...theme.typography.small,
    color: theme.colors.textSecondary,
    marginTop: 3,
  },

  /* Mood logged */
  moodLoggedWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  moodLoggedCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodLoggedEmoji:  { fontSize: 30 },
  moodLoggedText:   { flex: 1 },
  moodLoggedTitle:  { fontSize: 16, fontWeight: '700', lineHeight: 22 },
  moodLoggedSub:    { ...theme.typography.small, color: theme.colors.textSecondary, marginTop: 3 },

  /* Chart */
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  periodToggle: { flexDirection: 'row', gap: 4 },
  periodBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  periodBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  periodBtnText:       { ...theme.typography.small, color: theme.colors.textSecondary, fontWeight: '600' },
  periodBtnTextActive: { color: '#fff', fontWeight: '700' },

  /* Section header */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAll: { ...theme.typography.caption, color: theme.colors.primary, fontWeight: '600' },

  /* Empty */
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyEmoji: { fontSize: 36, marginBottom: theme.spacing.sm },
  emptyText:  {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  /* Chat CTA */
  chatCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.primary + '30',
    gap: 12,
    ...theme.shadows.small,
  },
  chatCTAIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatCTAText:     { flex: 1 },
  chatCTATitle:    { ...theme.typography.body, color: theme.colors.text, fontWeight: '700' },
  chatCTASubtitle: { ...theme.typography.small, color: theme.colors.textSecondary, marginTop: 2 },
});

