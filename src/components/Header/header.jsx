import Logo from '../../assets/logo.png';
import styles from '../../styles/header.module.css';
import { AiOutlinePlusCircle } from 'react-icons/ai';
// import { CgProfile } from 'react-icons/cg';
// import { SlLogout } from 'react-icons/sl';
import { useState } from 'react';
// import { Link } from 'react-router-dom';

export function Header({ handleAddTask}) {
  const [title, setTitle] = useState('');


  function handleSubmit(event) {
    event.preventDefault();

    handleAddTask(title);
    setTitle('');
  }

  function onChangeTitle(event) {
    setTitle(event.target.value);
  }

  return (
    <header className={styles.header}>

      <img src={Logo} />

      <form onSubmit={handleSubmit} className={styles.newTaskForm}>
        <input placeholder="Add a new task" type="text" onChange={onChangeTitle} value={title} />
        <button><AiOutlinePlusCircle size={20} /></button>
      </form>
    </header>
  )
}