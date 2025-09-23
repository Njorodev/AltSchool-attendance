from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_todo():
    response = client.post("/todos/", json={"title": "Test Todo"})
    assert response.status_code == 201
    assert response.json()=={"id": 1, "title": "Test Todo", "completed": False}

def test_read_todos():
    client.post("/todos/", json={"title": "Todo 1"})
    client.post("/todos/", json={"title": "Todo 2"})
    response = client.get("/todos/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    assert data[0]["title"] == "Todo 1"
    
    
