// Main JavaScript functionality for Loveria Dating App

// DOM Content Loaded Handler
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
async function initializeApp() {
    setupMobileMenu();
    setupNavigation();
    addCardHoverEffects();
    
    // Check authentication status
    try {
        await checkAuthenticationStatus();
    } catch (error) {
        console.error('Authentication check failed:', error);
        updateUIForGuestUser();
    }
}

// Check if user is authenticated (Static version)
async function checkAuthenticationStatus() {
    try {
        // For static demo, assume user is logged in for inner pages
        const currentPage = window.location.pathname;
        const isInnerPage = currentPage.includes('home.html') || 
                           currentPage.includes('discover.html') || 
                           currentPage.includes('swipe.html') || 
                           currentPage.includes('messages.html') || 
                           currentPage.includes('profile.html') || 
                           currentPage.includes('settings.html');
        
        if (isInnerPage) {
            updateUIForAuthenticatedUser({
                name: 'John Doe',
                email: 'john.doe@example.com'
            });
        } else {
            updateUIForGuestUser();
        }
    } catch (error) {
        console.error('Auth check error:', error);
        updateUIForGuestUser();
    }
}

// Mobile menu functionality
function setupMobileMenu() {
    const mobileMenuButton = document.querySelector('.md\\:hidden button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

// Setup navigation handlers
function setupNavigation() {
    // Update main CTA button
    const joinButton = document.querySelector('.btn-primary');
    if (joinButton && joinButton.textContent.includes('Join Loveria')) {
        joinButton.onclick = () => window.location.href = '/loveria/src/auth/signup.php';
    }
    
    // Handle logout buttons
    const logoutButtons = document.querySelectorAll('[data-action="logout"]');
    logoutButtons.forEach(button => {
        button.addEventListener('click', handleLogout);
    });
}

// Handle user logout
async function handleLogout() {
    try {
        const response = await fetch('/loveria/src/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: 'include',
            body: 'action=logout'
        });
        
        if (response.ok) {
            window.location.href = '/loveria/index.php';
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Update UI for authenticated users
function updateUIForAuthenticatedUser(user) {
    // Update navigation to show user menu
    const nav = document.querySelector('nav');
    if (nav) {
        const userMenu = nav.querySelector('.user-menu');
        if (userMenu) {
            userMenu.style.display = 'block';
        }
        
        const guestMenu = nav.querySelector('.guest-menu');
        if (guestMenu) {
            guestMenu.style.display = 'none';
        }
    }
    
    // Update any user-specific elements
    const userNameElements = document.querySelectorAll('[data-user-name]');
    userNameElements.forEach(element => {
        element.textContent = user.first_name;
    });
}

// Update UI for guest users
function updateUIForGuestUser() {
    // Update navigation to show guest menu
    const nav = document.querySelector('nav');
    if (nav) {
        const userMenu = nav.querySelector('.user-menu');
        if (userMenu) {
            userMenu.style.display = 'none';
        }
        
        const guestMenu = nav.querySelector('.guest-menu');
        if (guestMenu) {
            guestMenu.style.display = 'block';
        }
    }
}

// Add card hover effects
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Form validation helpers
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function validateAge(age) {
    return age >= 18 && age <= 100;
}

// Show notification helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 border-2 border-black font-bold text-white max-w-sm ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Photo upload helper
function handlePhotoUpload(inputElement, previewElement) {
    inputElement.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                showNotification('Please select a valid image file (JPEG, PNG, or GIF)', 'error');
                return;
            }
            
            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                showNotification('File size must be less than 5MB', 'error');
                return;
            }
            
            // Preview the image
            const reader = new FileReader();
            reader.onload = function(e) {
                if (previewElement) {
                    previewElement.src = e.target.result;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// Initialize photo upload handlers
function initializePhotoUpload() {
    const photoInput = document.querySelector('#photo-upload');
    const photoPreview = document.querySelector('#photo-preview');
    
    if (photoInput && photoPreview) {
        handlePhotoUpload(photoInput, photoPreview);
    }
}

// Call photo upload initialization after DOM is loaded
document.addEventListener('DOMContentLoaded', initializePhotoUpload);

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An unexpected error occurred', 'error');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('An unexpected error occurred', 'error');
});