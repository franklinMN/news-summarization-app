document.addEventListener("DOMContentLoaded", () => {
    const auth = firebase.auth();
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    loginBtn.addEventListener("click", login);
    logoutBtn.addEventListener("click", logout);

    auth.onAuthStateChanged(user => {
        if (user) {
            console.log("User logged in:", user.email);
            logoutBtn.style.display = "block";
            loginBtn.style.display = "none";
        } else {
            logoutBtn.style.display = "none";
            loginBtn.style.display = "block";
        }
    });
});

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("errorMsg");

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            console.log("Login successful:", userCredential.user.email);
            window.location.href = "dashboard.html"; // Redirect to dashboard
        })
        .catch(error => {
            errorMsg.textContent = "Login failed: " + error.message;
        });
}

function logout() {
    firebase.auth().signOut()
        .then(() => console.log("User logged out"))
        .catch(error => console.error("Logout error:", error));
}
