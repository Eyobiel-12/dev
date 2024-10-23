import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  TextInput,
  Image,
  FlatList,
  Switch,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Ionicons';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { auth } from './firebaseConfig';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ActivityTracker = () => {
  const [stepCount, setStepCount] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [points, setPoints] = useState(0);
  const [calorieGoal, setCalorieGoal] = useState(450);
  const [stepGoal, setStepGoal] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newGoalModalVisible, setNewGoalModalVisible] = useState(false);
  const [achievementUnlocked, setAchievementUnlocked] = useState(false);
  const [performanceCards, setPerformanceCards] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [badgePopupVisible, setBadgePopupVisible] = useState(false);
  const [isRunningMode, setRunningMode] = useState(false);
  const [error, setError] = useState(null);

  const navigation = useNavigation(); // Initialize navigation

  const daysOfWeek = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];  // Sunday to Saturday
  const db = getDatabase();
  const userId = auth.currentUser?.uid;

  const estimateCaloriesFromSteps = (steps) => steps * (isRunningMode ? 0.06 : 0.045);

  const saveProgressToDatabase = async (steps, calories) => {
    if (userId) {
      try {
        const userRef = ref(db, 'users/' + userId);
        const today = new Date().getDay();
        const data = {
          stepCount: steps,
          caloriesBurned: calories,
          points: points,
          progressData: {
            [today]: {
              day: daysOfWeek[today],
              steps: steps,
              calories: calories,
            },
          },
        };
        await set(userRef, data);
      } catch (err) {
        setError('Fout bij het opslaan van gegevens: ' + err.message);
      }
    }
  };

  const loadProgressFromDatabase = () => {
    if (userId) {
      try {
        const userRef = ref(db, 'users/' + userId);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setStepCount(data.stepCount || 0);
            setCaloriesBurned(data.caloriesBurned || 0);
            setPoints(data.points || 0);
            setProgressData(Object.values(data.progressData || {}));
          }
        });
      } catch (err) {
        setError('Fout bij het laden van gegevens: ' + err.message);
      }
    }
  };

  useEffect(() => {
    Pedometer.isAvailableAsync().then(
      (result) => result,
      (error) => console.log('Pedometer is niet beschikbaar:', error)
    );

    const subscription = Pedometer.watchStepCount((result) => {
      const newSteps = result.steps;
      const newCalories = estimateCaloriesFromSteps(newSteps);
      setStepCount(newSteps);
      setCaloriesBurned(newCalories);
    });

    return () => subscription && subscription.remove();
  }, [isRunningMode]);

  useEffect(() => {
    if (stepCount > 0 || caloriesBurned > 0) {
      saveProgressToDatabase(stepCount, caloriesBurned);
    }
  }, [stepCount, caloriesBurned]);

  useEffect(() => {
    const calculatedStepGoal = Math.round(calorieGoal / (isRunningMode ? 0.06 : 0.045));
    setStepGoal(calculatedStepGoal);
  }, [calorieGoal, isRunningMode]);

  useEffect(() => {
    checkForDailyReset();
  }, []);

  useEffect(() => {
    loadProgressFromDatabase();
  }, []);

  // Handle achievements and awarding points
  useEffect(() => {
    if (stepCount >= stepGoal && caloriesBurned >= calorieGoal && !achievementUnlocked) {
      setAchievementUnlocked(true);

      const newPoints = points + 1;
      setPoints(newPoints);

      if (newPoints === 3) {
        setBadgePopupVisible(true); // Show badge after 3 points
        setPoints(0); // Reset points after badge is earned
      }

      const newAchievement = {
        title: 'Doel bereikt!',
        subtitle: `Stappen: ${stepCount} en Calorieën: ${caloriesBurned.toFixed(2)} verbrand!`,
        achieved: true,
        badge: require('./assets/img/badge.png'), // Add badge image
      };
      setPerformanceCards((prevCards) => [newAchievement, ...prevCards]);

      setNewGoalModalVisible(true);
    }
  }, [stepCount, caloriesBurned, achievementUnlocked]);

  const handleCalorieGoalSubmit = () => {
    setModalVisible(false);
  };

  const handleNewGoalSubmit = () => {
    setNewGoalModalVisible(false);
    setAchievementUnlocked(false);
  };

  const closeBadgePopup = () => {
    setBadgePopupVisible(false);
  };

  // Chart configuration for steps and calories
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(81, 188, 206, ${opacity})`, // Color for steps
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#51BCCE',
    },
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Add the current date display */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{new Date().toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Modal to set calorie goal manually */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Stel je Caloriedoel in</Text>
              <TextInput
                style={styles.input}
                placeholder="Voer aantal calorieën in"
                keyboardType="numeric"
                onChangeText={(value) => setCalorieGoal(Number(value))}
              />
              <TouchableOpacity onPress={handleCalorieGoalSubmit} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Doel instellen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* New goal modal after an achievement */}
        <Modal
          visible={newGoalModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setNewGoalModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => setNewGoalModalVisible(false)} style={styles.closeButton}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Doel behaald! Stel een nieuw doel in</Text>
              <TextInput
                style={styles.input}
                placeholder="Voer het nieuwe aantal calorieën in"
                keyboardType="numeric"
                onChangeText={(value) => setCalorieGoal(Number(value))}
              />
              <TouchableOpacity onPress={handleNewGoalSubmit} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Nieuw doel instellen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Set Goal and Running Mode Toggle */}
        <View style={styles.goalAndRunningModeContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.setGoalButton}>
            <Text style={styles.setGoalText}>Stel je doel in</Text>
          </TouchableOpacity>
          <View style={styles.runningModeContainer}>
            <Text style={styles.runningModeText}>Hardloopmodus</Text>
            <Switch
              value={isRunningMode}
              onValueChange={(value) => setRunningMode(value)}
              trackColor={{ false: '#767577', true: '#51BCCE' }}
              thumbColor={isRunningMode ? '#FFD700' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Daily Goals */}
        <View style={styles.dailyGoalsCard}>
          <Text style={styles.sectionTitle}>Doel van de dag</Text>
          <View style={styles.horizontalCard}>
            {[
              { icon: 'flame-outline', value: `${caloriesBurned.toFixed(2)} Cal`, label: 'Calorieën verbrand', color: '#FF5733' },
              { icon: 'trophy-outline', value: points, label: 'Punten', color: '#FFD700' },
              { icon: 'walk', value: stepCount, label: 'Stappen', color: '#1E90FF' }
            ].map((goal, index) => (
              <View key={index} style={styles.goalCard}>
                <Icon name={goal.icon} size={30} color={goal.color} style={styles.goalIcon} />
                <Text style={styles.goalValue}>{goal.value}</Text>
                <Text style={styles.goalLabel}>{goal.label}</Text>
                {goal.label === 'Calorieën verbrand' && (
                  <Text style={styles.remainingGoal}>
                    {calorieGoal - caloriesBurned > 0
                      ? `${(calorieGoal - caloriesBurned).toFixed(2)} Cal over`
                      : 'Doel bereikt!'}
                  </Text>
                )}
                {goal.label === 'Stappen' && (
                  <Text style={styles.remainingGoal}>
                    {stepGoal - stepCount > 0
                      ? `${stepGoal - stepCount} stappen over`
                      : 'Doel bereikt!'}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Progress Chart */}
        <View style={styles.progressCard}>
          <Text style={styles.chartTitle}>Voortgang</Text>
          <BarChart
            data={{
              labels: progressData.map(item => item.day),
              datasets: [
                {
                  data: progressData.map(item => item.steps),
                  color: (opacity = 1) => `rgba(81, 188, 206, ${opacity})`,
                },
                {
                  data: progressData.map(item => item.calories),
                  color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={{ marginVertical: 10, borderRadius: 16 }}
          />
        </View>

        {/* Achievements */}
        <View style={styles.performanceCardContainer}>
          <Text style={styles.chartTitle}>Prestaties</Text>
          {performanceCards.length > 0 ? (
            <FlatList
              data={performanceCards}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.performanceCard,
                    item.achieved ? styles.goldCard : styles.motivationCard,
                  ]}
                >
                  <Text style={styles.performanceTitle}>{item.title}</Text>
                  <Text style={styles.performanceSubtitle}>{item.subtitle}</Text>
                  {item.achieved && <Text style={styles.congratsText}>Geweldig gedaan! Ga zo door!</Text>}
                  {item.badge && <Image source={item.badge} style={styles.badgeImage} />} {/* Badge image */}
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={true}
              snapToAlignment="center"
              style={styles.performanceList}
              decelerationRate="fast"
            />
          ) : (
            <View style={styles.motivationContainer}>
              <Text style={styles.motivationText}>Nog geen prestaties. Blijf doorgaan om je doelen te bereiken!</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="home-outline" size={30} color="#51BCCE" />
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="trophy-outline" size={30} color="#51BCCE" />
          <Text>Prestaties</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="notifications-outline" size={30} color="#51BCCE" />
          <Text>Notificaties</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="fast-food-outline" size={30} color="#51BCCE" />
          <Text>Voeding</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('ProfileScreen')} // Navigate to ProfileScreen on click
        >
          <Icon name="person-outline" size={30} color="#51BCCE" />
          <Text>Profiel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f9fc',
    flexGrow: 1,
  },
  goalAndRunningModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
  },
  setGoalButton: {
    backgroundColor: '#51BCCE',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  setGoalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  runningModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  runningModeText: {
    fontSize: 16,
    marginRight: 10,
  },
  dailyGoalsCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  horizontalCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  goalCard: {
    alignItems: 'center',
  },
  goalIcon: {
    marginBottom: 5,
  },
  goalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  goalLabel: {
    fontSize: 14,
    color: '#333',
  },
  remainingGoal: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  progressCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  performanceCardContainer: {
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 20,
  },
  performanceList: {
    marginTop: 10,
    height: screenHeight / 4.5,
  },
  performanceCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 5,
    marginBottom: 20,
    width: screenWidth - 40,
    alignSelf: 'center',
    height: screenHeight / 6.5,
  },
  goldCard: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
    borderWidth: 1,
  },
  motivationCard: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  performanceSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  congratsText: {
    fontSize: 14,
    color: '#28a745',
    marginTop: 10,
  },
  badgeImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#51BCCE',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navigation: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#f7f9fc',
  },
  navButton: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  dateContainer: {
    padding: 10,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ActivityTracker;
