import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { InvestmentsStackParamList } from '../../types';
import { InvestmentProductCard } from '../../components/cards';
import { colors, spacing, typography } from '../../theme';
import { useInvestmentStore } from '../../store/investmentStore';
import { InvestmentType, ProductStatus } from '../../types/api';

type InvestmentListNavigationProp = NativeStackNavigationProp<
  InvestmentsStackParamList,
  'InvestmentList'
>;

// Mock data - will be replaced with API call
const mockInvestments: Investment[] = [
  {
    id: '1',
    title: 'Siscom Infrastructure Bond',
    description:
      'Invest in critical infrastructure development across Kenya. This bond offers stable returns with low risk.',
    category: 'Infrastructure',
    riskLevel: 'LOW',
    minInvestment: 50000,
    targetAmount: 10000000,
    raisedAmount: 8500000,
    expectedReturn: 12.5,
    risks: [
      'Interest rate fluctuation',
      'Economic downturn',
      'Regulatory changes',
    ],
    image: 'https://via.placeholder.com/400x250',
    status: 'active',
  },
  {
    id: '2',
    title: 'Tech Startup Equity Fund',
    description:
      'Get equity in promising African tech startups. High growth potential with diversified portfolio.',
    category: 'Technology',
    riskLevel: 'HIGH',
    minInvestment: 100000,
    targetAmount: 5000000,
    raisedAmount: 2300000,
    expectedReturn: 250,
    risks: [
      'Startup failure risk',
      'Market volatility',
      'Illiquidity',
      'Valuation uncertainty',
    ],
    image: 'https://via.placeholder.com/400x250',
    status: 'active',
  },
  {
    id: '3',
    title: 'Real Estate Development',
    description:
      'Commercial property development in Nairobi CBD. Moderate risk with tangible asset backing.',
    category: 'Real Estate',
    riskLevel: 'MEDIUM',
    minInvestment: 250000,
    targetAmount: 20000000,
    raisedAmount: 15600000,
    expectedReturn: 45,
    risks: [
      'Construction delays',
      'Market demand fluctuation',
      'Regulatory approvals',
    ],
    image: 'https://via.placeholder.com/400x250',
    status: 'active',
  },
];

export const InvestmentListScreen: React.FC = () => {
  const navigation = useNavigation<InvestmentListNavigationProp>();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvestments();
  }, []);

  const loadInvestments = async () => {
    try {
      // TODO: Call API GET /api/opportunities
      await new Promise<void>(resolve => setTimeout(resolve, 800));
      setInvestments(mockInvestments);
    } catch (error) {
      console.error('Failed to load investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvestmentPress = (investment: Investment) => {
    navigation.navigate('InvestmentDetails', { investmentId: investment.id });
  };

  const renderInvestment = ({ item }: { item: Investment }) => (
    <InvestmentCard
      investment={item}
      onPress={() => handleInvestmentPress(item)}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>INVESTMENT OPPORTUNITIES</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>INVESTMENT OPPORTUNITIES</Text>
        <Text style={styles.headerSubtitle}>
          Browse and invest in exciting opportunities
        </Text>
      </View>

      <FlatList
        data={investments}
        renderItem={renderInvestment}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.white,
    opacity: 0.9,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: spacing.lg,
  },
  separator: {
    height: spacing.lg,
  },
});
