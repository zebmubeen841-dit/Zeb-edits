const ADMIN_KEY = "zeb123";

function loginAdmin() {
    const passInput = document.getElementById('adminPassword').value;
    const errorText = document.getElementById('loginError');

    if (passInput === ADMIN_KEY) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        loadProjectsList();
    } else {
        errorText.style.display = 'block';
    }
}

function logoutAdmin() {
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPassword').value = "";
}

function updateTitle() {
    const newTitle = document.getElementById('newTitleInput').value.trim();
    if (newTitle !== "") {
        localStorage.setItem('portfolioTitle', newTitle);
        alert("Title updated permanently!");
        document.getElementById('newTitleInput').value = "";
    } else {
        alert("Please enter a valid title.");
    }
}

function updateLogo() {
    const newLogo = document.getElementById('newLogoInput').value.trim();
    if (newLogo !== "") {
        localStorage.setItem('portfolioLogo', newLogo);
        alert("Logo updated successfully!");
        document.getElementById('newLogoInput').value = "";
    } else {
        alert("Please enter a valid logo name.");
    }
}

function addNewProject() {
    const title = document.getElementById('projectTitleInput').value.trim();
    const desc = document.getElementById('projectDescInput').value.trim();
    const img = document.getElementById('projectImgInput').value.trim();

    if (title !== "" && desc !== "") {
        let projects = JSON.parse(localStorage.getItem('customProjects')) || [];
        projects.push({ title, desc, img });
        localStorage.setItem('customProjects', JSON.stringify(projects));

        alert("Project added with image successfully!");
        document.getElementById('projectTitleInput').value = "";
        document.getElementById('projectDescInput').value = "";
        document.getElementById('projectImgInput').value = "";
        loadProjectsList();
    } else {
        alert("Please fill in title and description.");
    }
}

function loadProjectsList() {
    const listContainer = document.getElementById('adminProjectsList');
    let projects = JSON.parse(localStorage.getItem('customProjects')) || [];

    if (projects.length === 0) {
        listContainer.innerHTML = `<p style="color: #aaa; font-size: 13px;">No custom projects added yet.</p>`;
        return;
    }

    listContainer.innerHTML = "";
    projects.forEach((proj, index) => {
        const item = document.createElement('div');
        item.classList.add('admin-project-item');
        item.innerHTML = `
            <div>
                <strong>${proj.title}</strong><br>
                <span style="color: #aaa; font-size: 11px;">${proj.desc}</span>
            </div>
            <button onclick="deleteProject(${index})" class="btn-danger" style="padding: 4px 8px; font-size: 11px;">Delete</button>
        `;
        listContainer.appendChild(item);
    });
}

function deleteProject(index) {
    let projects = JSON.parse(localStorage.getItem('customProjects')) || [];
    projects.splice(index, 1);
    localStorage.setItem('customProjects', JSON.stringify(projects));
    loadProjectsList();
    alert("Project deleted!");
}
