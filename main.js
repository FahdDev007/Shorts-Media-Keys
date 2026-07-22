// main.js
// Description: Core logic to handle YouTube Shorts media key navigation.
// This runs in the MAIN world via a script tag injected by content.js,
// giving it direct access to the page's navigator.mediaSession object.

console.log('[Shorts Media Keys] Main world script initialized.');

if ('mediaSession' in navigator) {
    // Cache the original setActionHandler so we can call it directly
    const originalSetActionHandler = navigator.mediaSession.setActionHandler.bind(navigator.mediaSession);

    // Override the global setActionHandler to protect nexttrack/previoustrack
    navigator.mediaSession.setActionHandler = function(action, handler) {
        // YouTube often sets nexttrack/previoustrack to null on Shorts
        // We ignore these calls so our own handlers survive, but ONLY on Shorts pages.
        if (window.location.pathname.startsWith('/shorts/') && (action === 'nexttrack' || action === 'previoustrack')) {
            return;
        }
        // Let all other handlers (play/pause/stop) go through normally
        return originalSetActionHandler(action, handler);
    };

    // Helper to find and click the native navigation buttons
    function navigateShorts(direction) {
        if (!window.location.pathname.startsWith('/shorts/')) return;

        const btnId = direction === 'next' ? 'navigation-button-down' : 'navigation-button-up';
        const container = document.getElementById(btnId);
        
        if (container) {
            // YouTube's buttons are usually inside the container
            const btn = container.querySelector('button');
            if (btn) {
                console.log('[Shorts Media Keys] Navigating ' + direction);
                btn.click();
                return;
            }
        }
        
        // Fallback: finding the active renderer and scrolling
        const activeRenderer = document.querySelector('ytd-reel-video-renderer[is-active]');
        if (activeRenderer) {
            const target = direction === 'next' ? activeRenderer.nextElementSibling : activeRenderer.previousElementSibling;
            if (target) {
                console.log('[Shorts Media Keys] Fallback scrolling ' + direction);
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    // Continuously enforce our Next/Prev handlers 
    // This runs in the same world as YouTube, so it natively hooks into the OS.
    setInterval(() => {
        if (window.location.pathname.startsWith('/shorts/')) {
            try {
                originalSetActionHandler('nexttrack', () => navigateShorts('next'));
                originalSetActionHandler('previoustrack', () => navigateShorts('prev'));
            } catch(e) { }
        }
    }, 1000);
    
    // Call it immediately once as well
    if (window.location.pathname.startsWith('/shorts/')) {
        try {
            originalSetActionHandler('nexttrack', () => navigateShorts('next'));
            originalSetActionHandler('previoustrack', () => navigateShorts('prev'));
        } catch(e) { }
    }
}
