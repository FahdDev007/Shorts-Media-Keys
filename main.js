// main.js
// Description: Core logic to handle YouTube Shorts media key navigation.
// This runs in the MAIN world via a script tag injected by content.js,
// giving it direct access to the page's navigator.mediaSession object.

console.log('[Shorts Media Keys] Main world script initialized.');

if ('mediaSession' in navigator) {
    // Cache the original setActionHandler so we can call it directly
    const originalSetActionHandler = navigator.mediaSession.setActionHandler.bind(navigator.mediaSession);

    // Keep track of our handlers so we only set them once per Shorts session
    let isCurrentlyShorts = false;

    // Override the global setActionHandler to protect our handlers
    navigator.mediaSession.setActionHandler = function(action, handler) {
        if (window.location.pathname.startsWith('/shorts/')) {
            // We manage nexttrack and previoustrack completely, block YouTube from touching them
            if (action === 'nexttrack' || action === 'previoustrack') {
                return;
            }
            
            // For play/pause, let YouTube set its own handlers so the native player works, 
            // BUT block YouTube from clearing them (setting to null) when backgrounded!
            if ((action === 'play' || action === 'pause') && !handler) {
                return; 
            }
        }
        // Let all other handlers go through normally
        return originalSetActionHandler(action, handler);
    };

    // Helper to find and click the native navigation buttons
    function navigateShorts(direction) {
        if (!window.location.pathname.startsWith('/shorts/')) return;

        // Try to find the global navigation buttons that YouTube Shorts uses
        const btnId = direction === 'next' ? '#navigation-button-down' : '#navigation-button-up';
        const container = document.querySelector(btnId);
        
        if (container) {
            // YouTube's buttons are usually inside the container (either a native button or ytd-button-renderer)
            const btn = container.querySelector('button') || container.querySelector('ytd-button-renderer');
            if (btn && typeof btn.click === 'function') {
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



    // Function to check URL and enforce handlers cleanly
    function ensureHandlers() {
        const isShorts = window.location.pathname.startsWith('/shorts/');
        
        if (isShorts && !isCurrentlyShorts) {
            isCurrentlyShorts = true;
            try {
                // Apply our handlers exactly ONCE when entering Shorts
                originalSetActionHandler('nexttrack', () => navigateShorts('next'));
                originalSetActionHandler('previoustrack', () => navigateShorts('prev'));
                console.log('[Shorts Media Keys] Handlers installed.');
            } catch(e) { 
                console.error('[Shorts Media Keys] Error installing handlers:', e);
            }
        } else if (!isShorts && isCurrentlyShorts) {
            isCurrentlyShorts = false;
            // We left shorts. YouTube will naturally overwrite handlers as needed 
            // since our wrapper only blocks overrides on /shorts/
            console.log('[Shorts Media Keys] Left shorts, disabled protection.');
        }
    }

    // Check URL periodically (every 500ms) to detect SPA navigation
    // This is safe because it only reads window.location and doesn't hammer the MediaSession API
    setInterval(ensureHandlers, 500);
    
    // Call it immediately on load
    ensureHandlers();
}
