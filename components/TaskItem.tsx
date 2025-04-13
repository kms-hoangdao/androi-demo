import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import styles from "../style";

interface Task {
  id: string;
  name: string;
}

interface TaskItemProps {
  item: Task;
  editTask: string;
  editingTaskId: string | null;
  onEdit: (name: string, id: string) => void;
  onDelete: (id: string) => void;
  onEditChange: (text: string) => void;
  onEditComplete: () => void;
}

export const TaskItem = ({
  item,
  editTask,
  editingTaskId,
  onEdit,
  onDelete,
  onEditChange,
  onEditComplete,
}: TaskItemProps) => (
  <View style={styles.taskItem}>
    {editingTaskId === item.id ? (
      <>
        <TextInput
          style={[styles.taskText, styles.input]}
          value={editTask}
          onChangeText={onEditChange}
          autoFocus
        />
        <TouchableOpacity onPress={onEditComplete}>
          <Text style={{ marginLeft: 20 }}>✔️</Text>
        </TouchableOpacity>
      </>
    ) : (
      <>
        <Text style={styles.taskText}>{item.name}</Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => onEdit(item.name, item.id)}>
            <Text style={{ marginRight: 10 }}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.id)}>
            <Text>🗑️</Text>
          </TouchableOpacity>
        </View>
      </>
    )}
  </View>
);
