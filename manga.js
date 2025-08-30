// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading screen
    setTimeout(function() {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(function() {
            document.getElementById('loading-screen').style.display = 'none';
        }, 500);
    }, 2000);
    
    // Initialize manga list from localStorage
    let mangaList = JSON.parse(localStorage.getItem('mangaList')) || [];
    
    // DOM Elements
    const addMangaBtn = document.getElementById('add-manga-btn');
    const addModal = document.getElementById('add-modal');
    const videoModal = document.getElementById('video-modal');
    const closeModalButtons = document.querySelectorAll('.close');
    const mangaForm = document.getElementById('manga-form');
    const mangaListContainer = document.getElementById('manga-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('global-search');
    
    // Show add modal
    addMangaBtn.addEventListener('click', function() {
        addModal.style.display = 'flex';
    });
    
    // Close modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            addModal.style.display = 'none';
            videoModal.style.display = 'none';
            document.getElementById('video-container').innerHTML = '';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === addModal) {
            addModal.style.display = 'none';
        }
        if (event.target === videoModal) {
            videoModal.style.display = 'none';
            document.getElementById('video-container').innerHTML = '';
        }
    });
    
    // Add new manga
    mangaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newManga = {
            id: Date.now(),
            title: document.getElementById('title').value,
            image: document.getElementById('image').value || 'https://via.placeholder.com/300x200?text=No+Image',
            status: document.getElementById('status').value,
            rating: document.getElementById('rating').value,
            chapters: document.getElementById('chapters').value,
            notes: document.getElementById('notes').value,
            link: document.getElementById('link').value,
            video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Example video
        };
        
        mangaList.push(newManga);
        saveMangaList();
        
        // Update the counts on the main page
        if (window.opener) {
            window.opener.updateTitleCounts();
        }
        
        renderMangaList();
        mangaForm.reset();
        addModal.style.display = 'none';
        
        alert('Manga added successfully!');
    });
    
    // Filter manga
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            renderMangaList(filter);
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredManga = mangaList.filter(manga => 
            manga.title.toLowerCase().includes(searchTerm)
        );
        renderFilteredMangaList(filteredManga);
    });
    
    // Save manga list to localStorage
    function saveMangaList() {
        localStorage.setItem('mangaList', JSON.stringify(mangaList));
    }
    
    // Render manga list
    function renderMangaList(filter = 'all') {
        let filteredManga = mangaList;
        
        if (filter !== 'all') {
            filteredManga = mangaList.filter(manga => manga.status === filter);
        }
        
        renderFilteredMangaList(filteredManga);
    }
    
    // Render filtered manga list
    function renderFilteredMangaList(list) {
        mangaListContainer.innerHTML = '';
        
        if (list.length === 0) {
            mangaListContainer.innerHTML = '<p class="no-items">No manga found. Add some to your list!</p>';
            return;
        }
        
        list.forEach(manga => {
            const mangaCard = document.createElement('div');
            mangaCard.className = 'item-card';
            mangaCard.innerHTML = `
                <div class="item-image">
                    <img src="${manga.image}" alt="${manga.title}">
                    <div class="play-overlay">
                        <div class="play-btn" data-video="${manga.video}">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                </div>
                <div class="item-details">
                    <h3 class="item-title">${manga.title}</h3>
                    <span class="item-status status-${manga.status}">${formatStatus(manga.status)}</span>
                    <p class="item-notes">${manga.notes || 'No notes added.'}</p>
                    <div class="item-actions">
                        <a href="${manga.link}" target="_blank" class="action-btn link-btn"><i class="fas fa-external-link-alt"></i> Visit</a>
                        <button class="action-btn edit-btn" data-id="${manga.id}"><i class="fas fa-edit"></i> Edit</button>
                        <button class="action-btn delete-btn" data-id="${manga.id}"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>
            `;
            
            mangaListContainer.appendChild(mangaCard);
        });
        
        // Add event listeners for play buttons
        document.querySelectorAll('.play-btn').forEach(button => {
            button.addEventListener('click', function() {
                const videoUrl = this.getAttribute('data-video');
                document.getElementById('video-container').innerHTML = `
                    <iframe src="${videoUrl}" frameborder="0" allowfullscreen></iframe>
                `;
                videoModal.style.display = 'flex';
            });
        });
        
        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                if (confirm('Are you sure you want to delete this manga?')) {
                    mangaList = mangaList.filter(manga => manga.id !== id);
                    saveMangaList();
                    
                    // Update the counts on the main page
                    if (window.opener) {
                        window.opener.updateTitleCounts();
                    }
                    
                    renderMangaList();
                }
            });
        });
        
        // Add event listeners for edit buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                // Implementation for edit functionality would go here
                alert('Edit functionality would be implemented here.');
            });
        });
    }
    
    // Format status for display
    function formatStatus(status) {
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    
    // Initial render
    renderMangaList();
});