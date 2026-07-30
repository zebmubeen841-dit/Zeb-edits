// 1. Luxury Percentage Loader Animation
function startLoader() {
    let progressBar = document.getElementById('progressBar');
    let percentageText = document.getElementById('percentageText');
    let pageLoader = document.getElementById('pageLoader');
    
    // Agar element na mile toh error se bachne ke liye
    if (!progressBar || !percentageText || !pageLoader) return;
    
    let width = 0;
    let interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            // 100% hone par loader ko chupana
            pageLoader.classList.add('fade-out');
            
            // Screen se hamesha ke liye hata dena taake neeche website click ho sake
            setTimeout(() => {
                pageLoader.style.display = 'none';
            }, 500);
        } else {
            width += 2; // Speed (isay barhayenge toh loader tez chalega)
            progressBar.style.width = width + '%';
            percentageText.innerText = width + '%';
        }
    }, 25);
}

// Loader ko foran start karne ka command
startLoader();

// 2. Mobile Menu Toggle Functionality
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('navLinks');

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking any link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}
