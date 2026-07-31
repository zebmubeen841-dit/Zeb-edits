window.addEventListener('DOMContentLoaded', () => {
    // Hide Loading Screen smoothly
    setTimeout(() => {
        const loader = document.getElementById('loadingScreen');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 1000);

    // Load Custom Title
    const savedTitle = localStorage.getItem('portfolioTitle');
    if (savedTitle) {
        document.getElementById('mainTitleDisplay').innerText = savedTitle;
    }

    // Load Custom Logo
    const savedLogo = localStorage.getItem('portfolioLogo');
    if (savedLogo) {
        document.getElementById('mainLogoDisplay').src = savedLogo;
    }

    // Load Custom Projects with Images
    const customProjects = JSON.parse(localStorage.getItem('customProjects')) || [];
    if (customProjects.length > 0) {
        const grid = document.getElementById('dynamicProjectsGrid');
        customProjects.forEach(proj => {
            const card = document.createElement('div');
            card.classList.add('card-glass', 'project-card');
            
            let imgHTML = `<span style="font-size: 35px;">⚡</span>`;
            if (proj.img) {
                imgHTML = `<img src="${proj.img}" alt="Project" style="width:100%; height:100%; object-fit:cover;" onerror="this.parentElement.innerHTML='⚡'">`;
            }

            card.innerHTML = `
                <div class="card-img-box">${imgHTML}</div>
                <h3>${proj.title}</h3>
                <p>${proj.desc}</p>
            `;
            grid.appendChild(card);
        });
    }
});
// Create Lightbox Modal Elements dynamically
const modal = document.createElement('div');
modal.classList.add('image-modal');
modal.innerHTML = `
    <span class="image-modal-close">&times;</span>
    <img id="modalImageContent" src="" alt="Zoomed Image">
`;
document.body.appendChild(modal);

const modalImg = document.getElementById('modalImageContent');
const closeModal = document.querySelector('.image-modal-close');

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Function to open image in lightbox
function openLightbox(imgSrc) {
    modalImg.src = imgSrc;
    modal.style.display = 'flex';
}
// Load Custom Projects with Images example inside DOMContentLoaded:
if (proj.img) {
    imgHTML = `<img src="${proj.img}" alt="Project" style="width:100%; height:100%; object-fit:cover;" onclick="openLightbox('${proj.img}')" onerror="this.parentElement.innerHTML='⚡'">`;
}
