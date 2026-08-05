// Hide Preloader once window is loaded
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Mobile Navbar Toggle
const menuIcon = document.getElementById('menuIcon');
const navLinks = document.getElementById('navLinks');

if (menuIcon) {
    menuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuIcon.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks) navLinks.classList.remove('active');
        if (menuIcon) {
            const icon = menuIcon.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
});


// --- ADMIN & LIVE WEBSITE SYNC LOGIC ---

let defaultProjects = [
    { title: "Luxury Portfolio Website", desc: "Multi-file luxury layout built with responsive components.", img: "" },
    { title: "Zeb Notes Automation", desc: "Digital textbook series structured systematically.", img: "" },
    { title: "Brand Identity System", desc: "Complete asset packaging for digital editors.", img: "" }
];

window.addEventListener('DOMContentLoaded', () => {
    const displayLogoText = document.getElementById('displayLogoText');
    const displayLogoBox = document.getElementById('displayLogoBox');
    const displayHeroTitle = document.getElementById('displayHeroTitle');
    const displayHeroImg = document.getElementById('displayHeroImg');
    const dynamicProjectsGrid = document.getElementById('dynamicProjectsGrid');

    const savedLogo = localStorage.getItem('mz_logoText');
    const savedTitle = localStorage.getItem('mz_heroTitle');
    const savedImg = localStorage.getItem('mz_heroImg');
    const savedProjects = localStorage.getItem('mz_projects');

    if (displayLogoText && savedLogo) {
        displayLogoText.textContent = savedLogo;
        displayLogoBox.textContent = savedLogo.slice(0, 2).toUpperCase();
    }
    if (displayHeroTitle && savedTitle) {
        displayHeroTitle.innerHTML = savedTitle;
    }
    if (displayHeroImg && savedImg) {
        displayHeroImg.src = savedImg;
    }
    if (dynamicProjectsGrid) {
        renderProjects(savedProjects ? JSON.parse(savedProjects) : defaultProjects, dynamicProjectsGrid);
    }

    const adminLogoInput = document.getElementById('adminLogoText');
    const adminTitleInput = document.getElementById('adminHeroTitle');
    const adminImgInput = document.getElementById('adminHeroImg');

    if (adminLogoInput && savedLogo) adminLogoInput.value = savedLogo;
    if (adminTitleInput && savedTitle) adminTitleInput.value = savedTitle;
    if (adminImgInput && savedImg) adminImgInput.value = savedImg;
});

// Admin Form Submission Handler
const adminForm = document.getElementById('adminForm');
if (adminForm) {
    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newLogo = document.getElementById('adminLogoText').value;
        const newTitle = document.getElementById('adminHeroTitle').value;
        const newImg = document.getElementById('adminHeroImg').value; // Folder file name (misal: mubeen.jpg)

        const projTitle = document.getElementById('adminProjTitle').value;
        const projDesc = document.getElementById('adminProjDesc').value;
        const projImg = document.getElementById('adminProjImg').value; // Project file name (misal: proj1.jpg)

        if (newLogo) localStorage.setItem('mz_logoText', newLogo);
        if (newTitle) localStorage.setItem('mz_heroTitle', newTitle);
        if (newImg) localStorage.setItem('mz_heroImg', newImg);

        let currentProjects = localStorage.getItem('mz_projects') ? JSON.parse(localStorage.getItem('mz_projects')) : defaultProjects;

        if (projTitle && projDesc) {
            currentProjects.push({ title: projTitle, desc: projDesc, img: projImg });
            localStorage.setItem('mz_projects', JSON.stringify(currentProjects));
            
            document.getElementById('adminProjTitle').value = '';
            document.getElementById('adminProjDesc').value = '';
            document.getElementById('adminProjImg').value = '';
        }

        alert('Updated Successfully! Changes are saved.');
    });
}

// Render Helper Function
function renderProjects(projectsArray, container) {
    container.innerHTML = '';
    projectsArray.forEach((proj, index) => {
        let imgContent = proj.img ? `<img src="${proj.img}" alt="${proj.title}">` : `Project ${index + 1}`;
        
        const cardHTML = `
            <div class="card">
                <div class="project-img-placeholder">${imgContent}</div>
                <h3>${proj.title}</h3>
                <p>${proj.desc}</p>
                <a href="index.html#contact" class="card-btn">View Project</a>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

// Reset Handler
const resetBtn = document.getElementById('resetBtn');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all modifications?')) {
            localStorage.clear();
            alert('Reset to defaults.');
            location.reload();
        }
    });
}
