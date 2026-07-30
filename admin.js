// Admin Login Logic
const loginForm = document.getElementById('loginForm');
const loginOverlay = document.getElementById('login-overlay');
const errorMsg = document.getElementById('errorMsg');
const logoutBtn = document.getElementById('logoutBtn');

if (sessionStorage.getItem('zebAdminLoggedIn') === 'true') {
    loginOverlay.style.display = 'none';
    loadAdminData();
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const passInput = document.getElementById('adminPassword').value;

    if (passInput === 'admin123') {
        sessionStorage.setItem('zebAdminLoggedIn', 'true');
        loginOverlay.style.display = 'none';
        errorMsg.style.display = 'none';
        loadAdminData();
    } else {
        errorMsg.style.display = 'block';
    }
});

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.removeItem('zebAdminLoggedIn');
    location.reload();
});

// Load Dashboard Data & Stats
function loadAdminData() {
    const tableBody = document.getElementById('messageTableBody');
    const customerTableBody = document.getElementById('customerTableBody');
    const totalCount = document.getElementById('totalCount');
    const totalCustomerCount = document.getElementById('totalCustomerCount');
    const totalGalleryCount = document.getElementById('totalGalleryCount');
    
    let messages = JSON.parse(localStorage.getItem('zebMessages')) || [];
    let customers = JSON.parse(localStorage.getItem('zebCustomers')) || [];
    let galleryItems = JSON.parse(localStorage.getItem('zebGalleryItems')) || [];
    
    totalCount.textContent = messages.length;
    totalCustomerCount.textContent = customers.length;
    totalGalleryCount.textContent = galleryItems.length;
    
    // Load Customers Table
    customerTableBody.innerHTML = '';
    if (customers.length === 0) {
        customerTableBody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">No customers registered yet.</td></tr>`;
    } else {
        customers.reverse().forEach((cust) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span>${cust.name}</span></td>
                <td>${cust.email}</td>
                <td>${cust.date}</td>
            `;
            customerTableBody.appendChild(row);
        });
    }

    // Load Messages Table
    tableBody.innerHTML = '';
    if (messages.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No client inquiries received yet.</td></tr>`;
    } else {
        messages.reverse().forEach((msg) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span>${msg.name}</span></td>
                <td>${msg.email}</td>
                <td>${msg.message}</td>
                <td>${msg.date}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Upload Gallery Item from Phone
const galleryForm = document.getElementById('galleryForm');
galleryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('galleryImageFile');
    const title = document.getElementById('galleryTitle').value;
    const subtitle = document.getElementById('gallerySubtitle').value;

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const base64Image = event.target.result;

            let galleryItems = JSON.parse(localStorage.getItem('zebGalleryItems')) || [];
            galleryItems.push({ imageUrl: base64Image, title, subtitle });
            localStorage.setItem('zebGalleryItems', JSON.stringify(galleryItems));

            alert('Photo uploaded successfully from your phone!');
            galleryForm.reset();
            loadAdminData();
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
});

// Update Logo Name
const logoForm = document.getElementById('logoForm');
logoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const mainText = document.getElementById('logoMainText').value;
    const subText = document.getElementById('logoSubText').value;

    const logoData = { mainText, subText };
    localStorage.setItem('zebLogoData', JSON.stringify(logoData));

    alert('Logo updated successfully!');
    logoForm.reset();
});

// Clear Messages Handler
const clearDataBtn = document.getElementById('clearDataBtn');
clearDataBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all client inquiries?')) {
        localStorage.removeItem('zebMessages');
        loadAdminData();
    }
});
