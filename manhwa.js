// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading screen
    setTimeout(function() {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(function() {
            document.getElementById('loading-screen').style.display = 'none';
        }, 500);
    }, 2000);
    
    // Initialize manhwa list from localStorage
    let manhwaList = JSON.parse(localStorage.getItem('manhwaList')) || [];
    
    // DOM Elements
    const addManhwaBtn = document.getElementById('add-manhwa-btn');
    const addModal = document.getElementById('add-modal');
    const videoModal = document.getElementById('video-modal');
    const closeModalButtons = document.querySelectorAll('.close');
    const manhwaForm = document.getElementById('manhwa-form');
    const manhwaListContainer = document.getElementById('manhwa-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('global-search');
    
    // Show add modal
    addManhwaBtn.addEventListener('click', function() {
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
    
    // Add new manhwa
    manhwaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newManhwa = {
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
        
        manhwaList.push(newManhwa);
        saveManhwaList();
        
        // Update the counts on the main page
        if (window.opener) {
            window.opener.updateTitleCounts();
        }
        
        renderManhwaList();
        manhwaForm.reset();
        addModal.style.display = 'none';
        
        alert('Manhwa added successfully!');
    });
    
    // Filter manhwa
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            renderManhwaList(filter);
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredManhwa = manhwaList.filter(manhwa => 
            manhwa.title.toLowerCase().includes(searchTerm)
        );
        renderFilteredManhwaList(filteredManhwa);
    });
    
    // Save manhwa list to localStorage
    function saveManhwaList() {
        localStorage.setItem('manhwaList', JSON.stringify(manhwaList));
    }
    
    // Render manhwa list
    function renderManhwaList(filter = 'all') {
        let filteredManhwa = manhwaList;
        
        if (filter !== 'all') {
            filteredManhwa = manhwaList.filter(manhwa => manhwa.status === filter);
        }
        
        renderFilteredManhwaList(filteredManhwa);
    }
    
    // Render filtered manhwa list
    function renderFilteredManhwaList(list) {
        manhwaListContainer.innerHTML = '';
        
        if (list.length === 0) {
            manhwaListContainer.innerHTML = '<p class="no-items">No manhwa found. Add some to your list!</p>';
            return;
        }
        
        list.forEach(manhwa => {
            const manhwaCard = document.createElement('div');
            manhwaCard.className = 'item-card';
            manhwaCard.innerHTML = `
                <div class="item-image">
                    <img src="${manhwa.image}" alt="${manhwa.title}">
                    <div class="play-overlay">
                        <div class="play-btn" data-video="${manhwa.video}">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                </div>
                <div class="item-details">
                    <h3 class="item-title">${manhwa.title}</h3>
                    <span class="item-status status-${manhwa.status}">${formatStatus(manhwa.status)}</span>
                    <p class="item-notes">${manhwa.notes || 'No notes added.'}</p>
                    <div class="item-actions">
                        <a href="${manhwa.link}" target="_blank" class="action-btn link-btn"><i class="fas fa-external-link-alt"></i> Visit</a>
                        <button class="action-btn edit-btn" data-id="${manhwa.id}"><i class="fas fa-edit"></i> Edit</button>
                        <button class="action-btn delete-btn" data-id="${manhwa.id}"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>
            `;
            
            manhwaListContainer.appendChild(manhwaCard);
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
                if (confirm('Are you sure you want to delete this manhwa?')) {
                    manhwaList = manhwaList.filter(manhwa => manhwa.id !== id);
                    saveManhwaList();
                    
                    // Update the counts on the main page
                    if (window.opener) {
                        window.opener.updateTitleCounts();
                    }
                    
                    renderManhwaList();
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
    renderManhwaList();
});