export default class ProjectManager {
    constructor(projectId = '87g07cqn', dataset = 'production') {
        this.projectId = projectId;
        this.dataset = dataset;
        this.apiVersion = '2024-11-13';
        this.projects = [];
    }

    async fetchProjects(language = 'pt') {
        try {
            const query = `*[_type == "project"]{
                _id,
                "title": title.${language},
                "shortDescription": shortDescription.${language},
                "fullDescription": fullDescription.${language},
                "thumbnail": thumbnail.asset->url,
                stack,
                links,
                media[]{
                    type,
                    "image": image.asset->url,
                    videoType,
                    videoId,
                    "title": title.${language},
                    layout,
                    order
                }
            }`;
            
            const url = `https://${this.projectId}.api.sanity.io/v${this.apiVersion}/data/query/${this.dataset}?query=${encodeURIComponent(query)}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!data.result) {
                console.error('No data returned:', data);
                return [];
            }
            
            this.projects = this.transformProjects(data.result);
            return this.projects;
        } catch (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
    }

    transformProjects(sanityData) {
        return sanityData.map(project => ({
            id: project._id,
            title: project.title,
            shortDesc: project.shortDescription,
            fullDesc: project.fullDescription,
            thumbnail: project.thumbnail || '',
            stack: project.stack || [],
            links: project.links || null,
            media: this.transformMedia(project.media || [])
        }));
    }

    transformMedia(mediaArray) {
        return {
            images: mediaArray
                .filter(m => m.type === 'image')
                .map(m => ({
                    src: m.image || '',
                    title: m.title,
                    layout: m.layout || 'thumbnail',
                    order: m.order || 0
                })),
            videos: mediaArray
                .filter(m => m.type === 'video')
                .map(m => ({
                    type: m.videoType,
                    id: m.videoId,
                    title: m.title,
                    layout: m.layout || 'thumbnail',
                    order: m.order || 0
                }))
        };
    }

    async renderProjectGrid(gridSelector) {
        const grid = document.querySelector(gridSelector);
        if (!grid) {
            console.error(`Grid element not found: ${gridSelector}`);
            return;
        }

        //const projects = await this.fetchProjects();
        const projects = this.projects;
        grid.innerHTML = ''; // Clear existing content
        
        projects.forEach(project => {
            const col = this.createProjectCard(project);
            grid.appendChild(col);
        });
    }

    createProjectCard(project) {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `
            <div class="card project-card shadow-sm h-100" data-project-id="${project.id}">
                <img src="${project.thumbnail}" class="card-img-top" alt="${project.title}">
                <div class="card-overlay">
                    <h5>${project.title}</h5>
                    <p>${project.shortDesc}</p>
                    <div class="d-flex justify-content-center gap-2 flex-wrap">
                        ${project.stack.map(tech => 
                            `<span class="badge bg-primary">${tech}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
        
        col.querySelector('.project-card').addEventListener('click', () => {
            this.openModal(project);
        });
        
        return col;
    }

    openModal(project) {
        const modal = document.getElementById('projectModal');
        if (!modal) {
            console.error('Modal element not found');
            return;
        }
        
        // Dispose existing modal
        const existingModal = bootstrap.Modal.getInstance(modal);
        if (existingModal) {
            existingModal.dispose();
        }
        
        // Set title
        modal.querySelector('.modal-title').textContent = project.title;

        // Build modal content
        const modalContent = this.buildModalContent(project);
        modal.querySelector('.modal-body').innerHTML = modalContent;
        
        // Setup thumbnail click handlers
        this.setupThumbnailHandlers(modal, project);
        
        // Show modal
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();

        // Clean up when modal closes
        modal.addEventListener('hidden.bs.modal', function() {
            modal.querySelector('.modal-body').innerHTML = '';
        }, { once: true });
    }

    buildModalContent(project) {
        const linksHTML = this.buildLinksSection(project.links);
        const { featuredHTML, thumbnailsHTML, otherMediaHTML } = this.buildMediaSections(project);
        
        return `
            <p>${project.fullDesc}</p>
            ${linksHTML}
            <div class="project-media-layout">
                ${featuredHTML}
                ${thumbnailsHTML ? `<div class="thumbnails-column">${thumbnailsHTML}</div>` : ''}
            </div>
            ${otherMediaHTML}
        `;
    }

    buildLinksSection(links) {
        if (!links) return '';
        
        return `
            <div class="project-links mb-3 d-flex gap-2">
                ${links.demo ? `<a href="${links.demo}" target="_blank" class="btn btn-primary btn-sm"><i class="bi bi-play-circle"></i> View Demo</a>` : ''}
                ${links.github ? `<a href="${links.github}" target="_blank" class="btn btn-dark btn-sm"><i class="bi bi-github"></i> GitHub</a>` : ''}
                ${links.live ? `<a href="${links.live}" target="_blank" class="btn btn-success btn-sm"><i class="bi bi-box-arrow-up-right"></i> Live Site</a>` : ''}
            </div>
        `;
    }

    buildMediaSections(project) {
        const allMedia = [
            ...(project.media?.videos || []).map(v => ({...v, mediaType: 'video'})),
            ...(project.media?.images || []).map(i => ({...i, mediaType: 'image'}))
        ].sort((a, b) => (a.order || 0) - (b.order || 0));
        
        // Categorize media
        const featuredMedia = allMedia.filter(m => 
            m.layout === 'featured' || m.layout === 'full-width'
        );
        
        const thumbnailImages = allMedia.filter(m => 
            m.mediaType === 'image' && m.layout === 'thumbnail'
        );
        
        const thumbnailVideos = allMedia.filter(m => 
            m.mediaType === 'video' && m.layout === 'thumbnail'
        );
        
        const otherMedia = allMedia.filter(m => 
            m.layout !== 'featured' && 
            m.layout !== 'full-width' && 
            m.layout !== 'thumbnail'
        );
        
        // Build sections
        let featuredHTML = '';
        let originalFeaturedImage = null;
        let originalFeaturedVideo = null;

        if (featuredMedia.length > 0) {
            const featured = featuredMedia[0];
            if (featured.mediaType === 'image') {
                originalFeaturedImage = featured;
            } else if (featured.mediaType === 'video') {
                originalFeaturedVideo = featured;
            }
            featuredHTML = `
                <div id="featured-display" class="mb-3">
                    ${this.renderMediaItem(featured, project.title)}
                </div>
            `;
        }
        
        const allClickableImages = [
            ...(originalFeaturedImage ? [originalFeaturedImage] : []),
            ...thumbnailImages
        ];
        
        const allClickableVideos = [
            ...(originalFeaturedVideo ? [originalFeaturedVideo] : []),
            ...thumbnailVideos
        ];
        
        const imageThumbnailsHTML = this.buildImageThumbnails(allClickableImages, project.title);
        const videoThumbnailsHTML = this.buildVideoThumbnails(allClickableVideos);
        
        const thumbnailsHTML = imageThumbnailsHTML || videoThumbnailsHTML ? 
            imageThumbnailsHTML + videoThumbnailsHTML : '';
        
        const otherMediaHTML = otherMedia.length > 0 ? `
            <div class="other-media mt-3">
                ${otherMedia.map(item => this.renderMediaItem(item, project.title)).join('')}
            </div>
        ` : '';
        
        return { featuredHTML, thumbnailsHTML, otherMediaHTML };
    }

    buildImageThumbnails(images, projectTitle) {
        if (images.length === 0) return '';
        
        return `
            <div class="media-thumbnails mb-3">
                ${images.map((item) => `
                    <div class="media-item media-thumbnail cursor-pointer" 
                         data-media-type="image"
                         data-media-src="${item.src}"
                         data-media-title="${item.title || ''}">
                        <img src="${item.src}" 
                             class="img-fluid-work" 
                             alt="${item.title || projectTitle}">
                        ${item.title ? `<p class="text-muted small mt-1 mb-0">${item.title}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    buildVideoThumbnails(videos) {
        if (videos.length === 0) return '';
        
        return `
            <div class="media-thumbnails mt-3">
                ${videos.map((item) => {
                    // Get thumbnail image from video service
                    const thumbnailUrl = item.type === 'vimeo' 
                        ? `https://vumbnail.com/${item.id}.jpg`
                        : `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;
                    
                    return `
                        <div class="media-item media-thumbnail cursor-pointer" 
                            data-media-type="video"
                            data-video-type="${item.type}"
                            data-video-id="${item.id}"
                            data-media-title="${item.title || ''}">
                            <img src="${thumbnailUrl}" 
                                class="img-fluid-work" 
                                alt="${item.title || 'Video thumbnail'}">
                            <div class="play-overlay">▶</div>
                            ${item.title ? `<p class="text-muted small mt-1 mb-0">${item.title}</p>` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderMediaItem(item, projectTitle) {
        if (item.mediaType === 'video') {
            const embedUrl = item.type === 'vimeo' 
                ? `https://player.vimeo.com/video/${item.id}`
                : `https://www.youtube.com/embed/${item.id}`;
            
            return `
                <div class="media-item media-${item.layout || 'default'}">
                    <div class="ratio ratio-16x9">
                        <iframe src="${embedUrl}" 
                                frameborder="0" 
                                allow="autoplay; fullscreen; picture-in-picture" 
                                allowfullscreen>
                        </iframe>
                    </div>
                    ${item.title ? `<p class="text-muted small mt-2">${item.title}</p>` : ''}
                </div>
            `;
        } else {
            return `
                <img src="${item.src}" 
                     class="media-item media-${item.layout || 'default'}" 
                     alt="${item.title || projectTitle}">
                ${item.title ? `<p class="text-muted small mt-2">${item.title}</p>` : ''}
            `;
        }
    }

    setupThumbnailHandlers(modal, project) {
        modal.querySelectorAll('[data-media-type]').forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Remove active class from all
                modal.querySelectorAll('[data-media-type]').forEach(t => 
                    t.classList.remove('active')
                );
                
                // Add active to clicked
                thumb.classList.add('active');
                
                const featuredDisplay = document.getElementById('featured-display');
                if (!featuredDisplay) return;
                
                const mediaType = thumb.dataset.mediaType;
                
                if (mediaType === 'image') {
                    this.updateFeaturedImage(featuredDisplay, thumb, project.title);
                } else if (mediaType === 'video') {
                    this.updateFeaturedVideo(featuredDisplay, thumb, project.title);
                }
            });
        });
        
        // Set first thumbnail as active
        const firstThumb = modal.querySelector('[data-media-type]');
        if (firstThumb) firstThumb.classList.add('active');
    }

    updateFeaturedImage(display, thumb, projectTitle) {
        const src = thumb.dataset.mediaSrc;
        const title = thumb.dataset.mediaTitle;
        
        display.innerHTML = `
            <img src="${src}" 
                 class="img-fluid w-100" 
                 alt="${title || projectTitle}">
            ${title ? `<p class="text-muted small mt-2">${title}</p>` : ''}
        `;
    }

    updateFeaturedVideo(display, thumb, projectTitle) {
        const videoType = thumb.dataset.videoType;
        const videoId = thumb.dataset.videoId;
        const title = thumb.dataset.mediaTitle;
        
        const embedUrl = videoType === 'vimeo' 
            ? `https://player.vimeo.com/video/${videoId}`
            : `https://www.youtube.com/embed/${videoId}`;
        
        display.innerHTML = `
            <div class="ratio ratio-16x9">
                <iframe src="${embedUrl}" 
                        frameborder="0" 
                        allow="autoplay; fullscreen; picture-in-picture" 
                        allowfullscreen>
                </iframe>
            </div>
            ${title ? `<p class="text-muted small mt-2">${title}</p>` : ''}
        `;
    }
}