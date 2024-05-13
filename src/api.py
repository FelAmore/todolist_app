from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict

# Define a Pydantic model for Task
class Task(BaseModel):
    title: str
    description: str
    completed: bool

# Define a Pydantic model for the response
class TasksResponse(BaseModel):
    message: str
    tasks: Dict[int, Task]

class TaskResponse(BaseModel):
    message: str
    task: Task

# Initialize FastAPI app
app = FastAPI()

# In-memory database for storing tasks (replace with a real database in production)
tasks_db = []

# Endpoint to get all tasks with indices
@app.get("/tasks/", response_model=TasksResponse)
async def get_tasks_with_indices():
    tasks_with_indices = {index: task for index, task in enumerate(tasks_db)}
    return TasksResponse(message="Tasks successfully retrieved", tasks=tasks_with_indices)

# Endpoint to create a new task
@app.post("/tasks/", response_model=TasksResponse)
async def create_task(task: Task):
    tasks_db.append(task)
    return TasksResponse(message="Task successfully created", tasks={len(tasks_db) - 1: task})

# Endpoint to get a specific task by index
@app.get("/tasks/{task_index}", response_model=TaskResponse)
async def get_task(task_index: int):
    try:
        task = tasks_db[task_index]
        return TaskResponse(message="Task successfully retrieved", task=task)
    except IndexError:
        raise HTTPException(status_code=404, detail="Task not found")

# Endpoint to update a task
@app.put("/tasks/{task_index}", response_model=TaskResponse)
async def update_task(task_index: int, updated_task: Task):
    try:
        # Check if the task exists
        if task_index < 0 or task_index >= len(tasks_db):
            raise HTTPException(status_code=404, detail="Task not found")

        # Delete the old task from the list
        deleted_task = tasks_db.pop(task_index)

        # Update the existing task fields with the new values
        tasks_db.insert(task_index, updated_task)

        # Return the updated task
        return TaskResponse(message="Task successfully updated", task=updated_task)
    except IndexError:
        raise HTTPException(status_code=404, detail="Task not found")

# Endpoint to delete a task
@app.delete("/tasks/{task_index}", response_model=TaskResponse)
async def delete_task(task_index: int):
    try:
        deleted_task = tasks_db.pop(task_index)
        return TaskResponse(message="Task successfully deleted", task=deleted_task)
    except IndexError:
        raise HTTPException(status_code=404, detail="Task not found")
