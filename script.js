document.addEventListener('DOMContentLoaded', () => {
    // 1. Luxury Percentage Loader Animation at the Start
    function startLoader() {
        let progressBar = document.getElementById('progressBar');
        let percentageText = document.getElementById('percentageText');
        let pageLoader = document.getElementById('pageLoader');
        
        if (!progressBar || !percentageText || !pageLoader) return;
        
        let width = 0;
        let interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                pageLoader.classList.add('fade-out');
                setTimeout(() => {
                    pageLoader.style.display = 'none';
                }, 500);
            } else {
                width += 5; 
                progressBar.style.width = width + '%';
                percentageText.innerText = width + '%';
            }
        }, 20);
    }
    startLoader();

    // 2. Mobile Menu Toggle Functionality
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // 3. Dynamic Gallery Loader on Home Page (`index.html`)
    const publicGallery = document.getElementById('publicGallery');
    if (publicGallery) {
        let savedGallery = JSON.parse(localStorage.getItem('zebGallery')) || [];
        savedGallery.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'portfolio-item';
            galleryItem.style.backgroundImage = `url(${item.image})`;
            galleryItem.innerHTML = `
                <div class="portfolio-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.category}</p>
                </div>
            `;
            publicGallery.appendChild(galleryItem);
        });
    }

    // 4. Admin Login Handler (`admin.html`)
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');

    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
        if (loginSection) loginSection.style.display = 'none';
        if (dashboardSection) dashboardSection.style.display = 'block';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pass = document.getElementById('adminPassword').value;
            if (pass === 'admin123') {
                localStorage.setItem('isAdminLoggedIn', 'true');
                if (loginSection) loginSection.style.display = 'none';
                if (dashboardSection) dashboardSection.style.display = 'block';
            } else {
                alert('Wrong Password! Try "admin123"');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isAdminLoggedIn');
            if (dashboardSection) dashboardSection.style.display = 'none';
            if (loginSection) loginSection.style.display = 'flex';
        });
    }

    // 5. Admin Upload Handler (`admin.html`)
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('imgTitle').value;
            const category = document.getElementById('imgCategory').value;
            const fileInput = document.getElementById('imageFile');

            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imageData = event.target.result;
                    let galleryItems = JSON.parse(localStorage.getItem('zebGallery')) || [];
                    
                    galleryItems.push({ 
                        title: title, 
                        category: category, 
                        image: imageData 
                    });
                    
                    localStorage.setItem('zebGallery', JSON.stringify(galleryItems));

                    alert('Success! Photo uploaded to gallery.');
                    uploadForm.reset();
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                alert('Please select an image file first!');
            }
        });
    }
});
