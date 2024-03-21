import { useState } from 'react';
import { Task } from '../Task/task';
import styles from './tasks.module.css';

export function Tasks({ tasks, onDelete, onComplete }) {
  const [filter, setFilter] = useState('all'); // Default filter is set to 'show all'

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') {
      return !task.isCompleted;
    } else if (filter === 'completed') {
      return task.isCompleted;
    }
    return true;
  });

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleEdit = (taskId, newTitle) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, title: newTitle };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  return (
    <section className={styles.tasks}>
      <header className={styles.header}>
        <div>
          <p>Created tasks</p>
          <span>{tasks.length}</span>
        </div>

        <div className={styles.selectContainer}>
          <label htmlFor="filter">Filter:</label>
          <select id="filter" value={filter} onChange={handleFilterChange}>
            <option value="all">Show All</option>
            <option value="active">Active Tasks</option>
            <option value="completed">Completed Tasks</option>
          </select>
        </div>
      </header>

      <div className={styles.list}>
        {filteredTasks.map((task) => (
          <Task key={task.id} task={task} onDelete={onDelete} onComplete={onComplete} onEdit={handleEdit} />
        ))}
      </div>
    </section>
  );
}

