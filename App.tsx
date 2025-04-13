import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

interface Task {
  id: string;
  name: string;
}

export default function App() {
  const [newTask, setNewTask] = useState("");
  const [editTask, setEditTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      const json = await AsyncStorage.getItem("tasks");
      if (json) setTasks(JSON.parse(json));
    };
    loadTasks();
  }, []);
  useEffect(() => {
    AsyncStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (!newTask.trim()) return;

    if (editingTaskId) {
      setTasks(
        tasks.map((t) => (t.id === editingTaskId ? { ...t, name: editTask } : t))
      );
      setEditingTaskId(null);
      setEditTask("");
    } else {
      setTasks([...tasks, { id: Date.now().toString(), name: newTask }]);
      setNewTask("");
    }
  };

  const handleEditTask = () => {
    if (!editTask.trim()) return;
    
    setTasks(
      tasks.map((t) => (t.id === editingTaskId ? { ...t, name: editTask } : t))
    );
    setEditingTaskId(null);
    setEditTask("");
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      {editingTaskId === item.id ? (
        <>
          <TextInput
            style={[styles.taskText, styles.input]}
            value={editTask}
            onChangeText={setEditTask}
            autoFocus
          />
          <TouchableOpacity onPress={handleEditTask}>
            <Text style={{ marginLeft: 20 }}>✔️</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.taskText}>{item.name}</Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                setEditTask(item.name);
                setEditingTaskId(item.id);
              }}
            >
              <Text style={{ marginRight: 10 }}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
              <Text>🗑️</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Task Tracker</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a task..."
          value={newTask}
          onChangeText={setNewTask}
        />
        <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
          <Text style={styles.addButtonText}>➕</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#f5f5f5",
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  inputContainer: { flexDirection: "row", marginBottom: 20 },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#007bff",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 8,
  },
  taskText: { fontSize: 16 },
  deleteText: { fontSize: 18 },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
