import { getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { db, colref } from './firebaseConfig';

async function getTodos() {
  const querySnapshot = await getDocs(colref);
  const todos = [];
  querySnapshot.forEach((doc) => {
    todos.push({ id: doc.id, ...doc.data() });
  });
  return todos;
}

async function addTodo(todo) {
  const docRef = await addDoc(colref, todo);
  return { id: docRef.id, ...todo };
}

async function updateTodo(id, newData) {
  const todoRef = doc(colref, id);
  await updateDoc(todoRef, newData);
}

async function deleteTodo(id) {
  await deleteDoc(doc(colref, id));
}

export { getTodos, addTodo, updateTodo, deleteTodo };

