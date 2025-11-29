import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MainTabParamList } from '../types';
import { InvestmentsNavigator } from './InvestmentsNavigator';
import { CommunityScreen } from '../screens/community/CommunityScreen';
import { ProfileScreen } from '../screens/profile';
import { colors, spacing } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray500,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tab.Screen
        name="Investments"
        component={InvestmentsNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon name={focused ? 'trending-up' : 'trending-up-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Portfolio"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon name={focused ? 'briefcase' : 'briefcase-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon name={focused ? 'people' : 'people-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});

