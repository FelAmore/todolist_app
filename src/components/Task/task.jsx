import styles from '../../styles/global.module.css';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { CiEdit } from 'react-icons/ci';
import { TbTrash } from 'react-icons/tb';

export function Task({ task, onDelete, onComplete }) {
  return (
    <div className={styles.task}>
      <button className={styles.checkContainer} onClick={() => onComplete(task.id)}>
        {task.isCompleted ? <BsFillCheckCircleFill /> : <div />}
      </button>

      <p className={task.isCompleted ? styles.textCompleted : ""}>
        {task.title}
      </p>

{/*       <button className={styles.editButton} onClick={() => onEdit(task.id)}> */}
{/*         <CiEdit size={20} /> */}
{/*       </button> */}

      <button className={styles.deleteButton} onClick={() => onDelete(task.id)}>
        <TbTrash size={20} />
      </button>
    </div>
  )
}