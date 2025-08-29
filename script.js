// Local Storage Functions
function getItemsFromStorage() {
    const itemsJSON = localStorage.getItem('animeMemoriesItems');
    return itemsJSON ? JSON.parse(itemsJSON) : [];
}

function saveItemsToStorage(items) {
    localStorage.setItem('animeMemoriesItems', JSON.stringify(items));
}

// Sample data for demonstration (only used if no data in localStorage)
const sampleItems = [
    {
        id: 1,
        title: "Demon Slayer",
        type: "anime",
        status: "currently-watching",
        image: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
        videoId: "VQGCKyvzIM4",
        siteUrl: "https://www.crunchyroll.com/demon-slayer-kimetsu-no-yaiba",
        notes: "Great animation and fight scenes"
    },
    {
        id: 2,
        title: "Attack on Titan",
        type: "anime",
        status: "completed",
        image: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
        videoId: "M_U8D6WgtQY",
        siteUrl: "https://www.crunchyroll.com/attack-on-titan",
        notes: "Amazing story with many plot twists"
    },
    {
        id: 3,
        title: "Solo Leveling",
        type: "manhwa",
        status: "completed",
        image: "https://comicvine.gamespot.com/a/uploads/scale_small/6/67663/73832-80-786975-1-solo-leveling.jpg",
        videoId: "z8T6C2o1d0c",
        siteUrl: "https://www.webtoons.com/en/action/solo-leveling/list?title_no=2934",
        notes: "Best leveling system in manhwa"
    },
    {
        id: 4,
        title: "One Piece",
        type: "manga",
        status: "currently-watching",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        videoId: "S8_YwFLCh4U",
        siteUrl: "https://www.viz.com/shonenjump/chapters/one-piece",
        notes: "Long but worth it. Amazing world building"
    },
    {
        id: 5,
        title: "Jujutsu Kaisen",
        type: "anime",
        status: "plan-to-watch",
        image: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
        videoId: "xnY6_-6_8gA",
        siteUrl: "https://www.crunchyroll.com/jujutsu-kaisen",
        notes: "Heard good things about the animation"
    },
    {
        id: 6,
        title: "Berserk",
        type: "manga",
        status: "dropped",
        image: "https://cdn.myanimelist.net/images/manga/1/157897.jpg",
        videoId: "6lIqNjC1RKU",
        siteUrl: "https://www.darkhorse.com/Books/10-001/Berserk-Volume-1",
        notes: "Too dark for my taste"
    }
];

// Initialize items from localStorage or use sample data
let items = getItemsFromStorage();
if (items.length === 0) {
    items = sampleItems;
    saveItemsToStorage(items);
}

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const contentGrid = document.getElementById('content-grid');
const searchInput = document.getElementById('search-input');
const navLinks = document.querySelectorAll('.nav-menu a');
const itemModal = document.getElementById('item-modal');
const videoModal = document.getElementById('video-modal');
const itemForm = document.getElementById('item-form');
const closeButtons = document.querySelectorAll('.close');
const addNewBtn = document.getElementById('add-new-btn');
const modalTitle = document.getElementById('modal-title');
const itemIdInput = document.getElementById('item-id');

// Initialize the application
function init() {
    // Simulate loading delay
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
    
    // Load initial items
    renderItems(items);
    
    // Set up event listeners
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Navigation filtering
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.getAttribute('data-category');
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
            
            // Filter items
            filterItems(category);
        });
    });
    
    // Modal controls
    addNewBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Add New Item';
        itemForm.reset();
        itemIdInput.value = '';
        itemModal.style.display = 'block';
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            itemModal.style.display = 'none';
            videoModal.style.display = 'none';
            // Clear video player
            document.getElementById('video-player').innerHTML = '';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === itemModal) {
            itemModal.style.display = 'none';
        }
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
            // Clear video player
            document.getElementById('video-player').innerHTML = '';
        }
    });
    
    // Form submission
    itemForm.addEventListener('submit', handleSaveItem);
}

// Render items to the grid
function renderItems(itemsToRender) {
    contentGrid.innerHTML = '';
    
    if (itemsToRender.length === 0) {
        contentGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No items found</h3>
                <p>Try a different search or add a new item</p>
            </div>
        `;
        return;
    }
    
    itemsToRender.forEach(item => {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.innerHTML = `
            <div class="card-image">
                <img src="${item.image}" alt="${item.title}">
                ${item.videoId ? `
                <div class="play-button" data-video="${item.videoId}">
                    <i class="fas fa-play"></i>
                </div>
                ` : ''}
            </div>
            <div class="card-content">
                <span class="status-badge status-${item.status}">${formatStatus(item.status)}</span>
                <h3>${item.title}</h3>
                <p class="type">${capitalizeFirstLetter(item.type)}</p>
                ${item.notes ? `<p class="notes">${item.notes}</p>` : ''}
                <div class="card-actions">
                    <button class="card-btn edit" data-id="${item.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    ${item.siteUrl ? `
                    <a href="${item.siteUrl}" target="_blank" class="card-btn external">
                        <i class="fas fa-external-link-alt"></i> Visit Site
                    </a>
                    ` : ''}
                    <button class="card-btn delete" data-id="${item.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
        contentGrid.appendChild(card);
    });
    
    // Add event listeners to play buttons
    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const videoId = e.currentTarget.getAttribute('data-video');
            playVideo(videoId);
        });
    });
    
    // Add event listeners to edit buttons
    document.querySelectorAll('.card-btn.edit').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            editItem(id);
        });
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.card-btn.delete').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            deleteItem(id);
        });
    });
}

// Format status for display
function formatStatus(status) {
    return status.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Handle search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeCategory = document.querySelector('.nav-menu a.active').getAttribute('data-category');
    
    let filteredItems = items;
    
    // Apply category filter first
    if (activeCategory !== 'all') {
        if (activeCategory === 'manga' || activeCategory === 'manhwa') {
            filteredItems = items.filter(item => item.type === activeCategory);
        } else {
            filteredItems = items.filter(item => item.status === activeCategory);
        }
    }
    
    // Apply search filter
    if (searchTerm) {
        filteredItems = filteredItems.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            (item.notes && item.notes.toLowerCase().includes(searchTerm))
        );
    }
    
    renderItems(filteredItems);
}

// Filter items by category
function filterItems(category) {
    let filteredItems;
    
    if (category === 'all') {
        filteredItems = items;
    } else if (category === 'manga' || category === 'manhwa') {
        filteredItems = items.filter(item => item.type === category);
    } else {
        filteredItems = items.filter(item => item.status === category);
    }
    
    renderItems(filteredItems);
}

// Play video in modal
function playVideo(videoId) {
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

// Edit an item
function editItem(id) {
    const item = items.find(item => item.id === id);
    if (item) {
        modalTitle.textContent = 'Edit Item';
        document.getElementById('title').value = item.title;
        document.getElementById('type').value = item.type;
        document.getElementById('status').value = item.status;
        document.getElementById('image-url').value = item.image;
        document.getElementById('video-url').value = item.videoId || '';
        document.getElementById('site-url').value = item.siteUrl || '';
        document.getElementById('notes').value = item.notes || '';
        itemIdInput.value = item.id;
        itemModal.style.display = 'block';
    }
}

// Handle form submission for adding/editing item
function handleSaveItem(e) {
    e.preventDefault();
    
    const id = itemIdInput.value ? parseInt(itemIdInput.value) : Date.now();
    const title = document.getElementById('title').value;
    const type = document.getElementById('type').value;
    const status = document.getElementById('status').value;
    const image = document.getElementById('image-url').value;
    const videoId = document.getElementById('video-url').value;
    const siteUrl = document.getElementById('site-url').value;
    const notes = document.getElementById('notes').value;
    
    const newItem = {
        id,
        title,
        type,
        status,
        image,
        videoId,
        siteUrl,
        notes
    };
    
    if (itemIdInput.value) {
        // Update existing item
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = newItem;
        }
    } else {
        // Add new item
        items.push(newItem);
    }
    
    saveItemsToStorage(items);
    
    // Get current filter and search to maintain view
    const activeCategory = document.querySelector('.nav-menu a.active').getAttribute('data-category');
    const searchTerm = searchInput.value.toLowerCase();
    
    let filteredItems = items;
    
    // Apply category filter
    if (activeCategory !== 'all') {
        if (activeCategory === 'manga' || activeCategory === 'manhwa') {
            filteredItems = items.filter(item => item.type === activeCategory);
        } else {
            filteredItems = items.filter(item => item.status === activeCategory);
        }
    }
    
    // Apply search filter
    if (searchTerm) {
        filteredItems = filteredItems.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            (item.notes && item.notes.toLowerCase().includes(searchTerm))
        );
    }
    
    renderItems(filteredItems);
    
    // Reset form and close modal
    itemForm.reset();
    itemModal.style.display = 'none';
    
    // Show confirmation message
    alert(`${title} has been ${itemIdInput.value ? 'updated' : 'added'} successfully!`);
}

// Delete an item
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        items = items.filter(item => item.id !== id);
        saveItemsToStorage(items);
        
        // Get current filter and search to maintain view
        const activeCategory = document.querySelector('.nav-menu a.active').getAttribute('data-category');
        const searchTerm = searchInput.value.toLowerCase();
        
        let filteredItems = items;
        
        // Apply category filter
        if (activeCategory !== 'all') {
            if (activeCategory === 'manga' || activeCategory === 'manhwa') {
                filteredItems = items.filter(item => item.type === activeCategory);
            } else {
                filteredItems = items.filter(item => item.status === activeCategory);
            }
        }
        
        // Apply search filter
        if (searchTerm) {
            filteredItems = filteredItems.filter(item => 
                item.title.toLowerCase().includes(searchTerm) ||
                (item.notes && item.notes.toLowerCase().includes(searchTerm))
            );
        }
        
        renderItems(filteredItems);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);