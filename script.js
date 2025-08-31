// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading screen
    setTimeout(function() {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(function() {
            document.getElementById('loading-screen').style.display = 'none';
        }, 500);
    }, 2000);
    
    // Search functionality
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            // This would filter items in a real implementation
            console.log('Searching for:', searchTerm);
        });
    }
});
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading screen
    setTimeout(function() {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(function() {
            document.getElementById('loading-screen').style.display = 'none';
        }, 500);
    }, 2000);
    
    // Update title counts
    updateTitleCounts();
    
    // Search functionality
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            // This would filter items in a real implementation
            console.log('Searching for:', searchTerm);
        });
    }
});

// Function to update title counts
function updateTitleCounts() {
    // Get counts from localStorage
    const animeList = JSON.parse(localStorage.getItem('animeList')) || [];
    const mangaList = JSON.parse(localStorage.getItem('mangaList')) || [];
    const manhwaList = JSON.parse(localStorage.getItem('manhwaList')) || [];
    
    // Update the count elements
    document.getElementById('anime-count').textContent = animeList.length;
    document.getElementById('manga-count').textContent = mangaList.length;
    document.getElementById('manhwa-count').textContent = manhwaList.length;
}