import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, {
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

const CHART_HEIGHT  = 180;
const PAD           = { top: 20, bottom: 36, left: 32, right: 16 };
const SCREEN_WIDTH  = Dimensions.get('window').width;
const CHART_WIDTH   = SCREEN_WIDTH - 48; // parent has 24px padding each side

/** Smooth cubic-bezier path through an array of points. */
function buildSmoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const cpx = (p0.x + p1.x) / 2;
    d += ` C ${cpx} ${p0.y} ${cpx} ${p1.y} ${p1.x} ${p1.y}`;
  }
  return d;
}

/** Close the smooth path down to the baseline for the gradient fill. */
function buildSmoothAreaPath(
  pts: { x: number; y: number }[],
  baseline: number,
): string {
  if (pts.length < 2) return '';
  const line = buildSmoothPath(pts);
  return `${line} L ${pts[pts.length - 1].x} ${baseline} L ${pts[0].x} ${baseline} Z`;
}

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

  const smoothLinePath = useMemo(() => buildSmoothPath(points), [points]);

  const areaPath = useMemo(() => {
    if (points.length < 2) return '';
    const baseline = PAD.top + innerH;
    return buildSmoothAreaPath(points, baseline);
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
          <Stop offset="0%"   stopColor={theme.colors.primary} stopOpacity={0.30} />
          <Stop offset="70%"  stopColor={theme.colors.primary} stopOpacity={0.08} />
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

      {/* Smooth line */}
      {smoothLinePath ? (
        <Path
          d={smoothLinePath}
          fill="none"
          stroke={theme.colors.primary}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}

      {/* Data points */}
      {points.map((p, i) => (
        <React.Fragment key={i}>
          <Circle cx={p.x} cy={p.y} r={7} fill={theme.colors.mood[p.mood]} opacity={0.15} />
          <Circle cx={p.x} cy={p.y} r={5} fill={theme.colors.mood[p.mood]} stroke="white" strokeWidth={2} />
        </React.Fragment>
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
