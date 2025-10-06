// ✅ Replace with your Render API base URL
const API = "https://edu-track-api.onrender.com";

/* ========== USERS ========== */
async function loadUsers() {
  try {
    const res = await fetch(`${API}/users/`);
    if (!res.ok) throw new Error(`Failed to load users: ${res.status}`);
    const users = await res.json();

    const list = document.getElementById("userList");
    if (!list) return;

    list.innerHTML = users
      .map((u) => {
        const isActive = u.is_active; // correct backend property

        return `
        <li class="${isActive ? "" : "inactive"}">
          <div>
            <b>${u.id}.</b> ${u.name ?? "(Unnamed)"} (${u.email ?? "No email"})
            <span class="status" style="font-weight:bold; color:${isActive ? "green" : "red"};">
              [${isActive ? "Active" : "Inactive"}]
            </span>
          </div>
          <div>
            ${isActive ? `<button onclick="deactivateUser(${u.id})" class="deactivate-btn">Deactivate</button>` : ""}
            <button onclick="editUser(${u.id})">Edit</button>
            <button onclick="deleteUser(${u.id})">Delete</button>
          </div>
        </li>`;
      })
      .join("");
  } catch (error) {
    console.error(error);
    alert("Error loading users: " + error.message);
  }
}

async function deactivateUser(id) {
  try {
    const res = await fetch(`${API}/users/${id}/deactivate`, { method: "POST" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Deactivate failed: ${res.status} ${text}`);
    }

    // Reload list to immediately reflect status change
    await loadUsers();
  } catch (error) {
    console.error("Error deactivating user:", error);
    alert("Error deactivating user: " + error.message);
  }
}


async function deactivateUser(id) {
  try {
    const res = await fetch(`${API}/users/${id}/deactivate`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to deactivate user.");
    await loadUsers(); // Refresh the user list to reflect status change
  } catch (error) {
    alert("Error deactivating user: " + error.message);
  }
}

async function deleteUser(id) {
  await fetch(`${API}/users/${id}`, { method: "DELETE" });
  loadUsers();
}

function editUser(id) {
  const newName = prompt("Enter new name:");
  const newEmail = prompt("Enter new email:");
  if (!newName || !newEmail) return;
  fetch(`${API}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newName, email: newEmail }),
  }).then(loadUsers);
}

document.getElementById("userForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("userName").value;
  const email = document.getElementById("userEmail").value;
  await fetch(`${API}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
  e.target.reset();
  loadUsers();
});

document
  .getElementById("batchUserForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = document.getElementById("batchUsers").value;
    try {
      const users = JSON.parse(data);
      await fetch(`${API}/users/batch/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(users),
      });
      loadUsers();
    } catch {
      alert("Invalid JSON format!");
    }
  });

/* ========== COURSES ========== */
async function loadCourses() {
  try {
    const res = await fetch(`${API}/courses/`);
    if (!res.ok) throw new Error("Failed to load courses.");
    const courses = await res.json();

    const list = document.getElementById("courseList");
    if (!list) return;

    list.innerHTML = courses
      .map((c) => {
        const isOpen = c.open ?? c.is_open ?? false;

        return `
        <li class="${isOpen ? "" : "closed"}">
          <div>
            <b>${c.id}.</b> ${c.title} - ${c.description}
            <span class="status" style="font-weight:bold; color:${isOpen ? "green" : "red"};">
              [${isOpen ? "Open" : "Closed"}]
            </span>
          </div>
          <div>
            ${isOpen ? `<button onclick="closeCourse(${c.id})">Close</button>` : ""}
            <button onclick="viewUsersInCourse(${c.id})">View Users</button>
            <button onclick="patchCourse(${c.id})">Edit</button>
            <button onclick="deleteCourse(${c.id})">Delete</button>
          </div>
        </li>`;
      })
      .join("");
  } catch (error) {
    console.error(error);
    alert("Error loading courses: " + error.message);
  }
}
async function patchCourse(id) {
  try {
    // Get existing course details first
    const res = await fetch(`${API}/courses/${id}`);
    if (!res.ok) throw new Error("Failed to fetch course details.");
    const course = await res.json();

    // Prompt user for new values (default = current values)
    const newTitle = prompt("Enter new course title:", course.title);
    if (newTitle === null) return; // Cancelled
    const newDescription = prompt("Enter new course description:", course.description);
    if (newDescription === null) return;

    // Send PATCH (or PUT if API doesn’t support PATCH)
    const updateRes = await fetch(`${API}/courses/${id}`, {
      method: "PUT", // if your API supports PATCH, change this to PATCH
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription
      }),
    });

    if (!updateRes.ok) throw new Error("Failed to update course.");

    alert("Course updated successfully!");
    await loadCourses(); // reload list
  } catch (error) {
    console.error(error);
    alert("Error updating course: " + error.message);
  }
}


async function closeCourse(id) {
  try {
    const res = await fetch(`${API}/courses/${id}/close`, { method: "POST" });
    if (!res.ok) throw new Error(`Failed to close course ${id}.`);
    await loadCourses(); // refresh immediately
  } catch (error) {
    console.error(error);
    alert("Error closing course: " + error.message);
  }
}

async function deleteCourse(id) {
  await fetch(`${API}/courses/${id}`, { method: "DELETE" });
  loadCourses();
}

async function viewUsersInCourse(id) {
  try {
    const res = await fetch(`${API}/courses/${id}/users`);
    if (!res.ok) throw new Error("Failed to fetch users for this course.");
    
    const userIds = await res.json();
    if (!userIds.length) {
      alert("No users enrolled yet.");
      return;
    }

    // Fetch full user details for each ID
    const users = await Promise.all(
      userIds.map(async (uid) => {
        const ures = await fetch(`${API}/users/${uid}`);
        if (!ures.ok) return { id: uid, name: "Unknown" };
        const user = await ures.json();
        return user;
      })
    );

    alert(
      `Users enrolled in course ${id}:\n` +
        users.map((u) => `- ${u.id}: ${u.name ?? u.email ?? "Unknown"}`).join("\n")
    );
  } catch (error) {
    alert("Error loading users for this course: " + error.message);
  }
}



document.getElementById("courseForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("courseTitle").value;
  const description = document.getElementById("courseDescription").value;
  await fetch(`${API}/courses/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  e.target.reset();
  loadCourses();
});

/* ========== ENROLLMENTS ========== */
async function loadEnrollments() {
  const res = await fetch(`${API}/enrollments/`);
  const enrolls = await res.json();
  const list = document.getElementById("enrollList");
  if (!list) return;
  list.innerHTML = enrolls
    .map(
      (e) => `
      <li>
        User ${e.user_id} → Course ${e.course_id} 
        <span class="status">${e.completed ? "✅ Completed" : "❌ Pending"}</span>
        ${
          !e.completed
            ? `<button onclick="markComplete(${e.id})">Mark Complete</button>`
            : ""
        }
      </li>`
    )
    .join("");
}

async function markComplete(id) {
  await fetch(`${API}/enrollments/${id}/complete`, { method: "POST" });
  loadEnrollments();
}

document.getElementById("enrollForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const user_id = parseInt(document.getElementById("enrollUserId").value);
  const course_id = parseInt(document.getElementById("enrollCourseId").value);
  await fetch(`${API}/enrollments/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, course_id }),
  });
  e.target.reset();
  loadEnrollments();
});

/* ========== INITIAL LOAD ========== */
window.onload = () => {
  loadUsers();
  loadCourses();
  loadEnrollments();
};
