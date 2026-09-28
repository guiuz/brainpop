import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { useRouter, usePathname } from 'expo-router';
import { ShoppingBag, Trophy, Home, User, Settings } from 'lucide-react-native';

export const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const NAV_ITEMS = [
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
    { name: 'Tournaments', path: '/tournaments', icon: Trophy },
    { name: 'Home', path: '/home', icon: Home, isCenter: true },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.path;
        const Icon = item.icon;

        if (item.isCenter) {
          return (
            <TouchableOpacity 
              key={item.path}
              style={styles.centerItem}
              onPress={() => router.push('/home')}
              activeOpacity={0.8}
            >
              <View style={[styles.centerIconBox, isActive && styles.centerIconBoxActive]}>
                <Icon color={isActive ? '#FFF' : theme.colors.brand.magenta} size={28} />
              </View>
              <Text style={[styles.navText, isActive && styles.navTextActive]}>{item.name}</Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity 
            key={item.path}
            style={styles.navItem}
            onPress={() => router.push(item.path as any)}
            activeOpacity={0.8}
          >
            <Icon color={isActive ? theme.colors.brand.magenta : theme.colors.text.muted} size={24} />
            <Text style={[styles.navText, isActive && styles.navTextActive]}>{item.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: theme.spacing.safeAreaBottom - 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...theme.shadows.card,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  centerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: -20,
  },
  centerIconBox: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: theme.colors.brand.magenta + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  centerIconBoxActive: {
    backgroundColor: theme.colors.brand.magenta,
    ...theme.shadows.magentaGlow,
  },
  navText: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.muted,
    marginTop: 4,
  },
  navTextActive: {
    color: theme.colors.brand.magenta,
  },
});
