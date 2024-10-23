import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import vector icons

const ProfileScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back-outline" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity>
          <Icon name="ellipsis-vertical-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <Icon name="person-circle-outline" size={80} color="#6D7DFF" /> {/* Replaced image with icon */}
        <View style={styles.profileDetails}>
          <Text style={styles.name}>Yobi</Text>
          <Text style={styles.subText}>Afvallen</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Wijzigen</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>180cm</Text>
          <Text style={styles.statLabel}>Lengte</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>65kg</Text>
          <Text style={styles.statLabel}>Gewicht</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>22</Text>
          <Text style={styles.statLabel}>Leeftijd</Text>
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {renderAccountItem('Persoonlijke Gegevens', 'person-outline')}
        {renderAccountItem('Prestaties', 'trophy-outline')}
        {renderAccountItem('Activiteit Geschiedenis', 'time-outline')}
        {renderAccountItem('Workout Voortgang', 'barbell-outline')}
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meldingen</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Pop-up Meldingen</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>

      {/* Other Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overig</Text>
        {renderAccountItem('Contact', 'call-outline')}
        {renderAccountItem('Privacy Policy', 'lock-closed-outline')}
        {renderAccountItem('Instellingen', 'settings-outline')}
      </View>
    </ScrollView>
  );
};

// Helper function to render Account items with icons
const renderAccountItem = (title: string, iconName: string) => (
  <View style={styles.accountRow}>
    <Icon name={iconName} size={24} color="#000" />
    <Text style={styles.accountText}>{title}</Text>
    <Icon name="chevron-forward-outline" size={24} color="#000" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  profileDetails: {
    flex: 1,
    marginLeft: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subText: {
    color: '#888',
    marginTop: 5,
  },
  editButton: {
    backgroundColor: '#E3E7FE',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#6D7DFF',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#888',
  },
  section: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  accountText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchLabel: {
    fontSize: 16,
  },
});

export default ProfileScreen;
