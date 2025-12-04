import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../src/contexts/auth-context";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.name || "User");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("+84 9xx xxx xxx");
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("70");
  const [age, setAge] = useState("25");

  const handleSaveProfile = () => {
    setIsEditing(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Logout",
        onPress: async () => {
          await signOut();
          router.replace("/auth");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <MaterialCommunityIcons
              name="account-circle"
              size={80}
              color="#007AFF"
            />
          </View>
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>

        {/* Edit/Save Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            if (isEditing) {
              handleSaveProfile();
            } else {
              setIsEditing(true);
            }
          }}
        >
          <MaterialCommunityIcons
            name={isEditing ? "check" : "pencil"}
            size={20}
            color="#fff"
          />
          <Text style={styles.editButtonText}>
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Text>
        </TouchableOpacity>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[
                styles.input,
                !isEditing && styles.inputDisabled,
              ]}
              placeholder="Enter full name"
              value={fullName}
              onChangeText={setFullName}
              editable={isEditing}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                !isEditing && styles.inputDisabled,
              ]}
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              editable={isEditing}
              placeholderTextColor="#999"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[
                styles.input,
                !isEditing && styles.inputDisabled,
              ]}
              placeholder="Enter phone number"
              value={phone}
              onChangeText={setPhone}
              editable={isEditing}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Health Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Information</Text>

          <View style={styles.rowContainer}>
            <View style={[styles.fieldContainer, styles.halfWidth]}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={[
                  styles.input,
                  !isEditing && styles.inputDisabled,
                ]}
                placeholder="170"
                value={height}
                onChangeText={setHeight}
                editable={isEditing}
                placeholderTextColor="#999"
                keyboardType="number-pad"
              />
            </View>

            <View style={[styles.fieldContainer, styles.halfWidth]}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={[
                  styles.input,
                  !isEditing && styles.inputDisabled,
                ]}
                placeholder="70"
                value={weight}
                onChangeText={setWeight}
                editable={isEditing}
                placeholderTextColor="#999"
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={[
                styles.input,
                !isEditing && styles.inputDisabled,
              ]}
              placeholder="25"
              value={age}
              onChangeText={setAge}
              editable={isEditing}
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons
                name="bell"
                size={24}
                color="#007AFF"
              />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons
                name="lock"
                size={24}
                color="#007AFF"
              />
              <Text style={styles.settingText}>Privacy & Security</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons
                name="help-circle"
                size={24}
                color="#007AFF"
              />
              <Text style={styles.settingText}>Help & Support</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialCommunityIcons
            name="logout"
            size={20}
            color="#FF3B30"
          />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 24,
    paddingTop: 50,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileImageContainer: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#999",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  inputDisabled: {
    backgroundColor: "#fafafa",
    color: "#666",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  logoutButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    height: 20,
  },
});
