// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load anime list
    loadAnimeList();
    
    // Setup search functionality
    document.getElementById('searchAnime').addEventListener('input', function() {
        filterAnimeList();
    });
    
    // Setup filter functionality
    document.getElementById('statusFilter').addEventListener('change', function() {
        filterAnimeList();
    });
    
    // Setup modal functionality
    const modal = document.getElementById('animeModal');
    const addBtn = document.getElementById('addAnimeBtn');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('animeForm');
    
    // Open modal for adding new anime
    addBtn.addEventListener('click', function() {
        document.getElementById('modalTitle').textContent = 'Add New Anime';
        form.reset();
        document.getElementById('animeId').value = '';
        modal.style.display = 'block';
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    cancelBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveAnime();
    });
});

// Load anime list from localStorage
function loadAnimeList() {
    const animeList = JSON.parse(localStorage.getItem('animeList')) || [];
    const container = document.getElementById('animeList');
    container.innerHTML = '';
    
    if (animeList.length === 0) {
        container.innerHTML = '<p class="no-items">No anime added yet. Click "Add New Anime" to get started!</p>';
        return;
    }
    
    animeList.forEach(anime => {
        const card = createAnimeCard(anime);
        container.appendChild(card);
    });
}

// Create anime card for display
function createAnimeCard(anime) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.id = anime.id;
    card.dataset.status = anime.status;
    
    const statusClass = `status-${anime.status}`;
    
    card.innerHTML = `
        <div class="item-image" data-video="${anime.videoUrl || ''}">
            <img src="${anime.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${anime.title}">
            ${anime.videoUrl ? '<div class="play-button"><i class="fas fa-play"></i></div>' : ''}
        </div>
        <div class="item-content">
            <h3 class="item-title">${anime.title}</h3>
            <span class="item-status ${statusClass}">${formatStatus(anime.status)}</span>
            <div class="item-meta">
                ${anime.episodes ? `<span>Ep: ${anime.episodes}</span>` : '<span>Ep: 0</span>'}
                ${anime.rating ? `<span><i class="fas fa-star"></i> ${anime.rating}</span>` : ''}
            </div>
            ${anime.notes ? `<p class="item-notes">${anime.notes}</p>` : ''}
            <div class="item-actions">
                <button class="btn-edit" onclick="editAnime('${anime.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete" onclick="deleteAnime('${anime.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
                ${anime.link ? `<button class="btn-link" onclick="window.open('${anime.link}', '_blank')">
                    <i class="fas fa-external-link-alt"></i> Link
                </button>` : ''}
            </div>
        </div>
    `;
    
    // Add click event for video playback
    if (anime.videoUrl) {
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

// Filter anime list based on search and status filter
function filterAnimeList() {
    const searchQuery = document.getElementById('searchAnime').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const animeList = JSON.parse(localStorage.getItem('animeList')) || [];
    const container = document.getElementById('animeList');
    
    container.innerHTML = '';
    
    const filteredAnime = animeList.filter(anime => {
        const matchesSearch = anime.title.toLowerCase().includes(searchQuery);
        const matchesStatus = statusFilter === 'all' || anime.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    if (filteredAnime.length === 0) {
        container.innerHTML = '<p class="no-items">No anime found matching your criteria.</p>';
        return;
    }
    
    filteredAnime.forEach(anime => {
        const card = createAnimeCard(anime);
        container.appendChild(card);
    });
}

// Save anime to localStorage
function saveAnime() {
    const id = document.getElementById('animeId').value;
    const title = document.getElementById('title').value;
    const imageUrl = document.getElementById('imageUrl').value;
    const status = document.getElementById('status').value;
    const episodes = document.getElementById('episodes').value;
    const rating = document.getElementById('rating').value;
    const notes = document.getElementById('notes').value;
    const link = document.getElementById('link').value;
    
    const animeList = JSON.parse(localStorage.getItem('animeList')) || [];
    
    if (id) {
        // Update existing anime
        const index = animeList.findIndex(anime => anime.id === id);
        if (index !== -1) {
            animeList[index] = {
                ...animeList[index],
                title,
                imageUrl,
                status,
                episodes,
                rating,
                notes,
                link
            };
        }
    } else {
        // Add new anime
        const newAnime = {
            id: Date.now().toString(),
            title,
            imageUrl,
            status,
            episodes,
            rating,
            notes,
            link,
            dateAdded: new Date().toISOString()
        };
        animeList.push(newAnime);
    }
    
    localStorage.setItem('animeList', JSON.stringify(animeList));
    document.getElementById('animeModal').style.display = 'none';
    loadAnimeList();
}

// Edit anime
function editAnime(id) {
    const animeList = JSON.parse(localStorage.getItem('animeList')) || [];
    const anime = animeList.find(item => item.id === id);
    
    if (anime) {
        document.getElementById('modalTitle').textContent = 'Edit Anime';
        document.getElementById('animeId').value = anime.id;
        document.getElementById('title').value = anime.title;
        document.getElementById('imageUrl').value = anime.imageUrl || '';
        document.getElementById('status').value = anime.status;
        document.getElementById('episodes').value = anime.episodes || '';
        document.getElementById('rating').value = anime.rating || '';
        document.getElementById('notes').value = anime.notes || '';
        document.getElementById('link').value = anime.link || '';
        
        document.getElementById('animeModal').style.display = 'block';
    }
}

// Delete anime
function deleteAnime(id) {
    if (confirm('Are you sure you want to delete this anime?')) {
        let animeList = JSON.parse(localStorage.getItem('animeList')) || [];
        animeList = animeList.filter(anime => anime.id !== id);
        localStorage.setItem('animeList', JSON.stringify(animeList));
        loadAnimeList();
    }
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