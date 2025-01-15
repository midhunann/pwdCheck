
// Navigation
const homeLink = document.getElementById('homeLink');
const aboutLink = document.getElementById('aboutLink');
const mainContent = document.getElementById('mainContent');
const aboutContent = document.getElementById('aboutContent');

homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    mainContent.classList.remove('hidden');
    aboutContent.classList.add('hidden');
});

aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    mainContent.classList.add('hidden');
    aboutContent.classList.remove('hidden');
});

// Password input handling
const passwordInput = document.getElementById('passwordInput');
const togglePassword = document.getElementById('togglePassword');
const parameterList = document.getElementById('parameterList');
const scoreDisplay = document.getElementById('scoreDisplay');
const strengthBar = document.getElementById('strengthBar');
const crackTime = document.getElementById('crackTime');
const review = document.getElementById('review');
const generateButton = document.getElementById('generateButton');
const copyButton = document.getElementById('copyButton');
const generatedPassword = document.getElementById('generatedPassword');
const passwordOutput = document.getElementById('passwordOutput');

// Toggle password visibility
togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePassword.textContent = type === 'password' ? '👁️' : '🔒';
});

// Password strength calculation
const calculateEntropy = (password) => {
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[^A-Za-z0-9]/.test(password)) charsetSize += 33;
    
    return Math.log2(Math.pow(charsetSize, password.length));
};

const calculateCrackTime = (entropy) => {
    // Assuming 100 billion guesses per second (modern hardware)
    const guessesPerSecond = 100000000000;
    const possibleCombinations = Math.pow(2, entropy);
    const seconds = possibleCombinations / (guessesPerSecond * 2); // Average case is half of total combinations

    if (seconds < 1) return 'Instantly';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
    return `${Math.round(seconds / 31536000)} years`;
};

const getStrengthColor = (score) => {
    if (score < 20) return '#ff4444';
    if (score < 40) return '#ffa700';
    if (score < 60) return '#ffeb3b';
    if (score < 80) return '#00c853';
    return '#00e676';
};

const generateDetailedReview = (password, score, requirements) => {
    let review = '';
    
    if (score >= 80) {
        review = 'Excellent password! This password is very strong and would be extremely difficult to crack. It uses a good mix of characters and length.';
    } else if (score >= 60) {
        review = 'Good password, but could be stronger. Consider adding more special characters or increasing length for maximum security.';
    } else if (score >= 40) {
        review = 'Moderate password strength. ' + 
                (!requirements.special ? 'Adding special characters would help. ' : '') +
                (!requirements.number ? 'Including numbers would improve security. ' : '') +
                (password.length < 12 ? 'A longer password would be stronger. ' : '');
    } else if (score >= 20) {
        review = 'Weak password. This password could be compromised relatively quickly. Try making it longer and more complex.';
    } else {
        review = 'Very weak password! This password is easily guessable. Please use a combination of uppercase, lowercase, numbers, and special characters.';
    }

    // Add specific suggestions
    if (password.toLowerCase() === password) {
        review += ' Adding uppercase letters would increase strength.';
    }
    if (/^[a-zA-Z]+$/.test(password)) {
        review += ' Including numbers and special characters would make it much stronger.';
    }
    if (password.length < 12) {
        review += ' Consider using at least 12 characters for better security.';
    }

    return review;
};

// Check password strength
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };

    // Update requirement list with animation
    Object.entries(requirements).forEach(([req, met]) => {
        const li = parameterList.querySelector(`[data-requirement="${req}"]`);
        if (met && !li.classList.contains('met')) {
            li.style.animation = 'pulse 0.3s ease';
            setTimeout(() => li.style.animation = '', 300);
        }
        li.classList.toggle('met', met);
    });

    // Calculate entropy and score
    const entropy = calculateEntropy(password);
    const score = Math.min(100, Math.round((entropy / 128) * 100)); // 128-bit entropy is considered very strong

    // Update display
    scoreDisplay.textContent = score;
    strengthBar.style.width = `${score}%`;
    strengthBar.style.backgroundColor = getStrengthColor(score);
    crackTime.textContent = calculateCrackTime(entropy);
    review.textContent = generateDetailedReview(password, score, requirements);
});

// Password generator
function generatePassword() {
    const length = 16;
    const charset = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        special: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };
    
    let password = '';
    
    // Ensure at least one of each type
    password += charset.uppercase[Math.floor(Math.random() * charset.uppercase.length)];
    password += charset.lowercase[Math.floor(Math.random() * charset.lowercase.length)];
    password += charset.numbers[Math.floor(Math.random() * charset.numbers.length)];
    password += charset.special[Math.floor(Math.random() * charset.special.length)];
    
    // Fill the rest with random characters
    const allChars = Object.values(charset).join('');
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

generateButton.addEventListener('click', () => {
    const password = generatePassword();
    passwordOutput.classList.remove('hidden');
    generatedPassword.value = password;
    
    // Animate the appearance
    setTimeout(() => {
        passwordOutput.classList.add('visible');
    }, 50);
});

copyButton.addEventListener('click', () => {
    generatedPassword.select();
    document.execCommand('copy');
    copyButton.textContent = 'Copied!';
    copyButton.style.animation = 'pulse 0.3s ease';
    
    setTimeout(() => {
        copyButton.textContent = 'Copy';
        copyButton.style.animation = '';
    }, 2000);
});

// Initialize
passwordOutput.classList.add('hidden');