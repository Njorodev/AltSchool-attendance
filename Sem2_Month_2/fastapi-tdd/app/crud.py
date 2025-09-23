# app/crud.py

from typing import List, Dict

# In-memory "database"
todos: List[Dict] = []
current_id: int = 1


def create_todo(title: str, completed: bool = False) -> Dict:
    """Create a new todo item"""
    global current_id
    item = {"id": current_id, "title": title, "completed": completed}
    todos.append(item)
    current_id += 1
    return item


def get_todos() -> List[Dict]:
    """Return all todos"""
    return todos


def get_todo(todo_id: int) -> Dict | None:
    """Return a todo by ID"""
    return next((todo for todo in todos if todo["id"] == todo_id), None)


def update_todo(todo_id: int, title: str | None = None, completed: bool | None = None) -> Dict | None:
    """Update a todo by ID"""
    todo = get_todo(todo_id)
    if not todo:
        return None
    if title is not None:
        todo["title"] = title
    if completed is not None:
        todo["completed"] = completed
    return todo


def delete_todo(todo_id: int) -> bool:
    """Delete a todo by ID"""
    global todos
    todo = get_todo(todo_id)
    if not todo:
        return False
    todos = [t for t in todos if t["id"] != todo_id]
    return True
