// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading
    setTimeout(function() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('main-content').classList.remove('hidden');
    }, 2000);
    
    // Initialize manhwa items
    loadManhwaItems();
    
    // Set up event listeners
    document.getElementById('search-input').addEventListener('input', searchItems);
    document.getElementById('search-btn').addEventListener('click', searchItems);
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', filterItems);
    });
    
    // Modal functionality
    const modal = document.getElementById('add-modal');
    const addForm = document.getElementById('add-form');
    const closeModal = document.querySelector('.close');
    const addButton = document.getElementById('add-new-btn');
    
    // Open modal
    addButton.addEventListener('click', function() {
        modal.style.display = 'block';
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle form submission
    addForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewItem();
    });
    
    // Video modal functionality
    const videoModal = document.getElementById('video-modal');
    const videoClose = videoModal.querySelector('.close');
    
    videoClose.addEventListener('click', function() {
        videoModal.style.display = 'none';
        document.getElementById('video-player').innerHTML = '';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target == videoModal) {
            videoModal.style.display = 'none';
            document.getElementById('video-player').innerHTML = '';
        }
    });
});

// Load manhwa items from localStorage
function loadManhwaItems() {
    let items = JSON.parse(localStorage.getItem('animeItems')) || [];
    const contentGrid = document.getElementById('content-grid');
    
    // Filter only manhwa items
    const manhwaItems = items.filter(item => item.type === 'manhwa');
    
    // Clear existing content
    contentGrid.innerHTML = '';
    
    if (manhwaItems.length === 0) {
        contentGrid.innerHTML = `
            <div class="no-items">
                <i class="fas fa-scroll"></i>
                <h3>No manhwa yet</h3>
                <p>Add your first manhwa to get started!</p>
            </div>
        `;
        return;
    }
    
    // Render manhwa items
    manhwaItems.forEach(item => {
        const badgeClass = getBadgeClass(item.status);
        const statusText = getStatusText(item.status);
        
        const itemElement = document.createElement('div');
        itemElement.classList.add('item-card');
        itemElement.dataset.status = item.status;
        itemElement.dataset.type = item.type;
        
        itemElement.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.title}">
                ${item.video ? `<div class="play-button" data-video="${item.video}">
                    <i class="fas fa-play"></i>
                </div>` : ''}
                <span class="item-badge ${badgeClass}">${statusText}</span>
            </div>
            <div class="item-content">
                <h3 class="item-title">${item.title}</h3>
                ${item.notes ? `<p class="item-notes">${item.notes}</p>` : ''}
                <span class="item-type">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
            </div>
        `;
        
        // Add event listener for play button if video exists
        if (item.video) {
            const playButton = itemElement.querySelector('.play-button');
            playButton.addEventListener('click', function() {
                openVideoModal(this.dataset.video);
            });
        }
        
        contentGrid.appendChild(itemElement);
    });
}

// Get badge class based on status
function getBadgeClass(status) {
    switch(status) {
        case 'completed':
            return 'badge-completed';
        case 'currently-reading':
            return 'badge-watching';
        case 'dropped':
            return 'badge-dropped';
        case 'plan-to-read':
            return 'badge-plan';
        default:
            return 'badge-plan';
    }
}

// Get display text for status
function getStatusText(status) {
    switch(status) {
        case 'completed':
            return 'Completed';
        case 'currently-reading':
            return 'Reading';
        case 'dropped':
            return 'Dropped';
        case 'plan-to-read':
            return 'Plan to Read';
        default:
            return status;
    }
}

// Search functionality
function searchItems() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const items = document.querySelectorAll('.item-card');
    
    items.forEach(item => {
        const title = item.querySelector('.item-title').textContent.toLowerCase();
        const notes = item.querySelector('.item-notes') ? item.querySelector('.item-notes').textContent.toLowerCase() : '';
        
        if (title.includes(searchTerm) || notes.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Filter functionality
function filterItems() {
    const filter = this.dataset.filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    this.classList.add('active');
    
    const items = document.querySelectorAll('.item-card');
    
    items.forEach(item => {
        if (filter === 'all' || item.dataset.status === filter) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Add new manhwa item
function addNewItem() {
    const title = document.getElementById('title').value;
    const image = document.getElementById('image').value;
    const video = document.getElementById('video').value;
    const status = document.getElementById('status').value;
    const notes = document.getElementById('notes').value;
    
    // Create new item object
    const newItem = {
        id: Date.now(),
        type: 'manhwa',
        title,
        image,
        video,
        status,
        notes,
        dateAdded: new Date().toISOString()
    };
    
    // Get existing items from localStorage
    let items = JSON.parse(localStorage.getItem('animeItems')) || [];
    
    // Add new item
    items.push(newItem);
    
    // Save back to localStorage
    localStorage.setItem('animeItems', JSON.stringify(items));
    
    // Close modal and reset form
    document.getElementById('add-modal').style.display = 'none';
    document.getElementById('add-form').reset();
    
    // Reload items
    loadManhwaItems();
    
    // Show success message
    alert(`${title} has been added successfully!`);
}

// Open video modal
function openVideoModal(videoId) {
    const videoModal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('video-player');
    
    videoPlayer.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
        </iframe>
    `;
    
    videoModal.style.display = 'block';
}