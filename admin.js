const ADMIN_KEY = "zeb123";

function loginAdmin() {
    const passInput = document.getElementById('adminPassword').value;
    const errorText = document.getElementById('loginError');

    if (passInput === ADMIN_KEY) {
        // لاگ ان کامیاب ہونے پر الرٹ اور ٹائم اسٹیمپ کے ساتھ نوٹیفیکیشن
        const loginTime = new Date().toLocaleString();
        console.log(`[Admin Security Alert] Successful Login at: ${loginTime}`);
        alert(`Kamyaab Login! Admin ne is waqt login kiya hai: ${loginTime}`);

        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        loadProjectsList();
    } else {
        errorText.style.display = 'block';
        console.warn("[Admin Security Alert] Failed login attempt detected.");
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

// پرانا لوگو ہٹا کر نیا لوگو مستقل (Permanent) سیو کرنے کا فنکشن
function uploadNewLogo() {
    const fileInput = document.getElementById('logoImageFile');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image file first.");
        return;
    }

    if (file.size > 1024 * 1024) {
        alert("File size exceeds 1MB. Please choose a smaller image.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const base64String = event.target.result;
        try {
            localStorage.removeItem('portfolioLogo');
            localStorage.setItem('portfolioLogoBase64', base64String);
            alert("Naya logo permanent taur par update ho gaya hai!");
            fileInput.value = "";
        } catch (e) {
            alert("Failed to upload logo. Storage full.");
            console.error(e);
        }
    };
    reader.readAsDataURL(file);
}

// نئے پروجیکٹ کی فوٹو کو پرماننٹ (Base64) سیو کرنے کا فنکشن
function addNewProject() {
    const title = document.getElementById('projectTitleInput').value.trim();
    const desc = document.getElementById('projectDescInput').value.trim();
    const fileInput = document.getElementById('projectImgFile');

    if (title === "" || desc === "") {
        alert("Please fill in title and description.");
        return;
    }

    const file = fileInput.files[0];
    
    if (file) {
        if (file.size > 1024 * 1024) {
            alert("Project image size exceeds 1MB. Please choose a smaller image.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const base64Img = event.target.result;
            saveProjectData(title, desc, base64Img);
        };
        reader.readAsDataURL(file);
    } else {
        // اگر فوٹو نہ دی جائے تو بغير فوٹو کے سیو کریں
        saveProjectData(title, desc, "");
    }
}

function saveProjectData(title, desc, img) {
    let projects = JSON.parse(localStorage.getItem('customProjects')) || [];
    projects.push({ title, desc, img });
    localStorage.setItem('customProjects', JSON.stringify(projects));

    alert("Project permanent taur par publish ho gaya hai!");
    document.getElementById('projectTitleInput').value = "";
    document.getElementById('projectDescInput').value = "";
    document.getElementById('projectImgFile').value = "";
    loadProjectsList();
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
    alert("Project delete kar diya gaya hai!");
}
