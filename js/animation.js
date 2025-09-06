// ==========================================================================
// ANIMATION FUNCTIONS FOR DARNA FERME WEBSITE
// ==========================================================================

/**
 * Initialize all animations on the website
 */
function initAnimations() {
    animateOnScroll();
    initParallaxEffect();
    initCounterAnimation();
    initTypingEffect();
    initGalleryHoverEffect();
    initScrollProgress();
}

/**
 * Animation on scroll for elements
 */
function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.service-card, .product-card, .blog-post, .process-step, .team-member');
    
    // Set initial state for animated elements
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Check if element is in viewport
    const checkIfInView = () => {
        animatedElements.forEach(element => {
            const position = element.getBoundingClientRect();
            
            // If element is in viewport
            if (position.top < window.innerHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                
                // Add delay for staggered animation
                const index = Array.from(animatedElements).indexOf(element);
                element.style.transitionDelay = `${index * 0.1}s`;
            }
        });
    };
    
    // Listen for scroll events
    window.addEventListener('scroll', checkIfInView);
    // Initial check on page load
    window.addEventListener('load', checkIfInView);
}

/**
 * Parallax effect for hero section
 */
function initParallaxEffect() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        heroSection.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`;
    });
}

/**
 * Animated counter for statistics
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;
    
    let hasAnimated = false;
    
    const startCounter = () => {
        if (hasAnimated) return;
        
        const counterSection = document.querySelector('.counter-section');
        if (!counterSection) return;
        
        const position = counterSection.getBoundingClientRect();
        
        // If counter section is in viewport
        if (position.top < window.innerHeight - 100) {
            hasAnimated = true;
            
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
            });
        }
    };
    
    window.addEventListener('scroll', startCounter);
    window.addEventListener('load', startCounter);
}

/**
 * Typing effect for hero text
 */
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-effect');
    if (!typingElement) return;
    
    const texts = JSON.parse(typingElement.getAttribute('data-texts') || '[]');
    if (texts.length === 0) return;
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;
    let deletingDelay = 50;
    let pauseDelay = 2000;
    
    const type = () => {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            // Delete text
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = deletingDelay;
        } else {
            // Type text
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            // Pause at end of text
            isDeleting = true;
            typingDelay = pauseDelay;
        } else if (isDeleting && charIndex === 0) {
            // Move to next text
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingDelay = 500;
        }
        
        setTimeout(type, typingDelay);
    };
    
    // Start typing effect
    setTimeout(type, 1000);
}

/**
 * Hover effect for gallery items
 */
function initGalleryHoverEffect() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05)';
            item.style.zIndex = '10';
            item.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
            item.style.zIndex = '1';
            item.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });
}

/**
 * Scroll progress indicator
 */
function initScrollProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '4px';
    progressBar.style.backgroundColor = 'var(--accent)';
    progressBar.style.width = '0%';
    progressBar.style.zIndex = '10000';
    progressBar.style.transition = 'width 0.2s ease';
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollPosition = window.scrollY;
        const progress = (scrollPosition / documentHeight) * 100;
        
        progressBar.style.width = `${progress}%`;
    });
}

/**
 * Animated scroll to element
 */
function scrollToElement(elementId, offset = 70) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const elementPosition = element.offsetTop - offset;
    
    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
}

/**
 * Pulse animation for call-to-action buttons
 */
function initPulseAnimation() {
    const ctaButtons = document.querySelectorAll('.btn-pulse');
    
    ctaButtons.forEach(button => {
        setInterval(() => {
            button.classList.add('pulse');
            setTimeout(() => {
                button.classList.remove('pulse');
            }, 1000);
        }, 5000);
    });
}

/**
 * Lazy loading for images
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

/**
 * Initialize all animations when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
});

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initAnimations,
        animateOnScroll,
        initParallaxEffect,
        initCounterAnimation,
        initTypingEffect,
        scrollToElement
    };
}