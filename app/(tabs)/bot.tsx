import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Message, ChatSession } from "@/src/types";

export default function BotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Xin chào! 👋 Tôi là trợ lý sức khỏe của bạn. Tôi có thể giúp bạn:\n\n• Tư vấn về sức khỏe\n• Giải thích các chỉ số\n• Gợi ý lối sống lành mạnh\n\nBạn cần tôi giúp gì?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    { id: "1", title: "Tư vấn về Tiểu đường", date: "Hôm nay 14:30" },
    { id: "2", title: "Hỏi về Huyết áp cao", date: "Hôm nay 10:15" },
    { id: "3", title: "Lời khuyên về Vận động", date: "Hôm qua" },
    { id: "4", title: "Cải thiện Giấc ngủ", date: "2 ngày trước" },
  ]);
  const [selectedSessionId, setSelectedSessionId] = useState("current");

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: "Tôi hiểu rồi! Đây là phản hồi từ AI chatbot. Sắp tới sẽ tích hợp API thực tế.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSelectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setSidebarVisible(false);
    // TODO: Load messages từ session này
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.type === "user";

    return (
      <View style={[styles.messageContainer, isUser ? styles.userContainer : styles.botContainer]}>
        {!isUser && (
          <View style={styles.botIcon}>
            <MaterialCommunityIcons name="robot" size={20} color="#fff" />
          </View>
        )}
        
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userMessage : styles.botMessage,
          ]}
        >
          <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
            {item.content}
          </Text>
          <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.botTimestamp]}>
            {item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>

        {isUser && (
          <View style={styles.userIcon}>
            <MaterialCommunityIcons name="account" size={20} color="#fff" />
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setSidebarVisible(!sidebarVisible)}
          >
            <MaterialCommunityIcons name="menu" size={28} color="#007AFF" />
          </TouchableOpacity>
          <MaterialCommunityIcons name="robot-happy" size={32} color="#007AFF" />
          <Text style={styles.headerTitle}>Health Bot</Text>
          <TouchableOpacity style={styles.newChatButton}>
            <MaterialCommunityIcons name="plus" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          inverted={false}
        />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <MaterialCommunityIcons name="dots-horizontal" size={24} color="#007AFF" />
            <Text style={styles.loadingText}>Bot đang suy nghĩ...</Text>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor="#999"
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, inputMessage.trim() === "" && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={isLoading || inputMessage.trim() === ""}
          >
            <MaterialCommunityIcons
              name="send"
              size={20}
              color={isLoading || inputMessage.trim() === "" ? "#ccc" : "#fff"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Overlay & Sidebar */}
      {sidebarVisible && (
        <>
          <TouchableOpacity
            style={styles.sidebarOverlay}
            activeOpacity={1}
            onPress={() => setSidebarVisible(false)}
          />
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Chat History</Text>
              <TouchableOpacity onPress={() => setSidebarVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.sessionItem, selectedSessionId === "current" && styles.activeSession]}
              onPress={() => handleSelectSession("current")}
            >
              <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#007AFF" />
              <Text style={styles.sessionItemText}>New Chat</Text>
            </TouchableOpacity>

            <ScrollView style={styles.sessionsList}>
              {chatSessions.map(session => (
                <TouchableOpacity
                  key={session.id}
                  style={[styles.sessionItem, selectedSessionId === session.id && styles.activeSession]}
                  onPress={() => handleSelectSession(session.id)}
                >
                  <MaterialCommunityIcons name="chat-outline" size={20} color="#666" />
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionItemText} numberOfLines={1}>
                      {session.title}
                    </Text>
                    <Text style={styles.sessionDate}>{session.date}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 12,
  },
  menuButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  newChatButton: {
    padding: 8,
    marginRight: -8,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "flex-end",
    gap: 8,
  },
  userContainer: {
    justifyContent: "flex-end",
  },
  botContainer: {
    justifyContent: "flex-start",
  },
  botIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  userIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#34C759",
    justifyContent: "center",
    alignItems: "center",
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userMessage: {
    backgroundColor: "#34C759",
  },
  botMessage: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: "#fff",
  },
  botText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  botTimestamp: {
    color: "#999",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  loadingText: {
    color: "#007AFF",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: "#333",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#ddd",
  },
  sidebarOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 99,
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 50,
    bottom: 0,
    width: 280,
    backgroundColor: "#fff",
    zIndex: 101,
    flexDirection: "column",
  },
  sidebarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  sessionsList: {
    flex: 1,
  },
  sessionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    gap: 12,
  },
  activeSession: {
    backgroundColor: "#EBF5FF",
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
  },
  sessionInfo: {
    flex: 1,
  },
  sessionItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  sessionDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
});
