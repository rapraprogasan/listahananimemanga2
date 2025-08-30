// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading screen
    setTimeout(function() {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('mainContent').classList.remove('hidden');
    }, 2000);
    
    // Load stats
    updateStats();
    
    // Load recently added items
    loadRecentItems();
    
    // Setup search functionality
    document.getElementById('searchInput').addEventListener('input', function() {
        searchAllItems(this.value);
    });
});

// Update statistics on the main page
function updateStats() {
    const anime = JSON.parse(localStorage.getItem('animeList')) || [];
    const manga = JSON.parse(localStorage.getItem('mangaList')) || [];
    const manhwa = JSON.parse(localStorage.getItem('manhwaList')) || [];
    
    document.getElementById('animeCount').textContent = anime.length;
    document.getElementById('mangaCount').textContent = manga.length;
    document.getElementById('manhwaCount').textContent = manhwa.length;
}

// Load recently added items from all categories
function loadRecentItems() {
    const anime = JSON.parse(localStorage.getItem('animeList')) || [];
    const manga = JSON.parse(localStorage.getItem('mangaList')) || [];
    const manhwa = JSON.parse(localStorage.getItem('manhwaList')) || [];
    
    // Combine all items and sort by date added (newest first)
    const allItems = [...anime, ...manga, ...manhwa]
        .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        .slice(0, 6); // Get the 6 most recent items
    
    const container = document.getElementById('recentItems');
    container.innerHTML = '';
    
    if (allItems.length === 0) {
        container.innerHTML = '<p class="no-items">No items added yet. Start by adding some anime, manga, or manhwa!</p>';
        return;
    }
    
    allItems.forEach(item => {
        const card = createItemCard(item, item.type);
        container.appendChild(card);
    });
}

// Create an item card for display
function createItemCard(item, type) {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    const statusClass = `status-${item.status}`;
    
    card.innerHTML = `
        <div class="item-image" data-video="${item.videoUrl || ''}">
            <img src="${item.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${item.title}">
            ${item.videoUrl ? '<div class="play-button"><i class="fas fa-play"></i></div>' : ''}
        </div>
        <div class="item-content">
            <h3 class="item-title">${item.title}</h3>
            <span class="item-status ${statusClass}">${formatStatus(item.status)}</span>
            <div class="item-meta">
                <span>${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                ${item.rating ? `<span><i class="fas fa-star"></i> ${item.rating}</span>` : ''}
            </div>
            ${item.notes ? `<p class="item-notes">${item.notes}</p>` : ''}
            <div class="item-actions">
                <button class="btn-link" onclick="window.open('${item.link || '#'}', '_blank')">
                    <i class="fas fa-external-link-alt"></i> Link
                </button>
            </div>
        </div>
    `;
    
    // Add click event for video playback
    if (item.videoUrl) {
        const imageDiv = card.querySelector('.item-image');
        imageDiv.addEventListener('click', function() {
            playVideo(this.dataset.video);
        });
    }
    
    return card;
}

// Format status for display
function formatStatus(status) {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Play video in modal
function playVideo(videoUrl) {
    if (!videoUrl) return;
    
    const videoId = extractYoutubeId(videoUrl);
    if (!videoId) return;
    
    const videoModal = document.getElementById('videoModal');
    const videoContainer = document.getElementById('videoContainer');
    
    videoContainer.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
        </iframe>
    `;
    
    videoModal.style.display = 'block';
    
    // Close modal when clicking the X
    document.querySelector('.video-close').addEventListener('click', function() {
        videoModal.style.display = 'none';
        videoContainer.innerHTML = '';
    });
    
    // Close modal when clicking outside
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
            videoContainer.innerHTML = '';
        }
    });
}

// Extract YouTube ID from URL
function extractYoutubeId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
}

// Search across all items
function searchAllItems(query) {
    if (!query) {
        loadRecentItems();
        return;
    }
    
    const anime = JSON.parse(localStorage.getItem('animeList')) || [];
    const manga = JSON.parse(localStorage.getItem('mangaList')) || [];
    const manhwa = JSON.parse(localStorage.getItem('manhwaList')) || [];
    
    // Add type property to each item
    const allItems = [
        ...anime.map(item => ({...item, type: 'anime'})),
        ...manga.map(item => ({...item, type: 'manga'})),
        ...manhwa.map(item => ({...item, type: 'manhwa'}))
    ];
    
    // Filter items by query
    const filteredItems = allItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
    );
    
    const container = document.getElementById('recentItems');
    container.innerHTML = '';
    
    if (filteredItems.length === 0) {
        container.innerHTML = '<p class="no-items">No items found matching your search.</p>';
        return;
    }
    
    filteredItems.forEach(item => {
        const card = createItemCard(item, item.type);
        container.appendChild(card);
    });
}