function addPost() {
    let title = document.getElementById('title').value;
    let bulletPoints = document.getElementById('bulletPoints').value.split("\n").filter(Boolean);
    let summary = document.getElementById('summary').value;
    let source = document.getElementById('source').value;
    let tags = document.getElementById('tags').value.split(",").map(tag => tag.trim());
    let date = new Date().toISOString().split('T')[0];

    let post = { id: Date.now(), title, bulletPoints, summary, source, tags, date };

    let posts = JSON.parse(localStorage.getItem("newsPosts")) || [];
    posts.push(post);
    localStorage.setItem("newsPosts", JSON.stringify(posts));

    alert("Post added successfully!");
    displayPosts();
}





function displayPosts() {
    let posts = JSON.parse(localStorage.getItem("newsPosts")) || [];
    let newsFeed = document.getElementById("newsFeed");
    newsFeed.innerHTML = "";

    posts.forEach(post => {
        let postElement = document.createElement("div");
        postElement.className = "post";
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <ul>${post.bulletPoints.map(point => `<li>${point}</li>`).join('')}</ul>
            ${post.summary ? `<p><strong>Summary:</strong> ${post.summary}</p>` : ""}
            <p><a href="${post.source}" target="_blank">Source</a></p>
            <p class="tags">Tags: ${post.tags.join(", ")}</p>
            <p class="tags">Date: ${post.date}</p>
        `;
        newsFeed.appendChild(postElement);
    });
}




function filterPosts() {
    let filterTag = document.getElementById("filterTags").value.toLowerCase();
    let filterDate = document.getElementById("filterDate").value;
    let posts = JSON.parse(localStorage.getItem("newsPosts")) || [];

    let filteredPosts = posts.filter(post => 
        (filterTag ? post.tags.some(tag => tag.toLowerCase().includes(filterTag)) : true) &&
        (filterDate ? post.date === filterDate : true)
    );

    let newsFeed = document.getElementById("newsFeed");
    newsFeed.innerHTML = "";

    filteredPosts.forEach(post => {
        let postElement = document.createElement("div");
        postElement.className = "post";
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <ul>${post.bulletPoints.map(point => `<li>${point}</li>`).join('')}</ul>
            ${post.summary ? `<p><strong>Summary:</strong> ${post.summary}</p>` : ""}
            <p><a href="${post.source}" target="_blank">Source</a></p>
            <p class="tags">Tags: ${post.tags.join(", ")}</p>
            <p class="tags">Date: ${post.date}</p>
        `;
        newsFeed.appendChild(postElement);
    });
}

window.onload = displayPosts;
