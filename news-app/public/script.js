document.addEventListener("DOMContentLoaded", () => {
    loadPosts();
    document.getElementById("filterBtn").addEventListener("click", filterPosts);
});

// ✅ Load Posts
function loadPosts() {
    db.collection("posts").orderBy("date", "desc").onSnapshot(snapshot => {
        const newsFeed = document.getElementById("newsFeed");
        newsFeed.innerHTML = "";
        snapshot.forEach(doc => {
            let data = doc.data();
            let div = document.createElement("div");
            div.className = "post";
            div.innerHTML = `
                <h3>${data.title}</h3>
                <ul>${data.bulletPoints.map(point => `<li>${point}</li>`).join('')}</ul>
                ${data.summary ? `<p><strong>Summary:</strong> ${data.summary}</p>` : ""}
                <p><a href="${data.source}" target="_blank">Source</a></p>
                <p class="tags">Tags: ${data.tags.join(", ")}</p>
                <p class="tags">Date: ${new Date(data.date).toLocaleString()}</p>
            `;
            newsFeed.appendChild(div);
        });
    }, error => console.error("Error loading posts:", error));
}

// ✅ Filter Posts
function filterPosts() {
    let filterTag = document.getElementById("filterTags").value.toLowerCase();
    let filterDate = document.getElementById("filterDate").value;

    db.collection("posts").orderBy("date", "desc").get().then(snapshot => {
        const newsFeed = document.getElementById("newsFeed");
        newsFeed.innerHTML = "";

        snapshot.docs.forEach(doc => {
            let data = doc.data();
            let matchTag = filterTag ? data.tags.some(tag => tag.toLowerCase().includes(filterTag)) : true;
            let matchDate = filterDate ? data.date === filterDate : true;

            if (matchTag && matchDate) {
                let div = document.createElement("div");
                div.className = "post";
                div.innerHTML = `
                    <h3>${data.title}</h3>
                    <ul>${data.bulletPoints.map(point => `<li>${point}</li>`).join('')}</ul>
                    ${data.summary ? `<p><strong>Summary:</strong> ${data.summary}</p>` : ""}
                    <p><a href="${data.source}" target="_blank">Source</a></p>
                    <p class="tags">Tags: ${data.tags.join(", ")}</p>
                    <p class="tags">Date: ${new Date(data.date).toLocaleString()}</p>
                `;
                newsFeed.appendChild(div);
            }
        });
    }).catch(error => console.error("Error filtering posts:", error));
}
