// ==========================================================================
// FORM VALIDATION FOR DARNA FERME WEBSITE
// ==========================================================================

/**
 * Initialize all form validations
 */
function initFormValidation() {
    validateContactForm();
    validateNewsletterForm();
    initFormInputEffects();
    initPasswordToggle();
}

/**
 * Validate contact form
 */
function validateContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(this)) {
            // Form is valid, proceed with submission
            showFormSuccess(this, 'Merci pour votre message ! Nous vous contacterons bientôt.');
        } else {
            // Form has errors
            showFormError(this, 'Veuillez corriger les erreurs dans le formulaire.');
        }
    });
    
    // Add real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

/**
 * Validate newsletter form
 */
function validateNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            if (validateEmail(emailInput.value)) {
                showFormSuccess(this, 'Merci pour votre inscription à notre newsletter !');
                this.reset();
            } else {
                showFieldError(emailInput, 'Veuillez entrer une adresse email valide.');
            }
        });
    });
}

/**
 * Validate entire form
 */
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Validate individual field
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || field.getAttribute('id');
    
    // Check if field is required
    if (field.hasAttribute('required') && value === '') {
        showFieldError(field, 'Ce champ est obligatoire.');
        return false;
    }
    
    // Validate based on field type
    switch (field.type) {
        case 'email':
            if (!validateEmail(value)) {
                showFieldError(field, 'Veuillez entrer une adresse email valide.');
                return false;
            }
            break;
            
        case 'tel':
            if (!validatePhone(value)) {
                showFieldError(field, 'Veuillez entrer un numéro de téléphone valide.');
                return false;
            }
            break;
            
        case 'url':
            if (!validateURL(value)) {
                showFieldError(field, 'Veuillez entrer une URL valide.');
                return false;
            }
            break;
            
        case 'checkbox':
            if (field.required && !field.checked) {
                showFieldError(field, 'Vous devez accepter cette condition.');
                return false;
            }
            break;
            
        case 'select-one':
            if (field.required && value === '') {
                showFieldError(field, 'Veuillez sélectionner une option.');
                return false;
            }
            break;
    }
    
    // Validate based on custom data attributes
    if (field.hasAttribute('data-min-length')) {
        const minLength = parseInt(field.getAttribute('data-min-length'));
        if (value.length < minLength) {
            showFieldError(field, `Ce champ doit contenir au moins ${minLength} caractères.`);
            return false;
        }
    }
    
    if (field.hasAttribute('data-max-length')) {
        const maxLength = parseInt(field.getAttribute('data-max-length'));
        if (value.length > maxLength) {
            showFieldError(field, `Ce champ ne peut pas dépasser ${maxLength} caractères.`);
            return false;
        }
    }
    
    if (field.hasAttribute('data-pattern')) {
        const pattern = new RegExp(field.getAttribute('data-pattern'));
        if (!pattern.test(value)) {
            showFieldError(field, 'Le format saisi est incorrect.');
            return false;
        }
    }
    
    // If all validations pass
    clearFieldError(field);
    return true;
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
function validatePhone(phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate URL format
 */
function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Show error message for a field
 */
function showFieldError(field, message) {
    // Remove any existing error
    clearFieldError(field);
    
    // Add error class to field
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '5px';
    
    // Insert error message after field
    field.parentNode.appendChild(errorElement);
    
    // Focus on field if it's not already focused
    if (document.activeElement !== field) {
        field.focus();
    }
}

/**
 * Clear error message for a field
 */
function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Show form success message
 */
function showFormSuccess(form, message) {
    // Remove any existing messages
    hideFormMessages(form);
    
    // Create success message element
    const successElement = document.createElement('div');
    successElement.className = 'form-message success';
    successElement.textContent = message;
    successElement.style.backgroundColor = '#d4edda';
    successElement.style.color = '#155724';
    successElement.style.padding = '12px';
    successElement.style.borderRadius = '4px';
    successElement.style.marginBottom = '20px';
    successElement.style.border = '1px solid #c3e6cb';
    
    // Insert message at the top of the form
    form.insertBefore(successElement, form.firstChild);
    
    // Reset form after success
    setTimeout(() => {
        form.reset();
        hideFormMessages(form);
    }, 5000);
}

/**
 * Show form error message
 */
function showFormError(form, message) {
    // Remove any existing messages
    hideFormMessages(form);
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'form-message error';
    errorElement.textContent = message;
    errorElement.style.backgroundColor = '#f8d7da';
    errorElement.style.color = '#721c24';
    errorElement.style.padding = '12px';
    errorElement.style.borderRadius = '4px';
    errorElement.style.marginBottom = '20px';
    errorElement.style.border = '1px solid #f5c6cb';
    
    // Insert message at the top of the form
    form.insertBefore(errorElement, form.firstChild);
    
    // Scroll to first error field
    const firstError = form.querySelector('.error');
    if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/**
 * Hide all form messages
 */
function hideFormMessages(form) {
    const messages = form.querySelectorAll('.form-message');
    messages.forEach(message => message.remove());
}

/**
 * Initialize input effects
 */
function initFormInputEffects() {
    const formInputs = document.querySelectorAll('input, textarea, select');
    
    formInputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        // Remove focus effect
        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on page load
        if (input.value !== '') {
            input.parentElement.classList.add('focused');
        }
    });
}

/**
 * Initialize password visibility toggle
 */
function initPasswordToggle() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const isPassword = passwordInput.type === 'password';
            
            passwordInput.type = isPassword ? 'text' : 'password';
            this.textContent = isPassword ? 'Masquer' : 'Afficher';
            this.setAttribute('aria-label', isPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
        });
    });
}

/**
 * Sanitize form input to prevent XSS
 */
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Initialize form validation when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initFormValidation();
});

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initFormValidation,
        validateForm,
        validateEmail,
        validatePhone,
        validateURL,
        showFieldError,
        clearFieldError
    };
}