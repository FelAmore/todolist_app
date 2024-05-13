import React, { useEffect, useState } from "react";
import { Header } from "../components/Header/header";
import { Tasks } from "../components/Tasks/tasks";
import { useAuth } from '../contexts/authContext';
import { getTodos, addTodo, deleteTodo, updateTodo } from '../firebase/db';
import { useParams } from 'react-router-dom';
import { useAuthRedirect } from "../firebase/auth"; // Import useAuthRedirect

function Homepage() {
  useAuthRedirect(); // Call useAuthRedirect to handle authentication redirection
  const { userId } = useParams();
  const { currentUser, isGoogleUser, isEmailUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState('');
  const [editedTaskDescription, setEditedTaskDescription] = useState('');

  useEffect(() => {
    console.log("userId:", userId); // Log userId to verify its value
    async function fetchTasks() {
        try {
            const tasksFromFirestore = await getTodos(userId); // Fetch tasks using userId
            // Update tasks state, setting isCompleted field based on data from Firestore
            setTasks(tasksFromFirestore.map(task => ({ ...task, isCompleted: task.isCompleted || false })));
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }
    fetchTasks();
  }, [userId]);


  async function addTask(taskTitle, taskDescription) {
    try {
        // Log the parameters to ensure they have the expected values
        console.log('userId:', userId);
        console.log('taskTitle:', taskTitle);
        console.log('taskDescription:', taskDescription);

        // Check if taskDescription is defined
        if (taskDescription !== undefined) {
            const newTask = { title: taskTitle, description: taskDescription, isCompleted: false };
            const addedTask = await addTodo(userId, newTask); // Pass userId along with newTask
            setTasks([...tasks, { id: addedTask.id, ...newTask }]);
        } else {
            console.error('Task description is undefined');
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
  }

  async function deleteTaskById(taskId) {
    try {
      console.log("Deleting task with ID:", taskId);
      await deleteTodo(userId, taskId); // Pass userId along with taskId to deleteTodo
      const newTasks = tasks.filter(task => task.id !== taskId); // Filter out deleted task
      setTasks(newTasks); // Update tasks state
      // Clear editing state if the deleted task was being edited
      if (editingTaskId === taskId) {
        setEditingTaskId(null);
        setEditedTaskTitle('');
      }
      console.log("Task deleted successfully");
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
        // Update task in Firestore
        await updateTodo(userId, taskId, { isCompleted: updatedTasks.find(task => task.id === taskId).isCompleted });
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

  async function updateTask(taskId, newTitle, newDescription, newData) {
      try {
        console.log('Updating task with ID:', taskId);
        const updatedTask = { title: newTitle, description: newDescription, ...newData }; // Include newData
        await updateTodo(userId, taskId, updatedTask); // Pass userId, taskId, and updatedTask to updateTodo
        console.log('Task updated successfully');
        const updatedTasks = tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, title: newTitle, description: newDescription, ...newData }; // Include newData
          }
          return task;
        });
        setTasks(updatedTasks); // Update UI optimistically
        setEditingTaskId(null); // Clear editing state after updating task
        // Clear edited task title and description only if they were successfully updated
        if (!newTitle && !newDescription) {
          setEditedTaskTitle('');
          setEditedTaskDescription('');
        }
      } catch (error) {
        console.error('Error updating task:', error);
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