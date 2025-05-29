import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#6b21a8',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: '#6b21a8',
    borderBottom: '1px solid #6b21a8',
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '40%',
    fontSize: 12,
    color: '#4b5563',
  },
  value: {
    width: '60%',
    fontSize: 12,
    fontWeight: 'bold',
  },
  prediction: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.5,
  },
});

interface KundliPDFProps {
  kundliData: {
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
  };
  generatedKundli: {
    rashi: string;
    nakshatra: string;
    gothra: string;
    manglikStatus: string;
    planetaryPositions: {
      sun: string;
      moon: string;
      mars: string;
      mercury: string;
      jupiter: string;
      venus: string;
      saturn: string;
      rahu: string;
      ketu: string;
    };
    predictions: {
      career: string;
      marriage: string;
      health: string;
      wealth: string;
    };
    detailedAnalysis: {
      personality: string;
      education: string;
      family: string;
      relationships: string;
      careerProspects: string;
      healthAspects: string;
      financialProspects: string;
      remedies: string[];
    };
    compatibility: {
      bestMatches: string[];
      avoidMatches: string[];
      compatibilityScore: number;
    };
    auspiciousTimings: {
      marriage: string;
      career: string;
      education: string;
      travel: string;
    };
  };
}

const KundliPDF = ({ kundliData, generatedKundli }: KundliPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Kundli Report</Text>

      {/* Basic Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>{kundliData.dateOfBirth}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Time of Birth:</Text>
          <Text style={styles.value}>{kundliData.timeOfBirth}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Place of Birth:</Text>
          <Text style={styles.value}>{kundliData.placeOfBirth}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Rashi (Moon Sign):</Text>
          <Text style={styles.value}>{generatedKundli.rashi}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Nakshatra:</Text>
          <Text style={styles.value}>{generatedKundli.nakshatra}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gothra:</Text>
          <Text style={styles.value}>{generatedKundli.gothra}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Manglik Status:</Text>
          <Text style={styles.value}>{generatedKundli.manglikStatus}</Text>
        </View>
      </View>

      {/* Planetary Positions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Planetary Positions</Text>
        {generatedKundli.planetaryPositions && typeof generatedKundli.planetaryPositions === 'object' ? Object.entries(generatedKundli.planetaryPositions).map(([planet, position]) => (
          <View key={planet} style={styles.row}>
            <Text style={styles.label}>{planet.charAt(0).toUpperCase() + planet.slice(1)}:</Text>
            <Text style={styles.value}>{position}</Text>
          </View>
        )) : null}
      </View>

      {/* Detailed Analysis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detailed Analysis</Text>
        {generatedKundli.detailedAnalysis && typeof generatedKundli.detailedAnalysis === 'object' ? Object.entries(generatedKundli.detailedAnalysis).map(([aspect, description]) => (
          <View key={aspect} style={styles.section}>
            <Text style={styles.label}>{aspect.charAt(0).toUpperCase() + aspect.slice(1)}:</Text>
            <Text style={styles.prediction}>{description}</Text>
          </View>
        )) : null}
      </View>

      {/* Compatibility */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compatibility</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Best Matches:</Text>
          <Text style={styles.value}>{generatedKundli.compatibility.bestMatches.join(', ')}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Avoid Matches:</Text>
          <Text style={styles.value}>{generatedKundli.compatibility.avoidMatches.join(', ')}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Compatibility Score:</Text>
          <Text style={styles.value}>{generatedKundli.compatibility.compatibilityScore}%</Text>
        </View>
      </View>

      {/* Auspicious Timings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Auspicious Timings</Text>
        {Object.entries(generatedKundli.auspiciousTimings).map(([event, timing]) => (
          <View key={event} style={styles.row}>
            <Text style={styles.label}>{event.charAt(0).toUpperCase() + event.slice(1)}:</Text>
            <Text style={styles.value}>{timing}</Text>
          </View>
        ))}
      </View>

      {/* Remedies */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Remedies</Text>
        {Array.isArray(generatedKundli.detailedAnalysis.remedies) ? generatedKundli.detailedAnalysis.remedies.map((remedy, index) => (
          <Text key={index} style={styles.prediction}>• {remedy}</Text>
        )) : null}
      </View>
    </Page>
  </Document>
);

export default KundliPDF; 