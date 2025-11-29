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
  RefreshControl,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { InvestmentsStackParamList } from '../../types';
import { InvestmentProductCard } from '../../components/cards';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { useInvestmentStore } from '../../store/investmentStore';
import { InvestmentType, InvestmentProduct } from '../../types/api';

type InvestmentListNavigationProp = NativeStackNavigationProp<
  InvestmentsStackParamList,
  'InvestmentList'
>;

const investmentTypes: { label: string; value: InvestmentType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Micro Node', value: 'micro-node' },
  { label: 'Mega Node', value: 'mega-node' },
  { label: 'Full Node', value: 'full-node' },
  { label: 'Terranode', value: 'terranode' },
];

export const InvestmentListScreen: React.FC = () => {
  const navigation = useNavigation<InvestmentListNavigationProp>();
  
  const {
    products,
    productsLoading,
    productsError,
    categories,
    fetchProducts,
    fetchCategories,
    setFilters,
    filters,
  } = useInvestmentStore();

  const [selectedType, setSelectedType] = useState<InvestmentType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchProducts(filters);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const newFilters = { ...filters, search: text, page: 1 };
    setFilters(newFilters);
    fetchProducts(newFilters);
  };

  const handleTypeFilter = (type: InvestmentType | 'all') => {
    setSelectedType(type);
    const newFilters = {
      ...filters,
      investment_type: type === 'all' ? undefined : type,
      page: 1,
    };
    setFilters(newFilters);
    fetchProducts(newFilters);
  };

  const handleProductPress = (product: InvestmentProduct) => {
    navigation.navigate('InvestmentDetails', { investmentId: product.slug });
  };

  const renderProduct = ({ item }: { item: InvestmentProduct }) => (
    <InvestmentProductCard
      product={item}
      onPress={() => handleProductPress(item)}
    />
  );

  const renderHeader = () => (
    <>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search investment products..."
          placeholderTextColor={colors.textPlaceholder}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Investment Type:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}>
          {investmentTypes.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.filterChip,
                selectedType === type.value && styles.filterChipActive,
              ]}
              onPress={() => handleTypeFilter(type.value)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.filterChipText,
                  selectedType === type.value && styles.filterChipTextActive,
                ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {productsError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{productsError}</Text>
        </View>
      )}
    </>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Investment Products Found</Text>
      <Text style={styles.emptyText}>
        Try adjusting your filters or check back later for new opportunities.
      </Text>
    </View>
  );

  if (productsLoading && products.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>INVESTMENT OPPORTUNITIES</Text>
          <Text style={styles.headerSubtitle}>
            Browse Siscom Infrastructure Investments
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading investment products...</Text>
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
          Browse Siscom Infrastructure Investments
        </Text>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
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
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  listContent: {
    paddingVertical: spacing.lg,
    flexGrow: 1,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.base,
    borderWidth: 1,
    borderColor: colors.gray200,
    color: colors.textPrimary,
  },
  filterContainer: {
    marginBottom: spacing.md,
  },
  filterLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  filterScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.gray100,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  errorContainer: {
    backgroundColor: colors.error + '15',
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
