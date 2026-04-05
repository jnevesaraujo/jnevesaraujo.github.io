export default class PortfolioNav {
    constructor() {
        this.container = document.getElementById('content-container');
        this.overlay = document.getElementById('loadingOverlay');
        this.currentPage = 'home';
        this.isAnimating = false;

        this.init();
    }

    init() {
        // Load initial page
        this.loadPage('home', false);

        // Setup navigation listeners
        document.addEventListener('click', (e) => {
            // Find the closest element with data-page (in case you clicked an icon inside the button)
            const target = e.target.closest('[data-page]');

            if (target) {
                e.preventDefault();
                const page = target.getAttribute('data-page');

                // Trigger load if it's a new page and not animating
                if (page !== this.currentPage && !this.isAnimating) {
                    this.loadPage(page);
                }
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.loadPage(e.state.page, false);
            }
        });
    }

    async loadPage(page, pushState = true) {
        this.isAnimating = true;

        // Show loading overlay
        await this.showOverlay();

        try {
            // Fetch the page content
            const response = await fetch(`pages/${page}.html`);
            if (!response.ok) throw new Error('Page not found');

            const html = await response.text();

            // Animate out old content
            await this.animateOut();

            // Update content
            this.container.innerHTML = html;

            // Check if we're on the work page and render projects
            if (page === 'work' && window.renderWorkPage) window.renderWorkPage();

            // Check if we're on the home page and render page content
            if (page === 'home' && window.renderHomePage) {
                await window.renderHomePage();
            }

            if (page === 'about' && window.renderAboutPage) {
                await window.renderAboutPage();
            }

            // Update active nav link
            this.updateNavigation(page);

            // Update browser history
            if (pushState) {
                history.pushState({ page }, '', `#${page}`);
            }

            this.currentPage = page;
            // Animate in new content
            await this.animateIn();

            // Hide loading overlay
            await this.hideOverlay();

        } catch (error) {
            console.error('Error loading page:', error);
            this.container.innerHTML = '<div class="container py-5"><h1>Error loading page</h1></div>';
            await this.hideOverlay();
        }

        this.isAnimating = false;
    }

    showOverlay() {
        return new Promise((resolve) => {
            this.overlay.classList.add('active');
            gsap.to(this.overlay, {
                opacity: 1,
                duration: 0.3,
                onComplete: resolve
            });
        });
    }

    hideOverlay() {
        return new Promise((resolve) => {
            gsap.to(this.overlay, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    this.overlay.classList.remove('active');
                    resolve();
                }
            });
        });
    }

    animateOut() {
        return new Promise((resolve) => {
            gsap.to(this.container, {
                x: -100,
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in',
                force3D: true,
                onComplete: resolve
            });
        });
    }

    animateIn() {
        return new Promise((resolve) => {
            gsap.fromTo(this.container,
                { x: 100, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power2.out',
                    force3D: true,
                    onComplete: resolve
                }
            );
        });
    }

    updateNavigation(page) {
        document.querySelectorAll('[data-page]').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });
    }
}