import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Polyline,
  Circle,
  Line,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  Path,
} from 'react-native-svg';
import dayjs from 'dayjs';
import { theme } from '../constants/theme';
import type { MoodEntry } from '../types';

interface Props {
  data: MoodEntry[];
}

const CHART_HEIGHT  = 160;
const PAD           = { top: 16, bottom: 32, left: 28, right: 12 };
const SCREEN_WIDTH  = Dimensions.get('window').width;
const CHART_WIDTH   = SCREEN_WIDTH - 48; // parent has 24px padding each side

export default function MoodTrendChart({ data }: Props) {
  const innerW = CHART_WIDTH - PAD.left - PAD.right;
  const innerH = CHART_HEIGHT - PAD.top - PAD.bottom;

  const points = useMemo(() => {
    if (data.length === 0) return [];
    return data.map((d, i) => {
      const x = PAD.left + (i / Math.max(data.length - 1, 1)) * innerW;
      const y = PAD.top  + innerH - ((d.mood - 1) / 4) * innerH;
      return { x, y, mood: d.mood, date: d.date };
    });
  }, [data, innerW, innerH]);

  const polylineStr = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Build a closed area path for the gradient fill
  const areaPath = useMemo(() => {
    if (points.length < 2) return '';
    const bottom = PAD.top + innerH;
    const first  = points[0];
    const last   = points[points.length - 1];
    const line   = points.map((p) => `${p.x},${p.y}`).join(' L ');
    return `M ${first.x},${bottom} L ${line} L ${last.x},${bottom} Z`;
  }, [points, innerH]);

  if (data.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Log your first mood to see trends here.</Text>
      </View>
    );
  }

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      <Defs>
        <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%"   stopColor={theme.colors.primary} stopOpacity={0.18} />
          <Stop offset="100%" stopColor={theme.colors.primary} stopOpacity={0}    />
        </LinearGradient>
      </Defs>

      {/* Horizontal grid lines for moods 1–5 */}
      {[1, 2, 3, 4, 5].map((mood) => {
        const y = PAD.top + innerH - ((mood - 1) / 4) * innerH;
        return (
          <React.Fragment key={mood}>
            <Line
              x1={PAD.left} y1={y}
              x2={CHART_WIDTH - PAD.right} y2={y}
              stroke={theme.colors.border}
              strokeWidth={1}
              strokeDasharray={mood === 3 ? '4,4' : undefined}
            />
            <SvgText
              x={PAD.left - 5}
              y={y + 4}
              textAnchor="end"
              fontSize={9}
              fill={theme.colors.textLight}
            >
              {mood}
            </SvgText>
          </React.Fragment>
        );
      })}

      {/* Area fill */}
      {areaPath ? (
        <Path d={areaPath} fill="url(#areaGrad)" />
      ) : null}

      {/* Line */}
      {points.length > 1 && (
        <Polyline
          points={polylineStr}
          fill="none"
          stroke={theme.colors.primary}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* Data points */}
      {points.map((p, i) => (
        <Circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={5}
          fill={theme.colors.mood[p.mood]}
          stroke="white"
          strokeWidth={1.5}
        />
      ))}

      {/* X-axis date labels — show first, last, and a few in between */}
      {points.map((p, i) => {
        const showLabel =
          i === 0 ||
          i === points.length - 1 ||
          (points.length <= 7) ||
          (points.length > 7 && i % Math.floor(points.length / 4) === 0);
        if (!showLabel) return null;
        return (
          <SvgText
            key={i}
            x={p.x}
            y={CHART_HEIGHT - 6}
            textAnchor="middle"
            fontSize={9}
            fill={theme.colors.textSecondary}
          >
            {dayjs(p.date).format('M/D')}
          </SvgText>
        );
      })}
    </Svg>
  );
}

const styles = StyleSheet.create({
  empty: {
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
