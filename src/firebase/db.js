import { getDocs, addDoc, deleteDoc, updateDoc, doc, collection } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Function to get todos for a specific user
async function getTodos(userId) {
    try {
        // Construct a reference to the todos collection for the user
        const userDocRef = doc(db, 'users', userId);
        const todosCollectionRef = collection(userDocRef, 'todos');

        // Get all documents from the user's todos collection
        const querySnapshot = await getDocs(todosCollectionRef);

        // Map query snapshot to an array of todos
        const todos = [];
        querySnapshot.forEach((doc) => {
            todos.push({ id: doc.id, ...doc.data() });
        });

        return todos;
    } catch (error) {
        console.error('Error getting todos:', error);
        throw error;
    }
}


// Function to add a todo for a specific user
async function addTodo(userId, todo) {
  try {
    // Construct a reference to the todos collection for the user
    const userTodosRef = collection(db, 'users', userId, 'todos');

    // Add the todo document to the user's todos collection
    const docRef = await addDoc(userTodosRef, todo);

    return { id: docRef.id, ...todo };
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}


// Function to update a todo for a specific user
async function updateTodo(userId, id, newData) {
  try {
    console.log('Updating todo with ID:', id);
    // Construct a reference to the todo document for the user
    const todoRef = doc(db, 'users', userId, 'todos', id);

    // Update the todo document
    await updateDoc(todoRef, newData);
    console.log('Todo updated successfully');
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Function to delete a todo for a specific user
async function deleteTodo(userId, id) {
  try {
    console.log("Deleting todo with ID:", id);
    // Construct a reference to the todo document for the user
    const todoRef = doc(db, 'users', userId, 'todos', id);
    // Delete the todo document
    await deleteDoc(todoRef);
    console.log("Todo deleted successfully");
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

export { getTodos, addTodo, updateTodo, deleteTodo };

