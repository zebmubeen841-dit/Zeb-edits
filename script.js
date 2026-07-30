// Load Saved Logo on Start
function loadSiteLogo() {
    let savedLogoText = localStorage.getItem('zeb_logo_text') || "ZEB GRAPHICS";
    let savedLogoImg = localStorage.getItem('zeb_logo_img') || "";
    const brandContainer = document.getElementById('brandContainer');

    if(brandContainer) {
        if(savedLogoImg) {
            brandContainer.innerHTML = `<img src="${savedLogoImg}" alt="Logo" class="nav-logo-img">`;
        } else {
            brandContainer.innerHTML = `<h2 id="navLogoText">${savedLogoText}</h2>`;
        }
        let logoInputVal = localStorage.getItem('zeb_logo_text');
        let logoTitleInput = document.getElementById('siteLogoTitle');
        if(logoInputVal && logoTitleInput) {
            logoTitleInput.value = logoInputVal;
        }
    }
}

// Update Logo Function from Admin Panel
function updateSiteLogo() {
    let newText = document.getElementById('siteLogoTitle').value.trim();
    let logoFileImg = document.getElementById('siteLogoImage');

    if(logoFileImg && logoFileImg.files && logoFileImg.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            let img = new Image();
            img.onload = function() {
                let canvas = document.createElement('canvas');
                let MAX_DIM = 400; // Logo ke liye chhota size taake storage full na ho
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_DIM) { height *= MAX_DIM / width; width = MAX_DIM; }
                } else {
                    if (height > MAX_DIM) { width *= MAX_DIM / height; height = MAX_DIM; }
                }

                canvas.width = width;
                canvas.height = height;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                let imgData = canvas.toDataURL('image/jpeg', 0.7);
                localStorage.setItem('zeb_logo_img', imgData);
                if(newText) {
                    localStorage.setItem('zeb_logo_text', newText);
                }
                loadSiteLogo();
                alert('Logo Image Updated Successfully!');
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(logoFileImg.files[0]);
    } else {
        if(newText) {
            localStorage.setItem('zeb_logo_text', newText);
            localStorage.removeItem('zeb_logo_img');
            loadSiteLogo();
            alert('Logo Text Updated Successfully!');
        } else {
            alert('Please enter text or select an image for the logo!');
        }
    }
}

// Check Login Session on Load
function checkLoginState() {
    let isLoggedIn = sessionStorage.getItem('zeb_admin_logged');
    let loginCard = document.getElementById('loginCard');
    let dashboardCard = document.getElementById('dashboardCard');

    if(loginCard && dashboardCard) {
        if(isLoggedIn === 'true') {
            loginCard.style.display = 'none';
            dashboardCard.style.display = 'block';
        } else {
            loginCard.style.display = 'block';
            dashboardCard.style.display = 'none';
        }
    }
}

// Login Handler
function handleLogin() {
    let u = document.getElementById('loginUser').value.trim();
    let p = document.getElementById('loginPass').value.trim();

    if(u === 'admin' && p === 'zeb123') {
        sessionStorage.setItem('zeb_admin_logged', 'true');
        document.getElementById('loginUser').value = '';
        document.getElementById('loginPass').value = '';
        checkLoginState();
        alert('Successfully Logged In as Admin!');
    } else {
        alert('Invalid Username or Password!');
    }
}

// Logout Handler
function handleLogout() {
    sessionStorage.removeItem('zeb_admin_logged');
    checkLoginState();
    alert('Logged out successfully.');
}

// Tab Switcher Function
function switchTab(tabName) {
    const sView = document.getElementById('services-view');
    const aView = document.getElementById('admin-view');
    if(tabName === 'services') {
        sView.classList.add('active');
        aView.classList.remove('active');
    } else {
        aView.classList.add('active');
        sView.classList.remove('active');
        checkLoginState();
    }
}

// Default Services Data
let defaultServices = [
    { title: "Logo & Branding", desc: "Luxury posters & brand identities.", img: "" },
    { title: "Editing & CapCut", desc: "Pro visual effects & lyric edits.", img: "" },
    { title: "Electronics & UPS", desc: "Specialized appliance & UPS repair.", img: "" }
];

// Load Services Function
function loadServices() {
    try {
        let saved = localStorage.getItem('zeb_services');
        let services = saved ? JSON.parse(saved) : defaultServices;
        
        const deck = document.getElementById('cardsDeck');
        if(deck) {
            deck.innerHTML = '';
            services.forEach((item) => {
                const div = document.createElement('div');
                div.className = 'glass-card';
                let imgHtml = item.img ? `<img src="${item.img}" class="card-img" alt="Service Image" onclick="openModal('${item.img}')" title="Click to Open/View">` : '';
                div.innerHTML = `${imgHtml}<h4>${item.title}</h4><p>${item.desc}</p>`;
                deck.appendChild(div);
            });
        }

        const adminList = document.getElementById('adminServiceList');
        if(adminList) {
            adminList.innerHTML = '';
            services.forEach((item, index) => {
                const row = document.createElement('div');
                row.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 6px 10px; border-radius: 4px; font-size: 11px;";
                
                let downloadBtn = item.img ? `<button onclick="downloadServiceImage(${index})" style="background: #3399ff; color: #fff; border: none; padding: 3px 6px; border-radius: 3px; cursor: pointer; font-size: 9px; margin-right: 3px;">Down</button>` : '';

                row.innerHTML = `
                    <span style="color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;">${item.title}</span>
                    <div>
                        ${downloadBtn}
                        <button onclick="editService(${index})" style="background: #00ffcc; border: none; padding: 3px 6px; border-radius: 3px; cursor: pointer; font-size: 9px; margin-right: 3px; font-weight: bold;">Edit</button>
                        <button onclick="deleteService(${index})" style="background: #ff3366; color: #fff; border: none; padding: 3px 6px; border-radius: 3px; cursor: pointer; font-size: 9px;">Del</button>
                    </div>
                `;
                adminList.appendChild(row);
            });
        }

    } catch(err) {
        console.error("Storage load error:", err);
    }
}

// Open Image Modal Viewer
function openModal(imgSrc) {
    document.getElementById('modalImg').src = imgSrc;
    document.getElementById('imgModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('imgModal').style.display = 'none';
}

// Download Single Service Image
function downloadServiceImage(index) {
    let saved = localStorage.getItem('zeb_services');
    let services = saved ? JSON.parse(saved) : defaultServices;
    let item = services[index];
    if(item && item.img) {
        let link = document.createElement('a');
        link.href = item.img;
        link.download = (item.title || 'service') + '_zeb.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Save or Update Service Item with Strong Compression
function saveOrUpdateService() {
    let titleInput = document.getElementById('serviceTitle');
    let descInput = document.getElementById('serviceDesc');
    let imageInput = document.getElementById('imageFile');
    let editIndex = document.getElementById('editIndex').value;
    
    if(!titleInput.value.trim()) {
        alert('Please enter a service title!');
        return;
    }

    let title = titleInput.value;
    let desc = descInput.value || 'Professional studio service.';

    let saved = localStorage.getItem('zeb_services');
    let services = saved ? JSON.parse(saved) : defaultServices;

    if(imageInput.files && imageInput.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            let img = new Image();
            img.onload = function() {
                let canvas = document.createElement('canvas');
                let MAX_DIM = 600; // Size chhota kar diya hai taake storage full na ho
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_DIM) { height *= MAX_DIM / width; width = MAX_DIM; }
                } else {
                    if (height > MAX_DIM) { width *= MAX_DIM / height; height = MAX_DIM; }
                }

                canvas.width = width;
                canvas.height = height;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Quality 0.7 rakhi hai taake file size bohat chhota ho jaye
                let compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                processSave(services, title, desc, compressedDataUrl, editIndex);
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        let existingImg = "";
        if(editIndex !== "-1") {
            existingImg = services[index].img || "";
        }
        processSave(services, title, desc, existingImg, editIndex);
    }
}

function processSave(services, title, desc, img, editIndex) {
    if(editIndex === "-1") {
        services.push({ title: title, desc: desc, img: img });
    } else {
        services[editIndex] = { title: title, desc: desc, img: img };
        document.getElementById('editIndex').value = "-1";
        document.getElementById('formHeading').innerText = "Add New Service";
        document.getElementById('saveBtn').innerText = "+ Save Service";
    }

    try {
        localStorage.setItem('zeb_services', JSON.stringify(services));
        document.getElementById('serviceTitle').value = '';
        document.getElementById('serviceDesc').value = '';
        document.getElementById('imageFile').value = '';
        loadServices();
        switchTab('services');
    } catch(e) {
        alert('Storage full ho chuki hai! Kuch purani items delete karein.');
    }
}

// Edit Service Setup
function editService(index) {
    let saved = localStorage.getItem('zeb_services');
    let services = saved ? JSON.parse(saved) : defaultServices;
    let item = services[index];

    document.getElementById('serviceTitle').value = item.title;
    document.getElementById('serviceDesc').value = item.desc;
    document.getElementById('editIndex').value = index;
    document.getElementById('formHeading').innerText = "Edit Service #" + (index + 1);
    document.getElementById('saveBtn').innerText = "Update Service";
    
    switchTab('admin');
}

// Delete Single Service
function deleteService(index) {
    let saved = localStorage.getItem('zeb_services');
    let services = saved ? JSON.parse(saved) : defaultServices;
    
    services.splice(index, 1);
    localStorage.setItem('zeb_services', JSON.stringify(services));
    loadServices();
}

// Clear All Services Function
function clearAllServices() {
    if(confirm('Are you sure you want to clear all services?')) {
        localStorage.removeItem('zeb_services');
        loadServices();
    }
}

// Theme Switcher Function
const themes = ['#08080a', '#050f14', '#14050a'];
let tIdx = 0;
function cycleTheme() {
    tIdx = (tIdx + 1) % themes.length;
    document.body.style.backgroundColor = themes[tIdx];
}

// Run immediately when script loads
loadSiteLogo();
loadServices();
checkLoginState();
