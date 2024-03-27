import React, { useEffect, useState } from "react";
import { Header } from "../components/Header/header";
import { Tasks } from "../components/Tasks/tasks";
import { useAuth } from '../contexts/authContext';
import { getTodos, addTodo, deleteTodo, updateTodo } from '../firebase/db';

function Homepage() {
  const { currentUser, isGoogleUser, isEmailUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState('');
  const [editedTaskDescription, setEditedTaskDescription] = useState('');

  useEffect(() => {
    async function fetchTasks() {
      try {
        const tasksFromFirestore = await getTodos(); // Fetch tasks from Firestore
        setTasks(tasksFromFirestore); // Update tasks state
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
    fetchTasks();
  }, []); // Empty dependency array to run once on mount

  async function addTask(taskTitle, taskDescription) {
    try {
      const newTask = { title: taskTitle, description: taskDescription, isCompleted: false };
      const addedTask = await addTodo(newTask); // Add task to Firestore
      setTasks([...tasks, { id: addedTask.id, ...newTask }]); // Update tasks state with added task
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }

  async function deleteTaskById(taskId) {
    try {
      await deleteTodo(taskId); // Delete task from Firestore
      const newTasks = tasks.filter(task => task.id !== taskId); // Filter out deleted task
      setTasks(newTasks); // Update tasks state
      // Clear editing state if the deleted task was being edited
      if (editingTaskId === taskId) {
        setEditingTaskId(null);
        setEditedTaskTitle('');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  async function toggleTaskCompletedById(taskId) {
    try {
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, isCompleted: !task.isCompleted };
        }
        return task;
      });
      setTasks(updatedTasks); // Update UI optimistically
      await updateTodo(taskId, { isCompleted: updatedTasks.find(task => task.id === taskId).isCompleted }); // Update task in Firestore
    } catch (error) {
      console.error('Error toggling task completion:', error);
      // Revert UI changes in case of error
      const revertedTasks = tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, isCompleted: !task.isCompleted };
        }
        return task;
      });
      setTasks(revertedTasks);
    }
  }

  async function startEditingTask(taskId, taskTitle) {
    setEditingTaskId(taskId);
    setEditedTaskTitle(taskTitle);
  }

  function cancelEditingTask() {
    setEditingTaskId(null);
    setEditedTaskTitle('');
  }

  async function updateTask(taskId, newTitle, newDescription) {
      try {
        const updatedTasks = tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, title: newTitle, description: newDescription };
          }
          return task;
        });
        setTasks(updatedTasks); // Update UI optimistically
        await updateTodo(taskId, { title: newTitle, description: newDescription }); // Update task in Firestore
        setEditingTaskId(null); // Clear editing state after updating task
        setEditedTaskTitle('');
      } catch (error) {
        console.error('Error updating task:', error);
        // Revert UI changes in case of error
        const revertedTasks = tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, title: editedTaskTitle, description: editedTaskDescription };
          }
          return task;
        });
        setTasks(revertedTasks);
      }
  }


  return (
    <>
      <Header handleAddTask={addTask} />
      <Tasks
        tasks={tasks}
        onDelete={deleteTaskById}
        onComplete={toggleTaskCompletedById}
        onEdit={updateTask}
        editingTaskId={editingTaskId}
        editedTaskTitle={editedTaskTitle}
        editedTaskDescription={editedTaskDescription}
        setEditedTaskTitle={setEditedTaskTitle}
        setEditedTaskDescription={setEditedTaskDescription}
        onCancelEdit={cancelEditingTask}
      />
      {/* Container for logged in user info */}
      <div className="bg-transparent text-[#ffa0ad] p-4 text-center mt-8 fixed bottom-0 w-full" style={{ fontSize: '12px' }}>
        Logged in as: {isGoogleUser ? currentUser.displayName : (isEmailUser ? currentUser.email : currentUser.email)}
      </div>
    </>
  );
}

export default Homepage;
