import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { genres, ageGroups } from '../lib/storyData';

const { width } = Dimensions.get('window');
const cardWidth = width > 500 ? (width - 80) / 3 : width - 40;

export default function HomeScreen({ navigation }) {
  const [selectedAge, setSelectedAge] = useState('3-5');
  const [showAgePicker, setShowAgePicker] = useState(false);

  const handleGenrePress = (genre) => {
    navigation.navigate('StorySelection', { genreId: genre.id, selectedAge });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#EFF6FF', '#FFFFFF', '#DBEAFE']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.spacer} />
              
              <View style={styles.logoContainer}>
                <View style={styles.logoIcon}>
                  <Text style={styles.sparkle}>✨</Text>
                </View>
                <Text style={styles.logoText}>STORYTIME</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.ageSelector}
                onPress={() => setShowAgePicker(!showAgePicker)}
              >
                <Text style={styles.ageSelectorText}>
                  {ageGroups.find(a => a.value === selectedAge)?.label}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
            </View>

            {showAgePicker && (
              <View style={styles.agePicker}>
                {ageGroups.map((age) => (
                  <TouchableOpacity
                    key={age.value}
                    style={[
                      styles.ageOption,
                      selectedAge === age.value && styles.ageOptionSelected
                    ]}
                    onPress={() => {
                      setSelectedAge(age.value);
                      setShowAgePicker(false);
                    }}
                  >
                    <Text style={[
                      styles.ageOptionText,
                      selectedAge === age.value && styles.ageOptionTextSelected
                    ]}>
                      {age.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Choose your</Text>
              <Text style={styles.titleHighlight}>Adventure</Text>
            </View>
          </View>

          <View style={styles.genreGrid}>
            {genres.map((genre, index) => (
              <TouchableOpacity
                key={genre.id}
                style={styles.genreCard}
                onPress={() => handleGenrePress(genre)}
                activeOpacity={0.9}
              >
                <View style={styles.cardImageContainer}>
                  <Image 
                    source={genre.image} 
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                </View>
                
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{genre.title}</Text>
                    <View style={styles.cardIcon}>
                      <Text style={styles.bookIcon}>📖</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {genre.description}
                  </Text>
                  
                  <View style={styles.cardFooter}>
                    <View style={styles.storyCount}>
                      <Text style={styles.storyCountText}>10 Stories</Text>
                    </View>
                    <Text style={styles.exploreText}>Explore →</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF6FF',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  spacer: {
    width: 100,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    padding: 8,
    borderRadius: 12,
  },
  sparkle: {
    fontSize: 16,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 3,
    color: '#2563EB',
  },
  ageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 8,
  },
  ageSelectorText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#64748B',
  },
  agePicker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ageOption: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  ageOptionSelected: {
    backgroundColor: '#EFF6FF',
  },
  ageOptionText: {
    fontSize: 16,
    color: '#1E293B',
  },
  ageOptionTextSelected: {
    color: '#2563EB',
    fontWeight: '600',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  titleHighlight: {
    fontSize: 40,
    fontWeight: '700',
    color: '#2563EB',
  },
  genreGrid: {
    paddingHorizontal: 20,
    gap: 20,
  },
  genreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  cardImageContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#F1F5F9',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookIcon: {
    fontSize: 18,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storyCount: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  storyCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  exploreText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
  },
});
