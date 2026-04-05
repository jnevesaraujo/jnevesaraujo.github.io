export default class PageManager {
    constructor(projectId = '87g07cqn', dataset = 'production') {
        this.projectId = projectId;
        this.dataset = dataset;
        this.apiVersion = '2024-11-13';
    }

    async fetchPage(slug, language = 'pt') {
        try {
            const query = `*[_type == "page" && slug == "${slug}"][0]{
                slug,
                "title": title.${language},
                "content": content.${language},
                "cta": cta.${language}
            }`;

            const url = `https://${this.projectId}.api.sanity.io/v${this.apiVersion}/data/query/${this.dataset}?query=${encodeURIComponent(query)}`;

            const response = await fetch(url);
            const data = await response.json();

            return data.result || null;
        } catch (error) {
            console.error('Error fetching page:', error);
            return null;
        }
    }

    async renderPage(slug, titleSelector, contentSelector, ctaSelector, language = 'pt') {
        const pageData = await this.fetchPage(slug, language);

        if (!pageData) {
            console.error(`Page not found: ${slug}`);
            return;
        }

        // Update DOM elements
        const titleEl = document.querySelector(titleSelector);
        const contentEl = document.querySelector(contentSelector);
        const ctaEl = document.querySelector(ctaSelector);

        if (titleEl) titleEl.textContent = pageData.title;
        if (contentEl) contentEl.innerHTML = pageData.content; 
        if (ctaEl) ctaEl.textContent = pageData.cta;
    }
}