// 1. Luxury Percentage Loader Animation
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
            width += 5; // Loader speed
            progressBar.style.width = width + '%';
            percentageText.innerText = width + '%';
        }
    }, 25);
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
