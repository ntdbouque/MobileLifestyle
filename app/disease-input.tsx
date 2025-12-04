import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { Button, TextInput, Snackbar } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/src/contexts/auth-context";
import { databases, DATABASE_ID } from "@/src/services/appwrite";
import { ID } from "react-native-appwrite";

interface DiseaseField {
  name: string;
  unit: string;
  placeholder: string;
  type: "decimal" | "number" | "text";
}

const DISEASE_FIELDS: { [key: string]: { name: string; fields: DiseaseField[] } } = {
  "blood-pressure": {
    name: "Huyết áp",
    fields: [
      { name: "Tâm thu", unit: "mmHg", placeholder: "120", type: "number" },
      { name: "Tâm trương", unit: "mmHg", placeholder: "80", type: "number" },
    ],
  },
  diabetes: {
    name: "Tiểu đường",
    fields: [
      { name: "Đường huyết", unit: "mg/dL", placeholder: "100", type: "decimal" },
      { name: "HbA1c", unit: "%", placeholder: "5.5", type: "decimal" },
    ],
  },
  cholesterol: {
    name: "Mỡ máu",
    fields: [
      { name: "Cholesterol tổng", unit: "mg/dL", placeholder: "200", type: "number" },
      { name: "Triglycerides", unit: "mg/dL", placeholder: "150", type: "number" },
      { name: "LDL", unit: "mg/dL", placeholder: "100", type: "number" },
      { name: "HDL", unit: "mg/dL", placeholder: "50", type: "number" },
    ],
  },
  weight: {
    name: "Cân nặng",
    fields: [
      { name: "Cân nặng", unit: "kg", placeholder: "70", type: "decimal" },
      { name: "Chiều cao", unit: "cm", placeholder: "170", type: "number" },
    ],
  },
  exercise: {
    name: "Vận động",
    fields: [
      { name: "Bước đi", unit: "steps", placeholder: "10000", type: "number" },
      { name: "Calo tiêu thụ", unit: "kcal", placeholder: "2500", type: "number" },
      { name: "Thời gian tập luyện", unit: "phút", placeholder: "30", type: "number" },
    ],
  },
  sleep: {
    name: "Giấc ngủ",
    fields: [
      { name: "Thời gian ngủ", unit: "giờ", placeholder: "8", type: "decimal" },
      { name: "Chất lượng", unit: "1-10", placeholder: "8", type: "number" },
    ],
  },
};

export default function DiseaseInputScreen() {
  const { diseaseId, diseaseName } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = (diseaseId as string) || "blood-pressure";
  const name = (diseaseName as string) || "Huyết áp";

  const disease = DISEASE_FIELDS[id];
  const [data, setData] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleInputChange = (fieldName: string, value: string) => {
    setData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate user logged in
    if (!user) {
      setSnackMessage("Vui lòng đăng nhập trước");
      setIsError(true);
      setSnackVisible(true);
      return;
    }

    // Validate all fields are filled
    const fields = disease?.fields || [];
    const emptyFields = fields.filter(field => !data[field.name]?.trim());
    
    if (emptyFields.length > 0) {
      setSnackMessage("Vui lòng điền đầy đủ các trường");
      setIsError(true);
      setSnackVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      // Prepare data for database
      const recordData: any = {
        userId: user.$id,
        diseaseId: id,
        diseaseName: name,
        recordDate: new Date().toISOString(),
      };

      // Map form data to value1-4 and unit1-4
      fields.forEach((field, index) => {
        const fieldNum = index + 1;
        recordData[`value${fieldNum}`] = parseFloat(data[field.name]) || 0;
        recordData[`unit${fieldNum}`] = field.unit;
      });

      // Save to Appwrite
      await databases.createDocument(
        DATABASE_ID,
        'health_records',
        ID.unique(),
        recordData
      );

      setSnackMessage(`✅ Lưu thành công ${name}`);
      setIsError(false);
      setSnackVisible(true);

      // Navigate back after success
      setTimeout(() => {
        router.back();
      }, 1500);

    } catch (error: any) {
      console.error('Error saving health record:', error);
      setSnackMessage(error?.message || "Lỗi khi lưu dữ liệu");
      setIsError(true);
      setSnackVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getKeyboardType = (type: string) => {
    switch (type) {
      case "decimal":
        return "decimal-pad";
      case "number":
        return "number-pad";
      default:
        return "default";
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Button
            icon="arrow-left"
            mode="text"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            Trở về
          </Button>
          <Text style={styles.title}>{disease?.name || name}</Text>
          <Text style={styles.subtitle}>Nhập các chỉ số chi tiết</Text>
        </View>

        <View style={styles.form}>
          {disease?.fields.map((field, index) => (
            <View key={index} style={styles.inputGroup}>
              <Text style={styles.label}>{field.name}</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder={field.placeholder}
                  value={data[field.name] || ""}
                  onChangeText={(value) => handleInputChange(field.name, value)}
                  keyboardType={getKeyboardType(field.type)}
                  style={styles.input}
                />
                <Text style={styles.unit}>{field.unit}</Text>
              </View>
            </View>
          ))}

          <Button
            mode="contained"
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isLoading}
            loading={isLoading}
          >
            {isLoading ? "Đang lưu..." : "Lưu dữ liệu"}
          </Button>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={isError ? 3000 : 2000}
        style={{
          backgroundColor: isError ? "#d32f2f" : "#4caf50",
        }}
      >
        {snackMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    marginTop: 8,
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 40,
    marginLeft: -8,
    transform: [{ scale: 1.2 }],
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: 8,
    borderRadius: 20,
  },
  unit: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
    minWidth: 50,
    textAlign: "right",
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
});

export const screenOptions = {
  headerShown: false,
};
