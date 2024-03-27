import React, { useState } from 'react';
import styles from '../../styles/global.module.css';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { TiEdit } from 'react-icons/ti';
import { TbTrash } from 'react-icons/tb';

export function Task({ task, onDelete, onComplete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const handleTitleInputChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleDescriptionInputChange = (e) => {
    setEditedDescription(e.target.value);
  };

  const handleSave = () => {
      onEdit(task.id, editedTitle, editedDescription);
      setIsEditing(false);
  };


  return (
    <div className={styles.task}>
      <button className={styles.checkContainer} onClick={() => onComplete(task.id)}>
        {task.isCompleted ? <BsFillCheckCircleFill /> : <div />}
      </button>

      {isEditing ? (
        <div className={styles.modal}>
          <input
            type="text"
            value={editedTitle}
            onChange={handleTitleInputChange}
            autoFocus
          />
          <textarea
            value={editedDescription}
            onChange={handleDescriptionInputChange}
            rows={3}
          />
          <div>
            <button className={styles.update} onClick={handleSave}>Update</button>
            <button className={styles.cancel} onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className={styles.taskDetails}>
          <p className={task.isCompleted ? styles.textCompleted : ""}>
            {task.title}
          </p>
          {task.description && (
            <p className={styles.taskDescription}>
              {task.description}
            </p>
          )}
        </div>
      )}

      <div className={styles.taskButtons}>
        <button className={styles.editButton} onClick={() => setIsEditing(true)}>
          <TiEdit size={20} />
        </button>

        <button className={styles.deleteButton} onClick={() => onDelete(task.id)}>
          <TbTrash size={20} />
        </button>
      </div>
    </div>
  );
}

