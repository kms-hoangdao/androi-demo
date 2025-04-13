import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { TaskItem } from "./components/TaskItem";
import styles from "./style";
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
        tasks.map((t) =>
          t.id === editingTaskId ? { ...t, name: editTask } : t
        )
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
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            editTask={editTask}
            editingTaskId={editingTaskId}
            onEdit={(name, id) => {
              setEditTask(name);
              setEditingTaskId(id);
            }}
            onDelete={handleDeleteTask}
            onEditChange={setEditTask}
            onEditComplete={handleEditTask}
          />
        )}
      />
    </View>
  );
}
