import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJournalStore } from '../../store/journalStore';
import JournalEntryCard    from '../../components/JournalEntryCard';
import MoodPicker          from '../../components/MoodPicker';
import { theme }           from '../../constants/theme';
import type { MoodValue }  from '../../types';

const SUGGESTED_TAGS = [
  'academics', 'family', 'homesick', 'stress', 'visa', 'friendship',
  'culture', 'food', 'win', 'grateful',
];

export default function JournalScreen() {
  const { entries, isLoading, isSaving, totalEntries, fetchEntries, fetchMoreEntries, createEntry, deleteEntry } =
    useJournalStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [content,      setContent]      = useState('');
  const [mood,         setMood]         = useState<MoodValue | null>(null);
  const [tags,         setTags]         = useState<string[]>([]);
  const [customTag,    setCustomTag]    = useState('');

  useEffect(() => { fetchEntries(1); }, [fetchEntries]);

  function resetForm() {
    setContent('');
    setMood(null);
    setTags([]);
    setCustomTag('');
  }

  function openModal() {
    resetForm();
    setModalVisible(true);
  }

  async function handleSave() {
    if (!content.trim()) {
      Alert.alert('Nothing to save', 'Write something first.');
      return;
    }
    if (!mood) {
      Alert.alert('Select a mood', 'How are you feeling?');
      return;
    }

    try {
      await createEntry({ content: content.trim(), mood, tags });
      setModalVisible(false);
    } catch {
      Alert.alert('Error', 'Could not save your entry. Please try again.');
    }
  }

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function addCustomTag() {
    const t = customTag.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
    }
    setCustomTag('');
  }

  const handleDelete = useCallback(
    (id: string) =>
      Alert.alert(
        'Delete entry',
        'This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deleteEntry(id),
          },
        ],
      ),
    [deleteEntry],
  );

  const loadedAll = entries.length >= totalEntries && totalEntries > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.title}>Journal</Text>
        <Text style={styles.count}>
          {totalEntries} {totalEntries === 1 ? 'entry' : 'entries'}
        </Text>
      </View>

      {/* ── Entries list ────────────────────────────────────────────── */}
      <FlatList
        data={entries}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <JournalEntryCard
            entry={item}
            onDelete={() => handleDelete(item._id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading && entries.length === 0}
        onRefresh={() => fetchEntries(1)}
        onEndReached={fetchMoreEntries}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          isLoading && entries.length > 0 ? (
            <ActivityIndicator
              color={theme.colors.primary}
              style={{ marginVertical: 16 }}
            />
          ) : loadedAll && entries.length > 0 ? (
            <Text style={styles.endText}>You've reached the beginning 🌱</Text>
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📓</Text>
              <Text style={styles.emptyTitle}>Your journal is empty</Text>
              <Text style={styles.emptySubtitle}>
                Write your first entry — no one else will see it.
              </Text>
            </View>
          ) : null
        }
      />

      {/* ── FAB ─────────────────────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={openModal}
        accessibilityRole="button"
        accessibilityLabel="New journal entry"
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* ── New entry modal ──────────────────────────────────────────── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe} edges={['top', 'bottom']}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              contentContainerStyle={styles.modalContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Modal header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>New Entry</Text>
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={isSaving}
                  style={styles.saveBtn}
                >
                  {isSaving
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={styles.saveBtnText}>Save</Text>
                  }
                </TouchableOpacity>
              </View>

              {/* Mood */}
              <Text style={styles.fieldLabel}>How are you feeling?</Text>
              <MoodPicker selected={mood} onChange={setMood} />

              {/* Content */}
              <Text style={styles.fieldLabel}>What's on your mind?</Text>
              <TextInput
                style={styles.textArea}
                value={content}
                onChangeText={setContent}
                placeholder="Write freely — this is just for you…"
                placeholderTextColor={theme.colors.textLight}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                maxLength={5000}
              />
              <Text style={styles.charCount}>{content.length}/5000</Text>

              {/* Tags */}
              <Text style={styles.fieldLabel}>Tags</Text>
              <View style={styles.tagGrid}>
                {SUGGESTED_TAGS.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagChip,
                      tags.includes(tag) && styles.tagChipActive,
                    ]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text
                      style={[
                        styles.tagChipText,
                        tags.includes(tag) && styles.tagChipTextActive,
                      ]}
                    >
                      #{tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom tag input */}
              <View style={styles.customTagRow}>
                <TextInput
                  style={styles.customTagInput}
                  value={customTag}
                  onChangeText={setCustomTag}
                  placeholder="Add custom tag…"
                  placeholderTextColor={theme.colors.textLight}
                  onSubmitEditing={addCustomTag}
                  returnKeyType="done"
                  maxLength={30}
                />
                <TouchableOpacity style={styles.addTagBtn} onPress={addCustomTag}>
                  <Text style={styles.addTagText}>Add</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  title: { ...theme.typography.h2, color: theme.colors.text, flex: 1 },
  count: { ...theme.typography.caption, color: theme.colors.textSecondary },

  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100, // room for FAB
    flexGrow: 1,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyEmoji:    { fontSize: 44, marginBottom: theme.spacing.sm },
  emptyTitle:    { ...theme.typography.h3, color: theme.colors.text, marginBottom: 8 },
  emptySubtitle: { ...theme.typography.caption, color: theme.colors.textSecondary, textAlign: 'center' },

  endText: {
    textAlign: 'center',
    ...theme.typography.small,
    color: theme.colors.textLight,
    marginVertical: 16,
  },

  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.large,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30, marginTop: -2 },

  // ── Modal ─────────────────────────────────────────────────────────────────
  modalSafe:    { flex: 1, backgroundColor: theme.colors.background },
  modalContent: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xxl },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  cancelText:  { ...theme.typography.body, color: theme.colors.textSecondary },
  modalTitle:  { ...theme.typography.h3, color: theme.colors.text },
  saveBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  fieldLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: theme.spacing.md,
  },

  textArea: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    ...theme.typography.body,
    color: theme.colors.text,
    minHeight: 160,
  },
  charCount: {
    ...theme.typography.small,
    color: theme.colors.textLight,
    textAlign: 'right',
    marginTop: 4,
  },

  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  tagChipActive: {
    backgroundColor: theme.colors.primary + '18',
    borderColor: theme.colors.primary,
  },
  tagChipText:       { ...theme.typography.small, color: theme.colors.textSecondary },
  tagChipTextActive: { color: theme.colors.primaryDark, fontWeight: '600' },

  customTagRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: theme.spacing.sm,
  },
  customTagInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8,
    ...theme.typography.caption,
    color: theme.colors.text,
  },
  addTagBtn: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  addTagText: { ...theme.typography.caption, color: theme.colors.primary, fontWeight: '600' },
});
