import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HOTLINES, ARTICLES, ORGANIZATIONS } from '../../constants/resources';
import { theme } from '../../constants/theme';

const REGION_FLAGS: Record<string, string> = {
  India:     '🇮🇳',
  USA:       '🇺🇸',
  UK:        '🇬🇧',
  Canada:    '🇨🇦',
  Australia: '🇦🇺',
};

const REGION_ORDER = ['India', 'USA', 'UK', 'Canada', 'Australia'];

type TabName = 'hotlines' | 'articles' | 'organisations';

export default function ResourcesScreen() {
  const [activeTab, setActiveTab] = useState<TabName>('hotlines');

  function openURL(url: string) {
    Linking.canOpenURL(url).then((ok) => {
      if (ok) Linking.openURL(url);
      else Alert.alert('Cannot open link', url);
    });
  }

  function callNumber(number: string) {
    const cleaned = number.replace(/[^0-9+]/g, '');
    if (!cleaned) {
      Alert.alert('Text / Online only', number);
      return;
    }
    Linking.openURL(`tel:${cleaned}`);
  }

  const groupedHotlines = REGION_ORDER.reduce(
    (acc, region) => {
      const list = HOTLINES.filter((h) => h.region === region);
      if (list.length) acc[region] = list;
      return acc;
    },
    {} as Record<string, typeof HOTLINES>,
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.title}>Resources</Text>
        <Text style={styles.subtitle}>You are not alone.</Text>
      </View>

      {/* ── Tabs ──────────────────────────────────────────────────── */}
      <View style={styles.tabBar}>
        {(
          [
            { key: 'hotlines',      label: 'Hotlines',      icon: 'call-outline'         },
            { key: 'articles',      label: 'Articles',      icon: 'book-outline'         },
            { key: 'organisations', label: 'Orgs',          icon: 'business-outline'     },
          ] as { key: TabName; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[]
        ).map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Ionicons
              name={tab.icon}
              size={15}
              color={activeTab === tab.key ? '#fff' : theme.colors.textSecondary}
              style={{ marginBottom: 2 }}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hotlines ────────────────────────────────────────────── */}
        {activeTab === 'hotlines' && (
          <>
            <Text style={styles.sectionNote}>
              If you or someone you know is in crisis, please reach out immediately.
            </Text>

            {Object.entries(groupedHotlines).map(([region, list]) => (
              <View key={region} style={styles.regionSection}>
                <Text style={styles.regionTitle}>
                  {REGION_FLAGS[region]} {region}
                </Text>
                {list.map((h, i) => (
                  <View key={i} style={styles.hotlineCard}>
                    <View style={styles.hotlineLeft}>
                      <Text style={styles.hotlineName}>{h.name}</Text>
                      {h.note && (
                        <Text style={styles.hotlineNote}>{h.note}</Text>
                      )}
                      <Text style={styles.hotlineNumber}>{h.number}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.callBtn}
                      onPress={() => callNumber(h.number)}
                      accessibilityRole="button"
                      accessibilityLabel={`Call ${h.name}`}
                    >
                      <Ionicons name="call" size={16} color="#fff" />
                      <Text style={styles.callBtnText}>Call</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}
          </>
        )}

        {/* ── Articles ────────────────────────────────────────────── */}
        {activeTab === 'articles' && (
          <>
            {ARTICLES.map((article, i) => (
              <TouchableOpacity
                key={i}
                style={styles.articleCard}
                onPress={() => openURL(article.url)}
                accessibilityRole="link"
              >
                <View style={styles.articleTag}>
                  <Text style={styles.articleTagText}>{article.tag}</Text>
                </View>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleSummary}>{article.summary}</Text>
                <Text style={styles.readMore}>Read article →</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* ── Organisations ───────────────────────────────────────── */}
        {activeTab === 'organisations' && (
          <>
            {ORGANIZATIONS.map((org, i) => (
              <TouchableOpacity
                key={i}
                style={styles.orgCard}
                onPress={() => openURL(org.url)}
                accessibilityRole="link"
              >
                <Text style={styles.orgName}>{org.name}</Text>
                <Text style={styles.orgTagline}>{org.tagline}</Text>
                <Text style={styles.orgUrl}>{org.url}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: theme.colors.background },

  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop:  theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  title:    { ...theme.typography.h2, color: theme.colors.text },
  subtitle: { ...theme.typography.caption, color: theme.colors.textSecondary, marginTop: 2 },

  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabText:       { ...theme.typography.small, color: theme.colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: '#fff' },

  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop:        theme.spacing.sm,
  },

  sectionNote: {
    ...theme.typography.caption,
    color: '#92400E',
    backgroundColor: theme.colors.warning + '22',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: theme.colors.warning + '44',
  },

  regionSection: { marginBottom: theme.spacing.lg },
  regionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  hotlineCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    ...theme.shadows.small,
  },
  hotlineLeft:   { flex: 1, marginRight: theme.spacing.sm },
  hotlineName:   { ...theme.typography.body, color: theme.colors.text, fontWeight: '600' },
  hotlineNote:   { ...theme.typography.small, color: theme.colors.textSecondary, marginTop: 2 },
  hotlineNumber: { ...theme.typography.small, color: theme.colors.primary, fontWeight: '700', marginTop: 4 },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...theme.shadows.small,
  },
  callBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  articleCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  articleTag: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.secondary + '22',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 8,
  },
  articleTagText:  { ...theme.typography.small, color: theme.colors.secondary, fontWeight: '600' },
  articleTitle:    { ...theme.typography.h3, color: theme.colors.text, marginBottom: 6, lineHeight: 24 },
  articleSummary:  { ...theme.typography.caption, color: theme.colors.textSecondary, lineHeight: 20 },
  readMore: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
    marginTop: 10,
  },

  orgCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  orgName:    { ...theme.typography.h3, color: theme.colors.text, marginBottom: 4 },
  orgTagline: { ...theme.typography.caption, color: theme.colors.textSecondary },
  orgUrl:     { ...theme.typography.small, color: theme.colors.primary, marginTop: 6 },
});
