import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  PanResponder,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import { stories } from "../lib/storyData";
import QuizInterface from "../components/QuizInterface";

const { width, height } = Dimensions.get("window");

export default function BookScreen({ route, navigation }) {
  const { genreId, storyId, selectedAge } = route.params;

  const genreStories = stories[genreId] || [];
  const story = genreStories.find((s) => s.id === storyId) || genreStories[0];

  const [bookState, setBookState] = useState("cover");
  const [pageIndex, setPageIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrisByPage, setRecordedUrisByPage] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      let cancelled = false;

      const lock = async (lockType) => {
        try {
          await ScreenOrientation.lockAsync(lockType);
        } catch (e) {
          if (!cancelled) {
            // ignore
          }
        }
      };

      // Default: keep screen portrait when entering BookScreen.
      lock(ScreenOrientation.OrientationLock.PORTRAIT);

      return () => {
        cancelled = true;
        lock(ScreenOrientation.OrientationLock.PORTRAIT);
      };
    }, [])
  );

  useEffect(() => {
    let cancelled = false;

    const lock = async (lockType) => {
      try {
        await ScreenOrientation.lockAsync(lockType);
      } catch (e) {
        if (!cancelled) {
          // ignore
        }
      }
    };

    // Only the reading pages should be landscape.
    if (bookState === "reading") {
      lock(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      lock(ScreenOrientation.OrientationLock.PORTRAIT);
    }

    return () => {
      cancelled = true;
    };
  }, [bookState]);

  const turnPage = (direction) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      if (direction === "next") {
        if (pageIndex < story.pages.length - 1) {
          setPageIndex((p) => p + 1);
        } else {
          setBookState("ended");
        }
      } else {
        if (pageIndex > 0) {
          setPageIndex((p) => p - 1);
        } else {
          setBookState("cover");
        }
      }
    }, 150);
  };

  const handleExplain = () => {
    const text = story?.pages?.[pageIndex]?.text;
    if (!text) return;

    try {
      Speech.stop();
      Speech.speak(text, {
        language: "en",
        rate: 0.9,
        pitch: 1.0,
      });
    } catch (e) {
      Alert.alert("Explain", "Text-to-speech failed to start.");
    }
  };

  const stopRecordingIfAny = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);

      if (uri) {
        setRecordedUrisByPage((prev) => ({
          ...prev,
          [pageIndex]: uri,
        }));
      }
    } catch (e) {
      setRecording(null);
      setIsRecording(false);
    }
  };

  const startRecording = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Record", "Microphone permission is required.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(rec);
      setIsRecording(true);
    } catch (e) {
      Alert.alert("Record", "Failed to start recording.");
      setRecording(null);
      setIsRecording(false);
    }
  };

  const handleRecord = async () => {
    if (isRecording) {
      await stopRecordingIfAny();
      return;
    }
    await startRecording();
  };

  useEffect(() => {
    return () => {
      Speech.stop();
      stopRecordingIfAny();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 12,
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx < -40) turnPage("next");
          if (gesture.dx > 40) turnPage("prev");
        },
      }),
    [pageIndex, storyId]
  );

  const handleReadAgain = () => {
    setPageIndex(0);
    setBookState("cover");
  };

  const handleBackToStories = () => {
    navigation.navigate("StorySelection", { genreId, selectedAge });
  };

  const handleBack = () => {
    if (bookState === "reading") {
      setBookState("cover");
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {bookState === "cover" && (
        <View style={styles.coverContainer}>
          <View style={styles.bookCover}>
            <View style={styles.spine} />

            <Image source={story.pages[0].image} style={styles.coverImage} />

            <View style={styles.coverContent}>
              <Text style={styles.coverTitle}>{story.title}</Text>
              <Text style={styles.coverSubtitle}>Swipe to open the book</Text>
            </View>

            <TouchableOpacity
              style={styles.startButton}
              onPress={() => setBookState("reading")}
            >
              <Feather name="book-open" size={24} color="#FFFFFF" />
              <Text style={styles.startButtonText}>Start Reading</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {bookState === "reading" && (
        <View style={styles.bookSpread}>
          <View style={styles.bookPages} {...panResponder.panHandlers}>
            <View style={styles.leftPage}>
              <Animated.View
                style={[styles.imageWrapper, { opacity: fadeAnim }]}
              >
                <Image
                  source={story.pages[pageIndex].image}
                  style={styles.pageImage}
                  resizeMode="contain"
                />
              </Animated.View>
              <Text style={styles.pageNumber}>Page {pageIndex + 1}</Text>
            </View>

            <View style={styles.rightPage}>
              <ScrollView
                style={styles.textScroll}
                contentContainerStyle={styles.textContent}
                showsVerticalScrollIndicator={false}
              >
                <Animated.Text style={[styles.pageText, { opacity: fadeAnim }]}>
                  {story.pages[pageIndex].text}
                </Animated.Text>
              </ScrollView>

              <View style={styles.pageActions}>
                <View style={styles.swipeHint}>
                  <Ionicons
                    name="chevron-back"
                    size={20}
                    color="#A8A29E"
                  />
                  <Text style={styles.swipeHintText}>Swipe</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#A8A29E"
                  />
                </View>

                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={styles.explainButton}
                    onPress={handleExplain}
                    activeOpacity={0.9}
                  >
                    <Ionicons name="volume-high" size={18} color="#FFFFFF" />
                    <Text style={styles.explainButtonText}>Explain</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.recordButton}
                    onPress={handleRecord}
                    activeOpacity={0.9}
                  >
                    <Ionicons name="mic" size={18} color="#1C1917" />
                    <Text style={styles.recordButtonText}>Record</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {bookState === "ended" && (
        <View style={styles.endedContainer}>
          <View style={styles.endedCard}>
            <View style={styles.awardCircle}>
              <Ionicons name="trophy" size={48} color="#CA8A04" />
            </View>

            <Text style={styles.endedTitle}>The End</Text>
            <Text style={styles.endedSubtitle}>
              You've completed the story!
            </Text>

            <View style={styles.endedButtons}>
              <TouchableOpacity
                style={styles.quizButton}
                onPress={() => setBookState("quiz")}
              >
                <Text style={styles.quizButtonText}>Start Quiz</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backToStoriesButton}
                onPress={handleBackToStories}
              >
                <Text style={styles.backToStoriesText}>Back to Stories</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {bookState === "quiz" && (
        <View style={styles.quizContainer}>
          <TouchableOpacity
            style={styles.closeQuizButton}
            onPress={() => setBookState("ended")}
          >
            <Ionicons name="close" size={24} color="#1C1917" />
          </TouchableOpacity>

          <QuizInterface
            questions={story.quiz}
            onComplete={() => {}}
            onReadAgain={handleReadAgain}
            onBackToStories={handleBackToStories}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18181B",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 50,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  coverContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  bookCover: {
    flex: 1,
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 40,
    padding: 32,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 20,
  },
  spine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 24,
    backgroundColor: "#D6D3D1",
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    borderRightWidth: 1,
    borderRightColor: "#A8A29E",
  },
  coverImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    borderColor: "#F5F5F4",
    marginBottom: 24,
  },
  coverContent: {
    alignItems: "center",
    marginBottom: 24,
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 700,
    color: "#1C1917",
    textAlign: "center",
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: 16,
    color: "#78716C",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1917",
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 16,
    flex: 1,
    justifyContent: "center",
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 700,
    color: "#FFFFFF",
    marginLeft: 12,
  },
  bookSpread: {
    flex: 1,
    padding: 16,
  },
  bookPages: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  leftPage: {
    flex: 1,
    backgroundColor: "#FAFAF9",
    borderRightWidth: 1,
    borderRightColor: "#D6D3D1",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  pageImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  pageNumber: {
    fontSize: 12,
    color: "#A8A29E",
    marginTop: 8,
  },
  rightPage: {
    flex: 1,
    backgroundColor: "#FFFBF0",
    padding: 24,
  },
  textScroll: {
    flex: 1,
  },
  textContent: {
    paddingBottom: 16,
  },
  pageText: {
    fontSize: 20,
    lineHeight: 32,
    color: "#1C1917",
  },
  pageActions: {
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#E7E5E4",
  },
  swipeHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  swipeHintText: {
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: 700,
    color: "#A8A29E",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  explainButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  explainButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 800,
  },
  recordButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E7E5E4",
  },
  recordButtonText: {
    color: "#1C1917",
    fontSize: 14,
    fontWeight: 800,
  },
  endedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  endedCard: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#FFFFFF",
    borderRadius: 40,
    padding: 40,
    alignItems: "center",
  },
  awardCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FEF9C3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  endedTitle: {
    fontSize: 48,
    fontWeight: "700",
    color: "#1C1917",
    marginBottom: 12,
  },
  endedSubtitle: {
    fontSize: 20,
    color: "#78716C",
    marginBottom: 40,
  },
  endedButtons: {
    width: "100%",
    marginTop: 8,
  },
  quizButton: {
    backgroundColor: "#9333EA",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  quizButtonText: {
    fontSize: 18,
    fontWeight: 700,
    color: "#FFFFFF",
  },
  backToStoriesButton: {
    backgroundColor: "transparent",
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#E7E5E4",
    alignItems: "center",
  },
  backToStoriesText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1917",
  },
  quizContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  closeQuizButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 50,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5F5F4",
    alignItems: "center",
    justifyContent: "center",
  },
});
