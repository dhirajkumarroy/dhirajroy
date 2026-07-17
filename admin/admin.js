// Shared Admin Panel Utility Script
const API_BASE = '/api/v1';

// Redirect helper if not logged in
function checkAuth() {
    if (!localStorage.getItem('admin_token')) {
        window.location.href = '/admin/login.html';
    }
}

// Request wrapper that supports automated JWT Refresh rotation
async function adminFetch(url, options = {}) {
    let token = localStorage.getItem('admin_token');
    
    // Merge auth headers
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    let response = await fetch(url, options);

    // If unauthorized, attempt token refresh automatically
    if (response.status === 401) {
        try {
            console.log('Access token expired, attempting to refresh...');
            const refreshRes = await fetch(`${API_BASE}/admin/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const refreshData = await refreshRes.json();

            if (refreshData.status === 'success') {
                console.log('Token successfully refreshed.');
                // Update local storage
                localStorage.setItem('admin_token', refreshData.data.accessToken);
                localStorage.setItem('admin_user', JSON.stringify(refreshData.data.admin));
                
                // Retry original request with new token
                options.headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
                response = await fetch(url, options);
            } else {
                // Refresh failed
                throw new Error('Refresh session expired.');
            }
        } catch (err) {
            console.error('Session expired. Redirecting to login...');
            logoutLocal();
            return null;
        }
    }

    return response;
}

function logoutLocal() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login.html';
}

async function adminLogout() {
    try {
        await adminFetch(`${API_BASE}/admin/logout`, {
            method: 'POST'
        });
    } catch (err) {
        console.error('Logout API failure:', err.message);
    } finally {
        logoutLocal();
    }
}

// Format MySQL timestamp
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
