import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from "react-native";
import { Card } from "react-native-paper";
import { useAuth } from "@/src/contexts/auth-context";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DISEASE_LIST, HEALTH_STATS, HEALTH_WARNINGS } from "@/src/constants/diseases";
import type { Disease } from "@/src/types";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [showHealthStatus, setShowHealthStatus] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fabScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 17) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const handleFABPress = () => {
    Animated.sequence([
      Animated.timing(fabScaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setShowHealthStatus(true);
  };

  const handleDiseaseSelect = (disease: Disease) => {
    setSelectedDisease(disease);
    router.push({
      pathname: "/(disease)/input",
      params: { diseaseId: disease.id, diseaseName: disease.name },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {/* Animated Greeting Header */}
      <Animated.View
        style={[
          styles.greetingSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.greetingContainer}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}, 👋</Text>
            <Text style={styles.userName}>{user?.name || "User"}</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "numeric",
                month: "numeric",
              })}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="hospital-box"
            size={48}
            color="#007AFF"
          />
        </View>
      </Animated.View>

      {/* Health Stats Cards */}
      <View style={styles.statsContainer}>
        {HEALTH_STATS.map((stat: any, index: number) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + "20" }]}>
              <MaterialCommunityIcons
                name={stat.icon as any}
                size={28}
                color={stat.color}
              />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Action Section */}
      <View style={styles.quickActionSection}>
        <Text style={styles.sectionTitle}>Theo dõi sức khỏe hôm nay</Text>
        <Text style={styles.sectionSubtitle}>Chọn loại chỉ số để nhập dữ liệu</Text>
      </View>

      {/* Disease Grid */}
      <View style={styles.diseaseGrid}>
        {DISEASE_LIST.map((disease) => (
          <TouchableOpacity
            key={disease.id}
            style={styles.diseaseCard}
            onPress={() => handleDiseaseSelect(disease)}
          >
            <Card style={[styles.card, { borderLeftColor: disease.color, borderLeftWidth: 4 }]}>
              <Card.Content style={styles.cardContent}>
                <MaterialCommunityIcons
                  name={disease.icon as any}
                  size={40}
                  color={disease.color}
                  style={styles.cardIcon}
                />
                <Text style={styles.diseaseName}>{disease.name}</Text>
                <Text style={styles.diseaseDescription}>{disease.description}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>

    {/* Floating Action Button */}
    <Animated.View
      style={[
        styles.fabContainer,
        {
          transform: [{ scale: fabScaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.fab}
        onPress={handleFABPress}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="heart-plus" size={28} color="#fff" />
      </TouchableOpacity>
    </Animated.View>

    {/* Health Status Modal */}
    {showHealthStatus && (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tình hình sức khỏe</Text>
            <TouchableOpacity onPress={() => setShowHealthStatus(false)}>
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.warningsContainer} showsVerticalScrollIndicator={false}>
            {HEALTH_WARNINGS.map((warning: any, index: number) => (
              <View key={index} style={styles.warningCard}>
                <View style={[styles.warningIcon, { backgroundColor: warning.color + "20" }]}>
                  <MaterialCommunityIcons
                    name={warning.icon as any}
                    size={24}
                    color={warning.color}
                  />
                </View>
                <View style={styles.warningContent}>
                  <Text style={styles.warningTitle}>{warning.title}</Text>
                  <Text style={styles.warningDescription}>{warning.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowHealthStatus(false)}
          >
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
  </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flex: 1,
  },
  greetingSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
  },
  greetingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#999",
    textAlign: "center",
  },
  quickActionSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#999",
    marginBottom: 12,
  },
  diseaseGrid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  diseaseCard: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  cardContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
  cardIcon: {
    marginBottom: 8,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  diseaseDescription: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  fabContainer: {
    position: "absolute",
    bottom: 24,
    right: 24,
    zIndex: 100,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    zIndex: 101,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  warningsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 400,
  },
  warningCard: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "flex-start",
    gap: 12,
  },
  warningIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  warningDescription: {
    fontSize: 12,
    color: "#999",
    lineHeight: 18,
  },
  closeButton: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
