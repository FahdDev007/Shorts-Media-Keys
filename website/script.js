document.addEventListener('DOMContentLoaded', () => {
    
    // Scroll Fade-in Animation Observer
    const fadeElements = document.querySelectorAll('.scroll-fade');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });

    // Hardware Keys Demo Animation
    const track = document.querySelector('.demo-video-track');
    const nextKey = document.querySelector('.next-key');
    const prevKey = document.querySelector('.prev-key');
    
    if (track && nextKey && prevKey) {
        // Positions: 
        // 0% -> top video (prev)
        // -33.333% -> middle video (active)
        // -66.666% -> bottom video (next)
        
        function playAnimationSequence() {
            // Wait 1.5s then simulate pressing "Next"
            setTimeout(() => {
                nextKey.classList.add('active');
                
                setTimeout(() => {
                    nextKey.classList.remove('active');
                    // Scroll to next video
                    track.style.transform = 'translateY(-66.666%)';
                    
                    // Wait 2s then simulate pressing "Prev"
                    setTimeout(() => {
                        prevKey.classList.add('active');
                        
                        setTimeout(() => {
                            prevKey.classList.remove('active');
                            // Scroll back to middle video
                            track.style.transform = 'translateY(-33.333%)';
                            
                            // Loop indefinitely
                            playAnimationSequence();
                        }, 200);
                    }, 2000);
                    
                }, 200);
            }, 1500);
        }
        
        // Ensure initial state
        setTimeout(() => {
            track.style.transform = 'translateY(-33.333%)';
        }, 100);

        // Start animation loop
        playAnimationSequence();
    }
});
