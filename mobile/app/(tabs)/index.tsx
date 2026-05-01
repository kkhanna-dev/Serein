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
import dayjs from 'dayjs';

import { useAuthStore }    from '../../store/authStore';
import { useJournalStore } from '../../store/journalStore';
import MoodPicker          from '../../components/MoodPicker';
import MoodTrendChart      from '../../components/MoodTrendChart';
import JournalEntryCard    from '../../components/JournalEntryCard';
import { theme }           from '../../constants/theme';
import type { MoodValue }  from '../../types';

const GREETINGS = ['Namaste', 'Hello', 'Welcome back', 'Hey'];

function greeting(name: string): string {
  const hour = new Date().getHours();
  const prefix =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
                'Good evening';
  return `${prefix}, ${name.split(' ')[0]} 👋`;
}

export default function DashboardScreen() {
  const router                                                  = useRouter();
  const user                                                    = useAuthStore((s) => s.user);
  const { entries, moodHistory, isLoading, fetchEntries, fetchMoodHistory, logMood } =
    useJournalStore();

  const [selectedMood,    setSelectedMood]    = useState<MoodValue | null>(null);
  const [moodLogged,      setMoodLogged]      = useState(false);
  const [moodDays,        setMoodDays]        = useState<7 | 30>(7);
  const [refreshing,      setRefreshing]      = useState(false);

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
          />
        }
      >
        {/* ── Greeting ─────────────────────────────────────────────────── */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>{greeting(user?.name ?? 'friend')}</Text>
            <Text style={styles.date}>{dayjs().format('dddd, D MMMM')}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => useAuthStore.getState().clearAuth()}
            accessibilityLabel="Sign out"
          >
            <Text style={styles.logoutText}>Sign out</Text>
          </TouchableOpacity>
        </View>

        {/* ── Mood check-in ─────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {moodLogged ? '✅  Today\'s mood logged' : 'How are you feeling today?'}
          </Text>
          {moodLogged ? (
            <Text style={styles.moodLoggedText}>
              Come back tomorrow to log again. You're doing great.
            </Text>
          ) : (
            <MoodPicker selected={selectedMood} onChange={handleMoodCheckin} />
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
          <TouchableOpacity onPress={() => router.push('/(tabs)/journal')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {recentEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📓</Text>
            <Text style={styles.emptyText}>
              No journal entries yet.{'\n'}Head to the Journal tab to write your first one.
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
        >
          <Text style={styles.chatCTAEmoji}>💬</Text>
          <View style={styles.chatCTAText}>
            <Text style={styles.chatCTATitle}>Need to talk?</Text>
            <Text style={styles.chatCTASubtitle}>
              Serein is here — no judgment, always listening.
            </Text>
          </View>
          <Text style={styles.chatCTAArrow}>→</Text>
        </TouchableOpacity>

        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  greeting: { ...theme.typography.h2, color: theme.colors.text },
  date:     { ...theme.typography.caption, color: theme.colors.textSecondary, marginTop: 2 },
  logoutBtn: { paddingVertical: 4, paddingHorizontal: 8 },
  logoutText: { ...theme.typography.small, color: theme.colors.textLight },

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
    marginBottom: theme.spacing.sm,
  },
  moodLoggedText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },

  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  periodToggle: { flexDirection: 'row', gap: 4 },
  periodBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  periodBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  periodBtnText:       { ...theme.typography.small, color: theme.colors.textSecondary },
  periodBtnTextActive: { color: '#fff', fontWeight: '600' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  seeAll: { ...theme.typography.caption, color: theme.colors.primary, fontWeight: '600' },

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

  chatCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '14',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  chatCTAEmoji: { fontSize: 28, marginRight: theme.spacing.sm },
  chatCTAText:  { flex: 1 },
  chatCTATitle: { ...theme.typography.body, color: theme.colors.primaryDark, fontWeight: '600' },
  chatCTASubtitle: { ...theme.typography.small, color: theme.colors.textSecondary, marginTop: 2 },
  chatCTAArrow: { fontSize: 18, color: theme.colors.primary, fontWeight: '700' },
});
