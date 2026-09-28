import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
import { theme } from '../src/theme';
import { BottomNav } from '../src/components/BottomNav';
import { 
  ChevronLeft, 
  UserPlus, 
  Swords, 
  Search, 
  X, 
  UserCheck 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../src/store/useUserStore';
import { firebaseFriendsService, FriendUser } from '../src/services/firebaseFriendsService';

const DEFAULT_FRIENDS: FriendUser[] = [
  {
    id: 'f_1',
    name: 'Thiago Silva',
    status: 'Jogando agora 🎮',
    statusColor: theme.colors.success.greenDark,
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Thiago',
    online: true,
    playing: true,
    level: 8,
    title: 'Estrategista',
    totalXp: 5400,
  },
  {
    id: 'f_2',
    name: 'Beatriz Nunes',
    status: 'Online',
    statusColor: theme.colors.text.muted,
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Beatriz',
    online: true,
    playing: false,
    level: 6,
    title: 'Curiosa',
    totalXp: 3800,
  },
  {
    id: 'f_3',
    name: 'Mariana Costa',
    status: 'Jogando agora 🎮',
    statusColor: theme.colors.success.greenDark,
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Mariana',
    online: true,
    playing: true,
    level: 11,
    title: 'Mestre Curioso',
    totalXp: 9800,
  },
  {
    id: 'f_4',
    name: 'Carlos Abreu',
    status: 'há 2h',
    statusColor: theme.colors.text.muted,
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Carlos',
    online: false,
    playing: false,
    level: 4,
    title: 'Aspirante',
    totalXp: 2100,
  }
];

export default function FriendsScreen() {
  const router = useRouter();
  const { id: currentUserId } = useUserStore();

  const [activeTab, setActiveTab] = useState<'all' | 'online'>('all');
  const [friends, setFriends] = useState<FriendUser[]>(DEFAULT_FRIENDS);
  
  // Modal Adicionar Amigo
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const loadFriends = useCallback(async () => {
    if (!currentUserId) return;
    const remoteFriends = await firebaseFriendsService.getFriendsList(currentUserId);
    if (remoteFriends && remoteFriends.length > 0) {
      setFriends(remoteFriends);
    }
  }, [currentUserId]);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const handleAddFriendSubmit = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Atenção', 'Digite o nome, e-mail ou ID do jogador.');
      return;
    }

    setIsAdding(true);
    const result = await firebaseFriendsService.addFriend(currentUserId, searchQuery.trim());
    setIsAdding(false);

    if (result.success && result.friend) {
      setFriends((prev) => [result.friend!, ...prev.filter((f) => f.id !== result.friend!.id)]);
      setModalVisible(false);
      setSearchQuery('');
      Alert.alert('Amigo Adicionado! 🎉', result.message);
    } else {
      Alert.alert('Atenção', result.message);
    }
  };

  const handleChallengeFriend = (friend: FriendUser) => {
    Alert.alert(
      'Desafiar para Duelo 1v1! ⚔️',
      `Deseja iniciar uma batalha contra ${friend.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Desafiar Agora!', 
          onPress: () => router.push('/matchmaking') 
        }
      ]
    );
  };

  const displayedFriends = activeTab === 'all' 
    ? friends 
    : friends.filter((f) => f.online);

  const onlineCount = friends.filter((f) => f.online).length;

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <ChevronLeft size={28} color={theme.colors.brand.magenta} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Amigos ({friends.length})</Text>
          </View>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setModalVisible(true)}
          >
            <UserPlus size={26} color={theme.colors.brand.magenta} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.tabActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>Todos</Text>
            {activeTab === 'all' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'online' && styles.tabActive]}
            onPress={() => setActiveTab('online')}
          >
            <Text style={[styles.tabText, activeTab === 'online' && styles.tabTextActive]}>
              Online ({onlineCount})
            </Text>
            {activeTab === 'online' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>

        {/* Friends List */}
        <ScrollView 
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {displayedFriends.map((friend) => (
            <TouchableOpacity 
              key={friend.id} 
              style={[styles.friendCard, !friend.online && styles.friendCardOffline]}
              activeOpacity={0.8}
            >
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: friend.avatar }} 
                  style={[styles.avatar, !friend.online && styles.avatarOffline]} 
                />
                <View style={[
                  styles.statusDot, 
                  friend.online ? styles.statusOnline : styles.statusOffline
                ]} />
              </View>

              <View style={styles.infoContainer}>
                <Text style={[styles.friendName, !friend.online && styles.textOffline]} numberOfLines={1}>
                  {friend.name}
                </Text>
                <Text style={[styles.friendStatus, !friend.online && styles.textOffline]}>
                  Nível {friend.level} • {friend.status}
                </Text>
              </View>

              <View style={styles.actionsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.actionButton, 
                    friend.playing 
                      ? styles.actionPlayActive 
                      : (friend.online ? styles.actionPlayOnline : styles.actionPlayOffline)
                  ]}
                  disabled={!friend.online}
                  onPress={() => handleChallengeFriend(friend)}
                >
                  <Swords 
                    size={20} 
                    color={friend.playing ? '#FFF' : (friend.online ? theme.colors.brand.magenta : 'rgba(100,116,139,0.4)')} 
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* Modal Adicionar Amigo */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <UserCheck size={24} color={theme.colors.brand.magenta} />
                <Text style={styles.modalTitle}>Adicionar Amigo</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={22} color={theme.colors.text.muted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Digite o nome de jogador, e-mail ou ID para enviar um convite e desafiar seus amigos no BrainPOP.
            </Text>

            <View style={styles.modalInputWrapper}>
              <Search size={20} color={theme.colors.text.muted} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Nome, e-mail ou ID do jogador"
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                style={styles.modalInput}
              />
            </View>

            <TouchableOpacity 
              style={[styles.modalSubmitBtn, isAdding && styles.btnDisabled]}
              disabled={isAdding}
              onPress={handleAddFriendSubmit}
              activeOpacity={0.85}
            >
              {isAdding ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.modalSubmitText}>ADICIONAR AMIGO</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg.app,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#FFF',
    ...theme.shadows.pillowy,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.text.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.soft,
    marginBottom: 8,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    position: 'relative',
  },
  tabActive: {},
  tabText: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.muted,
  },
  tabTextActive: {
    color: theme.colors.brand.magenta,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: theme.colors.brand.magenta,
    borderRadius: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120,
    gap: 10,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#FFF',
    borderRadius: theme.radius.xl,
    ...theme.shadows.pillowy,
  },
  friendCardOffline: {
    backgroundColor: '#F8FAFC',
    opacity: 0.85,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarOffline: {
    opacity: 0.6,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  statusOnline: {
    backgroundColor: theme.colors.success.green,
  },
  statusOffline: {
    backgroundColor: theme.colors.text.muted,
  },
  infoContainer: {
    flex: 1,
  },
  friendName: {
    fontSize: 15,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  friendStatus: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  textOffline: {
    color: theme.colors.text.muted,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPlayActive: {
    backgroundColor: theme.colors.brand.magenta,
    ...theme.shadows.magentaGlow,
  },
  actionPlayOnline: {
    backgroundColor: theme.colors.brand.magenta + '15',
  },
  actionPlayOffline: {
    backgroundColor: theme.colors.bg.soft,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#FFF',
    borderRadius: theme.radius['2xl'],
    padding: 20,
    ...theme.shadows.card,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.black,
    color: theme.colors.text.primary,
  },
  modalSub: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.muted,
    lineHeight: 18,
    marginBottom: 16,
  },
  modalInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.bg.soft,
    borderRadius: theme.radius.xl,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 16,
  },
  modalInput: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  modalSubmitBtn: {
    backgroundColor: theme.colors.brand.magenta,
    borderRadius: theme.radius.xl,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.magentaGlow,
  },
  modalSubmitText: {
    color: '#FFF',
    fontFamily: theme.typography.fontFamily.black,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
