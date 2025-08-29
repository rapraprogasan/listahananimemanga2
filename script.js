// Sample data for demonstration
let items = [
    {
        id: 1,
        title: "Demon Slayer",
        type: "anime",
        status: "completed",
        imageUrl: "https://images.unsplash.com/photo-1633328567998-5bf2f5aaddc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80",
        videoUrl: "VQGCKyvzIM4",
        notes: "Amazing animation and fight scenes"
    },
    {
        id: 2,
        title: "One Piece",
        type: "manga",
        status: "watching",
        imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
        videoUrl: "S8_YwFLCh4U",
        notes: "Long but worth it. Currently at chapter 1050"
    },
    {
        id: 3,
        title: "Solo Leveling",
        type: "manhwa",
        status: "completed",
        imageUrl: "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1250&q=80",
        videoUrl: "Gz2TlQCQ0AY",
        notes: "Best level-up story I've ever read"
    },
    {
        id: 4,
        title: "Attack on Titan",
        type: "anime",
        status: "completed",
        imageUrl: "https://images.unsplash.com/photo-1642618215095-07e2d7b53e3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
        videoUrl: "M_U8D6WgtQY",
        notes: "Masterpiece with deep philosophical themes"
    },
    {
        id: 5,
        title: "My Hero Academia",
        type: "anime",
        status: "watching",
        imageUrl: "https://images.unsplash.com/photo-1633356122542-f2a5c0f834ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        videoUrl: "apocM5RBeho",
        notes: "Waiting for new season"
    },
    {
        id: 6,
        title: "Berserk",
        type: "manga",
        status: "dropped",
        imageUrl: "https://images.unsplash.com/photo-1594818379496-da70a4982b59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
        videoUrl: "6JnFsl2FFSk",
        notes: "Too dark for my taste"
    }
];

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const itemsGrid = document.getElementById('items-grid');
const categoryTitle = document.getElementById('category-title');
const searchInput = document.getElementById('search-input');
const addItemForm = document.getElementById('add-item-form');
const itemForm = document.getElementById('item-form');
const cancelAddBtn = document.getElementById('cancel-add');
const addNewBtn = document.getElementById('add-new-btn');
const videoModal = document.getElementById('video-modal');
const videoContainer = document.getElementById('video-container');
const closeModal = document.querySelector('.close-modal');
const navLinks = document.querySelectorAll('nav a');

// Current filter state
let currentCategory = 'all';
let searchQuery = '';

// Initialize the application
function init() {
    // Simulate loading
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 500);
    }, 1500);
    
    // Render initial items
    renderItems();
    
    // Set up event listeners
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Update current category and re-render
            currentCategory = category;
            categoryTitle.textContent = getCategoryTitle(category);
            renderItems();
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderItems();
    });
    
    // Add new item form
    addNewBtn.addEventListener('click', () => {
        addItemForm.classList.remove('hidden');
        itemsGrid.classList.add('hidden');
    });
    
    cancelAddBtn.addEventListener('click', () => {
        addItemForm.classList.add('hidden');
        itemsGrid.classList.remove('hidden');
        itemForm.reset();
    });
    
    itemForm.addEventListener('submit', handleAddItem);
    
    // Video modal
    closeModal.addEventListener('click', () => {
        videoModal.classList.add('hidden');
        videoContainer.innerHTML = '';
    });
    
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            videoModal.classList.add('hidden');
            videoContainer.innerHTML = '';
        }
    });
}

// Handle form submission for adding new item
function handleAddItem(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const type = document.getElementById('type').value;
    const status = document.getElementById('status').value;
    const imageUrl = document.getElementById('image-url').value;
    const videoUrl = document.getElementById('video-url').value;
    const notes = document.getElementById('notes').value;
    
    // Create new item
    const newItem = {
        id: Date.now(), // Simple ID generation
        title,
        type,
        status,
        imageUrl,
        videoUrl,
        notes
    };
    
    // Add to items array
    items.push(newItem);
    
    // Reset form and show items grid
    itemForm.reset();
    addItemForm.classList.add('hidden');
    itemsGrid.classList.remove('hidden');
    
    // Re-render items
    renderItems();
}

// Render items based on current filter and search
function renderItems() {
    // Clear current items
    itemsGrid.innerHTML = '';
    
    // Filter items based on category and search query
    const filteredItems = items.filter(item => {
        const matchesCategory = currentCategory === 'all' || 
                               (currentCategory === 'manga' && item.type === 'manga') ||
                               item.status === currentCategory;
        
        const matchesSearch = item.title.toLowerCase().includes(searchQuery) ||
                             item.notes.toLowerCase().includes(searchQuery);
        
        return matchesCategory && matchesSearch;
    });
    
    // Display message if no items found
    if (filteredItems.length === 0) {
        itemsGrid.innerHTML = `
            <div class="no-items">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3>No items found</h3>
                <p>Try changing your search or add a new item</p>
            </div>
        `;
        return;
    }
    
    // Create item cards
    filteredItems.forEach(item => {
        const itemCard = createItemCard(item);
        itemsGrid.appendChild(itemCard);
    });
}

// Create HTML for an item card
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
        <div class="item-image" data-video="${item.videoUrl}">
            <img src="${item.imageUrl}" alt="${item.title}">
            ${item.videoUrl ? `<div class="play-button"><i class="fas fa-play"></i></div>` : ''}
        </div>
        <div class="item-info">
            <h3 class="item-title">${item.title}</h3>
            <span class="item-type type-${item.type}">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
            <div class="item-status">
                <span class="status-badge status-${item.status}">${getStatusText(item.status)}</span>
            </div>
            ${item.notes ? `<p class="item-notes">${item.notes}</p>` : ''}
        </div>
    `;
    
    // Add click event for video playback if video exists
    if (item.videoUrl) {
        const imageElement = card.querySelector('.item-image');
        imageElement.addEventListener('click', () => {
            videoContainer.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${item.videoUrl}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;
            videoModal.classList.remove('hidden');
        });
    }
    
    return card;
}

// Helper function to get category title text
function getCategoryTitle(category) {
    switch(category) {
        case 'all': return 'All Items';
        case 'watching': return 'Currently Watching';
        case 'completed': return 'Completed';
        case 'dropped': return 'Dropped';
        case 'plan-to-watch': return 'Plan to Watch';
        case 'manga': return 'Manga & Manhwa';
        default: return 'All Items';
    }
}

// Helper function to get status text
function getStatusText(status) {
    switch(status) {
        case 'watching': return 'Watching';
        case 'completed': return 'Completed';
        case 'dropped': return 'Dropped';
        case 'plan-to-watch': return 'Plan to Watch';
        default: return status;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);