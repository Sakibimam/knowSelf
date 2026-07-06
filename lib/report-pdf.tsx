import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { InterpretationsData } from "@/lib/interpretations";
import type { QuizResult } from "@/lib/quiz-types";

type ReportProps = {
  identity: { eyebrow: string; label: string; lines: string[] };
  results: QuizResult[];
  interpretations: InterpretationsData;
  traitNames: Record<string, string>;
  quizTitle: string;
};

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjQ.ttf",
      fontWeight: 600,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    padding: 40,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 24,
    borderBottom: "1 solid #e5e5e5",
    paddingBottom: 16,
  },
  eyebrow: {
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#6b7280",
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 10,
    color: "#6b7280",
  },
  narrativeBlock: {
    marginBottom: 20,
  },
  narrativeLine: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#374151",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 10,
    marginTop: 20,
  },
  traitBlock: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottom: "1 solid #f3f4f6",
  },
  traitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  traitName: {
    fontSize: 11,
    fontWeight: 600,
  },
  traitScore: {
    fontSize: 9,
    color: "#6b7280",
  },
  barContainer: {
    height: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    marginBottom: 8,
  },
  barFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6366f1",
  },
  traitSummary: {
    fontSize: 9,
    color: "#374151",
    marginBottom: 4,
    lineHeight: 1.5,
  },
  listItem: {
    fontSize: 9,
    color: "#4b5563",
    marginBottom: 2,
    paddingLeft: 8,
  },
  listLabel: {
    fontSize: 9,
    fontWeight: 600,
    color: "#374151",
    marginTop: 4,
    marginBottom: 2,
  },
  disclaimer: {
    marginTop: 24,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
  },
  disclaimerText: {
    fontSize: 8,
    color: "#6b7280",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#9ca3af",
  },
});

export function ReportPDF({
  identity,
  results,
  interpretations,
  traitNames,
  quizTitle,
}: ReportProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{identity.eyebrow}</Text>
          <Text style={styles.title}>{identity.label}</Text>
          <Text style={styles.subtitle}>{quizTitle} — Personality Report</Text>
        </View>

        <View style={styles.narrativeBlock}>
          {identity.lines.map((line, i) => (
            <Text key={i} style={styles.narrativeLine}>
              {line}
            </Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Trait Scores</Text>

        {results.map((r) => {
          const interpretation = interpretations.traits[r.trait];
          const band = interpretation?.[r.level];
          const name = traitNames[r.trait] || r.trait;

          return (
            <View key={r.trait} style={styles.traitBlock}>
              <View style={styles.traitHeader}>
                <Text style={styles.traitName}>{name}</Text>
                <Text style={styles.traitScore}>
                  {r.percentIndex}% — {r.level}
                </Text>
              </View>

              <View style={styles.barContainer}>
                <View
                  style={[styles.barFill, { width: `${r.percentIndex}%` }]}
                />
              </View>

              {band && (
                <>
                  <Text style={styles.traitSummary}>{band.summary}</Text>

                  <Text style={styles.listLabel}>Strengths:</Text>
                  {band.strengths.map((s, i) => (
                    <Text key={i} style={styles.listItem}>
                      • {s}
                    </Text>
                  ))}

                  <Text style={styles.listLabel}>Blind spots:</Text>
                  {band.blindSpots.map((s, i) => (
                    <Text key={i} style={styles.listItem}>
                      • {s}
                    </Text>
                  ))}
                </>
              )}
            </View>
          );
        })}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            {interpretations.globalDisclaimer}
          </Text>
          <Text style={[styles.disclaimerText, { marginTop: 4 }]}>
            {interpretations.confidenceNote}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>Trait — Personality Report</Text>
          <Text>Generated for personal use only</Text>
        </View>
      </Page>
    </Document>
  );
}
