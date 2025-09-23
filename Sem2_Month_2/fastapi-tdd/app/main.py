# app/main.py

from fastapi import FastAPI, status, HTTPException
from pydantic import BaseModel
from app import crud

app = FastAPI()


class TodoItem(BaseModel):
    title: str
    completed: bool = False


@app.post("/todos/", status_code=status.HTTP_201_CREATED)
def create_todo(todo: TodoItem):
    return crud.create_todo(title=todo.title, completed=todo.completed)


@app.get("/todos/")
def list_todos():
    return crud.get_todos()


@app.get("/todos/{todo_id}")
def read_todo(todo_id: int):
    todo = crud.get_todo(todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@app.put("/todos/{todo_id}")
def update_todo(todo_id: int, todo: TodoItem):
    updated = crud.update_todo(todo_id, title=todo.title, completed=todo.completed)
    if not updated:
        raise HTTPException(status_code=404, detail="Todo not found")
    return updated


@app.delete("/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int):
    success = crud.delete_todo(todo_id)
    if not success:
        raise HTTPException(status_code=404, detail="Todo not found")
