// Main application logic
const API_URL = 'http://localhost:5000/api'; // Update with your backend URL

// Process user input with AI
async function processInput() {
    const userInput = document.getElementById('userInput').value.trim();
    
    if (!userInput) {
        alert('Please enter some content!');
        return;
    }

    // Show loader
    showLoader(true);
    hideResults();

    try {
        // Call your backend API
        const response = await fetch(`${API_URL}/process`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: userInput
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        displayResults(data);
        
    } catch (error) {
        console.error('Error:', error);
        displayError('Something went wrong! Make sure your backend is running.');
    } finally {
        showLoader(false);
    }
}

// Display results
function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    const resultSection = document.getElementById('resultSection');
    
    // Customize this based on your project's output
    resultsDiv.innerHTML = `
        <div style="padding: 15px; background: white; border-radius: 10px; margin-bottom: 10px;">
            <strong>Processed Data:</strong>
            <p>${JSON.stringify(data, null, 2)}</p>
        </div>
    `;
    
    resultSection.classList.add('show');
}

// Display error message
function displayError(message) {
    const resultsDiv = document.getElementById('results');
    const resultSection = document.getElementById('resultSection');
    
    resultsDiv.innerHTML = `
        <div style="padding: 15px; background: #ffe6e6; border-radius: 10px; color: #cc0000;">
            <strong>Error:</strong>
            <p>${message}</p>
        </div>
    `;
    
    resultSection.classList.add('show');
}

// Show/hide loader
function showLoader(show) {
    const loader = document.getElementById('loader');
    if (show) {
        loader.classList.add('show');
    } else {
        loader.classList.remove('show');
    }
}

// Hide results
function hideResults() {
    const resultSection = document.getElementById('resultSection');
    resultSection.classList.remove('show');
}

// Handle Enter key in textarea (optional)
document.getElementById('userInput')?.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        processInput();
    }
});

// Example: Add animations on scroll (optional)
window.addEventListener('scroll', function() {
    const features = document.querySelectorAll('.feature-card');
    features.forEach(feature => {
        const position = feature.getBoundingClientRect();
        if (position.top < window.innerHeight && position.bottom >= 0) {
            feature.style.opacity = '1';
            feature.style.transform = 'translateY(0)';
        }
    });
});
