 
const API = "https://edu-track-api.onrender.com";

async function loadUsers() {
  const res = await fetch(`${API}/users/`);
  const users = await res.json();
  const list = document.getElementById("userList");
  list.innerHTML = users
    .map(
      (u) =>
        `<li>${u.id}. ${u.name} (${u.email}) 
        <button onclick="deactivateUser(${u.id})">Deactivate</button></li>`
    )
    .join("");
}

async function deactivateUser(id) {
  await fetch(`${API}/users/${id}/deactivate`, { method: "POST" });
  loadUsers();
}

document.getElementById("userForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  await fetch(`${API}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
  e.target.reset();
  loadUsers();
});

async function loadCourses() {
  const res = await fetch(`${API}/courses/`);
  const courses = await res.json();
  const list = document.getElementById("courseList");
  list.innerHTML = courses
    .map(
      (c) =>
        `<li>${c.id}. ${c.title} - ${c.description} 
        <button onclick="closeCourse(${c.id})">Close</button></li>`
    )
    .join("");
}

async function closeCourse(id) {
  await fetch(`${API}/courses/${id}/close`, { method: "POST" });
  loadCourses();
}

document.getElementById("courseForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  await fetch(`${API}/courses/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  e.target.reset();
  loadCourses();
});

async function loadEnrollments() {
  const res = await fetch(`${API}/enrollments/`);
  const enrolls = await res.json();
  const list = document.getElementById("enrollList");
  list.innerHTML = enrolls
    .map(
      (e) =>
        `<li>${e.id}. User ${e.user_id} in Course ${e.course_id} — ${
          e.completed ? "✅ Completed" : "❌ Not completed"
        } 
        <button onclick="markComplete(${e.id})">Mark Complete</button></li>`
    )
    .join("");
}

async function markComplete(id) {
  await fetch(`${API}/enrollments/${id}/complete`, { method: "POST" });
  loadEnrollments();
}

document.getElementById("enrollForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const user_id = parseInt(document.getElementById("userId").value);
  const course_id = parseInt(document.getElementById("courseId").value);
  await fetch(`${API}/enrollments/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, course_id }),
  });
  e.target.reset();
  loadEnrollments();
});
