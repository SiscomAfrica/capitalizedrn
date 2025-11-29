import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { InvestmentsStackParamList } from '../../types';
import { Button, Input, Badge } from '../../components/common';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { useInvestmentStore } from '../../store/investmentStore';

type ProductDetailsNavigationProp = NativeStackNavigationProp<
  InvestmentsStackParamList,
  'InvestmentDetails'
>;

type ProductDetailsRouteProp = RouteProp<
  InvestmentsStackParamList,
  'InvestmentDetails'
>;

export const ProductDetailsScreen: React.FC = () => {
  const navigation = useNavigation<ProductDetailsNavigationProp>();
  const route = useRoute<ProductDetailsRouteProp>();
  const { investmentId: productSlug } = route.params;

  const {
    selectedProduct,
    productsLoading,
    projection,
    projectionLoading,
    fetchProductDetails,
    calculateProjection,
    clearProjection,
  } = useInvestmentStore();

  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [showProjection, setShowProjection] = useState(false);

  useEffect(() => {
    loadProductDetails();
    
    return () => {
      clearProjection();
    };
  }, [productSlug]);

  const loadProductDetails = async () => {
    try {
      await fetchProductDetails(productSlug);
    } catch (error) {
      console.error('Failed to load product details:', error);
      Alert.alert('Error', 'Failed to load product details');
    }
  };

  const validateAmount = (value: string): boolean => {
    const numValue = parseFloat(value);

    if (!value || isNaN(numValue)) {
      setAmountError('Please enter a valid amount');
      return false;
    }

    if (numValue < (selectedProduct?.minimum_investment || 0)) {
      setAmountError(
        `Minimum investment is $${selectedProduct?.minimum_investment.toLocaleString()}`
      );
      return false;
    }

    setAmountError('');
    return true;
  };

  const handleCalculateProjection = async () => {
    if (!validateAmount(amount)) {
      return;
    }

    const numAmount = parseFloat(amount);
    try {
      await calculateProjection(productSlug, numAmount);
      setShowProjection(true);
    } catch (error) {
      console.error('Failed to calculate projection:', error);
      Alert.alert('Error', 'Failed to calculate investment projection');
    }
  };

  const handleConfirmInvestment = () => {
    if (!validateAmount(amount)) {
      return;
    }

    const numAmount = parseFloat(amount);
    
    Alert.alert(
      'Confirm Investment',
      `You are about to invest $${numAmount.toLocaleString()} in ${selectedProduct?.name}. This will initiate an STK Push to your phone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // TODO: Navigate to investment confirmation screen
            navigation.navigate('InvestmentConfirmation', {
              investmentId: productSlug,
              amount: numAmount,
            });
          },
        },
      ]
    );
  };

  const formatType = (type: string) => {
    return type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (productsLoading && !selectedProduct) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading product details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!selectedProduct) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Product Not Found</Text>
          <Text style={styles.errorText}>
            The requested investment product could not be found.
          </Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Investment Details</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Product Header */}
        <View style={styles.productHeader}>
          <View style={styles.badges}>
            <Badge
              label={formatType(selectedProduct.investment_type)}
              variant="default"
              size="medium"
            />
            {selectedProduct.category && (
              <Badge
                label={selectedProduct.category.name}
                variant="default"
                size="medium"
              />
            )}
          </View>
          <Text style={styles.productTitle}>{selectedProduct.name}</Text>
          {selectedProduct.description && (
            <Text style={styles.productDescription}>
              {selectedProduct.description}
            </Text>
          )}
        </View>

        {/* Key Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Price per Unit</Text>
              <Text style={styles.infoValue}>
                ${selectedProduct.price_per_unit.toLocaleString()}
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Min. Investment</Text>
              <Text style={styles.infoValue}>
                ${selectedProduct.minimum_investment.toLocaleString()}
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Expected Return</Text>
              <Text style={[styles.infoValue, { color: colors.success }]}>
                {selectedProduct.expected_annual_return}% p.a.
              </Text>
            </View>
            {selectedProduct.investment_duration_months && (
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Duration</Text>
                <Text style={styles.infoValue}>
                  {selectedProduct.investment_duration_months} months
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Features */}
        {selectedProduct.features && selectedProduct.features.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            {selectedProduct.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureBullet}>•</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Technical Specs */}
        {selectedProduct.technical_specs &&
          Object.keys(selectedProduct.technical_specs).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Technical Specifications</Text>
              <View style={styles.specsContainer}>
                {Object.entries(selectedProduct.technical_specs).map(
                  ([key, value]) => (
                    <View key={key} style={styles.specRow}>
                      <Text style={styles.specKey}>
                        {key.replace(/_/g, ' ').toUpperCase()}:
                      </Text>
                      <Text style={styles.specValue}>{String(value)}</Text>
                    </View>
                  )
                )}
              </View>
            </View>
          )}

        {/* Investment Calculator */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calculate Your Investment</Text>
          <Input
            label="Investment Amount ($)"
            placeholder="Enter amount (min. 150,000 KES)"
            value={amount}
            onChangeText={(text) => {
              setAmount(text);
              setAmountError('');
              setShowProjection(false);
            }}
            keyboardType="numeric"
            error={amountError}
          />
          <Button
            title={projectionLoading ? 'Calculating...' : 'Calculate Returns'}
            onPress={handleCalculateProjection}
            variant="secondary"
            disabled={projectionLoading}
          />
        </View>

        {/* Projection Results */}
        {showProjection && projection && (
          <View style={styles.projectionSection}>
            <Text style={styles.sectionTitle}>Investment Projection</Text>
            <View style={styles.projectionSummary}>
              <View style={styles.projectionItem}>
                <Text style={styles.projectionLabel}>Initial Investment</Text>
                <Text style={styles.projectionValue}>
                  ${projection.investment_amount.toLocaleString()}
                </Text>
              </View>
              <View style={styles.projectionItem}>
                <Text style={styles.projectionLabel}>Duration</Text>
                <Text style={styles.projectionValue}>
                  {projection.duration_years} years
                </Text>
              </View>
              <View style={styles.projectionItem}>
                <Text style={styles.projectionLabel}>Total Return</Text>
                <Text style={[styles.projectionValue, { color: colors.success }]}>
                  ${projection.total_return.toLocaleString()}
                </Text>
              </View>
              <View style={styles.projectionItem}>
                <Text style={styles.projectionLabel}>Final Value</Text>
                <Text style={[styles.projectionValue, { color: colors.primary }]}>
                  ${projection.final_value.toLocaleString()}
                </Text>
              </View>
              <View style={styles.projectionItem}>
                <Text style={styles.projectionLabel}>ROI</Text>
                <Text style={[styles.projectionValue, { color: colors.success }]}>
                  {projection.roi_percentage}%
                </Text>
              </View>
            </View>

            {/* Yearly Breakdown */}
            <View style={styles.yearlyBreakdown}>
              <Text style={styles.breakdownTitle}>Yearly Returns</Text>
              {projection.yearly_returns.map((yearData) => (
                <View key={yearData.year} style={styles.yearRow}>
                  <Text style={styles.yearText}>Year {yearData.year}</Text>
                  <View style={styles.yearValues}>
                    <Text style={styles.yearReturn}>
                      +${yearData.return.toLocaleString()}
                    </Text>
                    <Text style={styles.yearCumulative}>
                      Total: ${yearData.cumulative.toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Button
            title="Confirm Investment"
            onPress={handleConfirmInvestment}
            variant="primary"
            disabled={!amount || !!amountError}
          />
        </View>
      </ScrollView>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    paddingVertical: spacing.sm,
  },
  backButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginTop: spacing.sm,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  errorTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  productHeader: {
    padding: spacing.xl,
    backgroundColor: colors.white,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  productTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  productDescription: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  section: {
    padding: spacing.xl,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  infoCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.gray100,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  infoLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  featureBullet: {
    fontSize: typography.fontSize.lg,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  featureText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  specsContainer: {
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  specKey: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  specValue: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  projectionSection: {
    padding: spacing.xl,
    backgroundColor: colors.primaryLight + '10',
  },
  projectionSummary: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
    marginBottom: spacing.lg,
  },
  projectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  projectionLabel: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  projectionValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  yearlyBreakdown: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  breakdownTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  yearRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  yearText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  yearValues: {
    alignItems: 'flex-end',
  },
  yearReturn: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.success,
  },
  yearCumulative: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  actionSection: {
    padding: spacing.xl,
  },
});
