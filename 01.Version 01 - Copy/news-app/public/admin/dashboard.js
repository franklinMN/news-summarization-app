let editingPostId = null; // To track the post being edited

document.addEventListener("DOMContentLoaded", () => {
    const auth = firebase.auth();
    const db = firebase.firestore();

    const logoutBtn = document.getElementById("logoutBtn");
    const addPostBtn = document.getElementById("addPostBtn");

    

    logoutBtn.addEventListener("click", logout);
    addPostBtn.addEventListener("click", () => {
        if (editingPostId) {
            updatePost(editingPostId);
        } else {
            addPost();
        }
    });

    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = "admin.html";
        }
    });

    loadPosts();
});

function logout() {
    firebase.auth().signOut()
        .then(() => window.location.href = "admin.html")
        .catch(error => console.error("Logout error:", error));
}

function addPost() {
    if (editingPostId) {
        updatePost(editingPostId);
        return; // Prevents executing addPost logic
    }
    const title = document.getElementById("title").value.trim();
    const bulletPoints = document.getElementById("bulletPoints").value.split("\n").map(bp => bp.trim()).filter(Boolean);
    const summary = document.getElementById("summary").value.trim();
    const source = document.getElementById("source").value.trim();
    const tags = document.getElementById("tags").value.split(",").map(tag => tag.trim()).filter(Boolean);

    if (!title || bulletPoints.length === 0) {
        alert("Title and bullet points are required!");
        return;
    }

    firebase.firestore().collection("posts").add({
        title,
        bulletPoints,
        summary,
        source,
        tags,
        date: new Date().toISOString()
    }).then(() => {
        alert("Post added!");
        clearForm();
        loadPosts(); // Refresh posts list dynamically
    }).catch(error => console.error("Error adding post:", error));
}

function loadPosts() {
    firebase.firestore().collection("posts").orderBy("date", "desc").onSnapshot(snapshot => {
        const newsFeed = document.getElementById("newsFeed");
        newsFeed.innerHTML = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            const div = document.createElement("div");
            div.innerHTML = `
                <strong>${data.title}</strong> - ${new Date(data.date).toLocaleString()} <br>
                <ul>${data.bulletPoints.map(point => `<li>${point}</li>`).join("")}</ul>
                <strong>Summary:</strong> ${data.summary || "N/A"}<br>
                <strong>Source:</strong> <a href="${data.source}" target="_blank">${data.source}</a><br>
                <button onclick="editPost('${doc.id}')">Edit</button>
                <button onclick="deletePost('${doc.id}')">Delete</button>
            `;
            newsFeed.appendChild(div);
        });
    }, error => console.error("Error loading posts:", error));
}

function editPost(postId) {
    firebase.firestore().collection("posts").doc(postId).get().then(doc => {
        if (doc.exists) {
            const data = doc.data();
            document.getElementById("title").value = data.title;
            document.getElementById("bulletPoints").value = data.bulletPoints.join("\n");
            document.getElementById("summary").value = data.summary || "";
            document.getElementById("source").value = data.source || "";
            document.getElementById("tags").value = data.tags.join(", ");

            editingPostId = postId;
            document.getElementById("addPostBtn").textContent = "Update Post";
        }
    }).catch(error => console.error("Error fetching post:", error));
}

function updatePost(postId) {
    const title = document.getElementById("title").value.trim();
    const bulletPoints = document.getElementById("bulletPoints").value.split("\n").map(bp => bp.trim()).filter(Boolean);
    const summary = document.getElementById("summary").value.trim();
    const source = document.getElementById("source").value.trim();
    const tags = document.getElementById("tags").value.split(",").map(tag => tag.trim()).filter(Boolean);

    if (!title || bulletPoints.length === 0) {
        alert("Title and bullet points are required!");
        return;
    }

    firebase.firestore().collection("posts").doc(postId).update({
        title,
        bulletPoints,
        summary,
        source,
        tags
    }).then(() => {
        alert("Post updated!");
        clearForm();
        loadPosts(); // Refresh the UI dynamically
    }).catch(error => console.error("Error updating post:", error));
}

function deletePost(id) {
    if (confirm("Are you sure you want to delete this post?")) {
        firebase.firestore().collection("posts").doc(id).delete()
            .then(() => {
                alert("Post deleted");
                loadPosts(); // Refresh UI after deletion
            })
            .catch(error => console.error("Error deleting post:", error));
    }
}

function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("bulletPoints").value = "";
    document.getElementById("summary").value = "";
    document.getElementById("source").value = "";
    document.getElementById("tags").value = "";
    document.getElementById("addPostBtn").textContent = "Add Post";
    editingPostId = null;
}
