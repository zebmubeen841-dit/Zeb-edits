let currentUser = null;
let userUploadsCount = 0;
let userLikesCount = 4800;
let userFollowersCount = 1400;
let userFollowingCount = 120;
let userUploadedMediaArray = [];
let registeredFriendsArray = []; 

window.addEventListener('load', function() {
    const pageLoader = document.getElementById('pageLoader');
    setTimeout(() => {
        pageLoader.style.opacity = '0';
        setTimeout(() => {
            pageLoader.style.display = 'none';
        }, 500);
    }, 600);

    // Load saved permanent logo and title from localStorage
    const savedLogo = localStorage.getItem('zebSiteLogo');
    if (savedLogo) {
        document.getElementById('siteLogoImg').src = savedLogo;
    }

    const savedTitle = localStorage.getItem('zebSiteTitle');
    if (savedTitle) {
        document.getElementById('mainSiteLogo').innerText = savedTitle;
    }
});

function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('themeBtn');
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
        themeBtn.innerText = "🌙 Dark Mode";
    } else {
        themeBtn.innerText = "☀️ Light Mode";
    }
}

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

function openUploadModal() {
    if (!currentUser) {
        alert("Please login first to upload 3D media!");
        openLoginModal();
        return;
    }
    document.getElementById('uploadModal').style.display = 'flex';
}

function openProfileModal() {
    if (!currentUser) {
        openLoginModal();
        return;
    }
    document.getElementById('displayUsername').innerText = currentUser;
    document.getElementById('displayHandle').innerText = currentUser.toLowerCase().replace(/\s+/g, '');
    document.getElementById('userUploadCount').innerText = userUploadsCount;
    document.getElementById('userLikeCount').innerText = userLikesCount;
    document.getElementById('userFollowersCount').innerText = userFollowersCount;
    document.getElementById('userFollowingCount').innerText = userFollowingCount;
    
    renderUserTikTokGrid();
    document.getElementById('profileModal').style.display = 'flex';
}

function renderUserTikTokGrid() {
    const gridContainer = document.getElementById('userVideosGrid');
    gridContainer.innerHTML = "";

    if (userUploadedMediaArray.length === 0) {
        gridContainer.innerHTML = `<p class="no-videos-text">No videos uploaded yet!</p>`;
        return;
    }

    userUploadedMediaArray.forEach(media => {
        const gridItem = document.createElement('div');
        gridItem.classList.add('tiktok-grid-item');
        if (media.type.startsWith('video')) {
            gridItem.innerHTML = `<video src="${media.url}" autoplay muted loop playsinline></video>`;
        } else {
            gridItem.innerHTML = `<img src="${media.url}" alt="Video">`;
        }
        gridContainer.appendChild(gridItem);
    });
}

function openAdminModal() {
    document.getElementById('adminModal').style.display = 'flex';
}

function closeModals() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('profileModal').style.display = 'none';
    document.getElementById('adminModal').style.display = 'none';
    document.getElementById('uploadModal').style.display = 'none';
}

function switchTab(tabName) {
    const feedContainer = document.getElementById('feedContainer');
    const friendsContainer = document.getElementById('friendsContainer');
    const categorySection = document.getElementById('categorySection');
    const navHome = document.getElementById('navHome');
    const navFriends = document.getElementById('navFriends');

    if (tabName === 'home') {
        feedContainer.style.display = 'grid';
        friendsContainer.style.display = 'none';
        categorySection.style.display = 'block';
        navHome.classList.add('active');
        navFriends.classList.remove('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tabName === 'friends') {
        feedContainer.style.display = 'none';
        friendsContainer.style.display = 'grid';
        categorySection.style.display = 'none';
        navFriends.classList.add('active');
        navHome.classList.remove('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function executeUploadProcess() {
    const fileInput = document.getElementById('mediaFile');
    const categorySelect = document.getElementById('mediaCategory');
    const feedContainer = document.getElementById('feedContainer');
    const loader = document.getElementById('loadingSpinner');
    const progressBarFill = document.getElementById('progressBarFill');
    const progressPercent = document.getElementById('progressPercent');

    if (fileInput.files.length === 0) {
        alert("Please select a 3D media file first!");
        return;
    }

    closeModals();
    loader.style.display = "flex";
    let progress = 0;

    let interval = setInterval(() => {
        progress += 10;
        progressBarFill.style.width = progress + "%";
        progressPercent.innerText = progress + "%";

        if (progress >= 100) {
            clearInterval(interval);
            
            setTimeout(() => {
                userUploadsCount++;
                const file = fileInput.files[0];
                const category = categorySelect.value;
                const fileURL = URL.createObjectURL(file);

                userUploadedMediaArray.push({
                    url: fileURL,
                    type: file.type
                });

                const card = document.createElement('div');
                card.classList.add('card', 'luxury-3d-card');
                card.setAttribute('data-category', category);

                const mediaContent = file.type.startsWith('video') ? 
                    `<video src="${fileURL}" autoplay muted loop playsinline controls></video>` : 
                    `<img src="${fileURL}" alt="Uploaded 3D Image">`;

                card.innerHTML = `
                    <div class="media-box">
                        ${mediaContent}
                    </div>
                    <p class="card-title">${file.name} (${category}) - By @${currentUser.toLowerCase().replace(/\s+/g, '')}</p>
                    <div class="card-footer">
                        <button class="like-btn" onclick="toggleLike(this)">❤️ <span class="like-count">0</span></button>
                        <button class="share-btn" onclick="shareMedia()">🔗 Share</button>
                        <a href="${fileURL}" download="${file.name}" class="download-btn">Download</a>
                    </div>
                    <div class="comments-section">
                        <div class="comments-list"></div>
                        <div class="comment-input-box">
                            <input type="text" placeholder="Add a 3D comment..." class="comment-input">
                            <button onclick="addComment(this)" class="comment-submit-btn">Post</button>
                        </div>
                    </div>
                `;

                feedContainer.prepend(card);
                loader.style.display = "none";
                progressBarFill.style.width = "0%";
                progressPercent.innerText = "0%";
                fileInput.value = "";
            }, 300);
        }
    }, 150);
}

function userLogin() {
    const usernameInput = document.getElementById('loginUser').value.trim();
    if (usernameInput !== "") {
        currentUser = usernameInput;
        
        if (!registeredFriendsArray.includes(currentUser)) {
            registeredFriendsArray.push(currentUser);
            updateDynamicFriendsList();
        }

        alert("Successfully logged in as " + currentUser + "!");
        document.getElementById('profileNavBtn').style.display = 'inline-block';
        closeModals();
        document.getElementById('loginUser').value = "";
    } else {
        alert("Please enter a valid username!");
    }
}

function updateDynamicFriendsList() {
    const friendsListContainer = document.getElementById('dynamicFriendsList');
    friendsListContainer.innerHTML = "";

    if (registeredFriendsArray.length === 0) {
        friendsListContainer.innerHTML = `<p id="noFriendsText" style="text-align: center; color: #aaa; margin-top: 30px;">No friends added yet. Login as a new user to join!</p>`;
        return;
    }

    registeredFriendsArray.forEach((friendName, index) => {
        const friendCard = document.createElement('div');
        friendCard.classList.add('card', 'luxury-3d-card', 'friend-card');
        friendCard.innerHTML = `
            <div class="friend-user-info">
                <div class="friend-avatar">✨</div>
                <div>
                    <h4>${friendName}</h4>
                    <span class="friend-time">Active Member</span>
                </div>
            </div>
            <div class="media-box">
                <video src="sample.mp4" autoplay muted loop playsinline controls></video>
            </div>
            <p class="card-title">Welcome to ${friendName}'s 3D Space</p>
            <div class="card-footer">
                <button class="like-btn" onclick="toggleLike(this)">❤️ <span class="like-count">12</span></button>
                <button class="share-btn" onclick="shareMedia()">🔗 Share</button>
            </div>
        `;
        friendsListContainer.appendChild(friendCard);
    });
}

function userLogout() {
    currentUser = null;
    document.getElementById('profileNavBtn').style.display = 'none';
    closeModals();
    alert("Logged out successfully!");
}

function verifyAdmin() {
    const pass = document.getElementById('adminPassInput').value;
    if (pass === "zeb123") {
        document.getElementById('adminAuthSection').style.display = 'none';
        document.getElementById('adminControlSection').style.display = 'block';
        loadAdminMediaList();
    } else {
        alert("Incorrect Admin Secret Key!");
    }
}

function updateSiteLogo() {
    const newText = document.getElementById('newLogoInput').value.trim();
    if (newText !== "") {
        document.getElementById('mainSiteLogo').innerText = newText;
        localStorage.setItem('zebSiteTitle', newText);
        alert("Header title updated successfully!");
        document.getElementById('newLogoInput').value = "";
    } else {
        alert("Please enter title text!");
    }
}

function updateLogoImage() {
    const fileInput = document.getElementById('newLogoFile');
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const base64Image = e.target.result;
            document.getElementById('siteLogoImg').src = base64Image;
            localStorage.setItem('zebSiteLogo', base64Image); // Save permanently
            alert("Profile logo image updated and saved permanently!");
            fileInput.value = "";
        };
        
        reader.readAsDataURL(file);
    } else {
        alert("Please select an image file first!");
    }
}

function loadAdminMediaList() {
    const adminMediaList = document.getElementById('adminMediaList');
    adminMediaList.innerHTML = "";
    
    const cards = document.querySelectorAll('.feed-container .card');
    cards.forEach((card, index) => {
        const title = card.querySelector('.card-title').innerText;
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('admin-item');
        itemDiv.innerHTML = `
            <span>${title}</span>
            <button class="delete-media-btn" onclick="deleteCard('${index}')">Delete</button>
        `;
        adminMediaList.appendChild(itemDiv);
    });
}

function deleteCard(index) {
    const cards = document.querySelectorAll('.feed-container .card');
    if(cards[index]) {
        cards[index].remove();
        loadAdminMediaList();
        alert("Media deleted by Admin successfully!");
    }
}

function toggleLike(button) {
    const countSpan = button.querySelector('.like-count');
    let count = parseInt(countSpan.innerText);
    
    if (button.classList.contains('liked')) {
        count -= 1;
        button.classList.remove('liked');
    } else {
        count += 1;
        button.classList.add('liked');
        userLikesCount++;
    }
    countSpan.innerText = count;
}

function shareMedia() {
    if (navigator.share) {
        navigator.share({
            title: 'Zeb 3D Luxury Hub',
            text: 'Check out this stunning 3D design!',
            url: window.location.href,
        }).catch(() => {});
    } else {
        alert("3D Link copied to clipboard!");
    }
}

function addComment(button) {
    const commentBox = button.previousElementSibling;
    const commentText = commentBox.value.trim();
    
    if (commentText === "") return;

    const commentsList = button.closest('.comments-section').querySelector('.comments-list');
    const commentItem = document.createElement('div');
    commentItem.classList.add('comment-item');
    commentItem.innerText = commentText;

    commentsList.appendChild(commentItem);
    commentBox.value = "";
}

function filterCategory(category) {
    const cards = document.querySelectorAll('#feedContainer .card');
    const buttons = document.querySelectorAll('.cat-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

function searchMedia() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        let text = card.innerText.toLowerCase();
        if (text.includes(input)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function focusSearch() {
    document.getElementById('searchInput').focus();
}
