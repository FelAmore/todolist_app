import React, { useEffect, useState } from "react";
import { Header } from "../components/Header/header";
import { Tasks } from "../components/Tasks/tasks";
import { useAuth } from '../contexts/authContext';

const LOCAL_STORAGE_KEY = 'todo:tasks';

function Homepage() {
  const { currentUser, isGoogleUser, isEmailUser } = useAuth();
  const [tasks, setTasks] = useState([]);

  function loadSavedTasks() {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if(saved) {
      setTasks(JSON.parse(saved));
    }
  }

  function setTasksAndSave(newTasks) {
    setTasks(newTasks);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTasks));
  }

  useEffect(() => {
    loadSavedTasks();
  }, [])

  function addTask(taskTitle) {
    setTasksAndSave([...tasks, {
      id: crypto.randomUUID(),
      title: taskTitle,
      isCompleted: false
    }]);
  }

  function deleteTaskById(taskId) {
    const newTasks = tasks.filter(task => task.id !== taskId);
    setTasksAndSave(newTasks);
  }

  function toggleTaskCompletedById(taskId) {
    const newTasks = tasks.map(task => {
      if(task.id === taskId) {
        return {
          ...task,
          isCompleted: !task.isCompleted
        }
      }
      return task;
    });
    setTasksAndSave(newTasks);
  }

  return (
    <>
      <Header handleAddTask={addTask} />
      <Tasks
        tasks={tasks}
        onDelete={deleteTaskById}
        onComplete={toggleTaskCompletedById}
      />
      {/* Container for logged in user info */}
      <div className="bg-transparent text-[#ffa0ad] p-4 text-center mt-8 fixed bottom-0 w-full" style={{ fontSize: '12px' }}>
        Logged in as: {isGoogleUser ? currentUser.displayName : (isEmailUser ? currentUser.email : currentUser.email)}
      </div>
    </>
  )
}

export default Homepage;
