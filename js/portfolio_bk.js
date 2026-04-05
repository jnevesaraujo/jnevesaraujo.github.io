import PortfolioNav from './PortfolioNav.js';
import { projects } from './projects-data.js';

document.addEventListener("DOMContentLoaded", (event) => {
  new PortfolioNav();
  gsap.registerPlugin(SlowMo)
  const loadingOverlay = document.getElementById('loadingOverlay');

  // Remover o overlay de carregamento quando a página estiver completamente carregada
  window.addEventListener('load', function() {
    setTimeout(function() {
      loadingOverlay.classList.add('hidden');
    }, 500); // Pequeno atraso para garantir um fade-out suave
  });

  // Adicionar evento de redimensionamento para mostrar o overlay durante o redimensionamento
  let resizeTimer;
  window.addEventListener('resize', function() {
    loadingOverlay.classList.remove('hidden'); // Mostrar o overlay durante o redimensionamento
    clearTimeout(resizeTimer); // Limpar o temporizador se já estiver em execução

    // Esconder o overlay após o redimensionamento
    resizeTimer = setTimeout(function() {
      loadingOverlay.classList.add('hidden');
    }, 500);
  });


// Fetch projects from Strapi
async function fetchProjects() {
    try {
        const response = await fetch('http://localhost:1337/api/projects?populate=*');
        const data = await response.json();
        
        // Add null check
        if (!data.data) {
            console.error('No data returned:', data);
            return [];
        }
        
        // Transform Strapi data to match your existing structure
        return data.data.map(project => ({
            id: project.documentId,
            title: project.Title,
            shortDesc: project.Short_Description,
            fullDesc: project.Full_Description,
            thumbnail: project.Thumbnail ? `http://localhost:1337${project.Thumbnail.url}` : '',
            stack: project.Stack ? project.Stack.map(s => s.name) : [],
            links: project.Links || null,
            media: {
                images: project.media
                    ? project.media
                        .filter(m => m.Type === 'image')
                        .map(m => ({
                            src: m.image_url || '', // Using workaround field
                            title: m.Title,
                            layout: m.Layout || 'thumbnail',
                            order: m.Order || 0
                        }))
                    : [],
                videos: project.media
                    ? project.media
                        .filter(m => m.Type === 'video')
                        .map(m => ({
                            type: m.Video_Type,
                            id: m.Video_ID,
                            title: m.Title,
                            layout: m.Layout || 'thumbnail',
                            order: m.Order || 0
                        }))
                    : []
            }
        }));
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

// Update your renderProjects to be async
async function renderProjects() {
    const projects = await fetchProjects();
    const grid = document.querySelector('.project-grid');
    
    projects.forEach(project => {
        const grid = document.querySelector('.project-grid'); // Add this class to your row
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `
            <div class="card project-card shadow-sm h-100" data-project-id="${project.id}">
                <img src="${project.thumbnail}" class="card-img-top" alt="${project.title}">
                <div class="card-overlay">
                    <h5>${project.title}</h5>
                    <p>${project.shortDesc}</p>
                    <div class="d-flex gap-2 flex-wrap">
                        ${project.stack.map(tech => 
                            `<span class="badge bg-primary">${tech}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Add click handler
        col.querySelector('.project-card').addEventListener('click', () => {
            openProjectModal(project);
        });
        
        grid.appendChild(col);
    });
}

  // In your work.html or portfolio.js
/* function renderProjects() {
    const grid = document.querySelector('.project-grid'); // Add this class to your row
    
    projects.forEach(project => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `
            <div class="card project-card shadow-sm h-100" data-project-id="${project.id}">
                <img src="${project.thumbnail}" class="card-img-top" alt="${project.title}">
                <div class="card-overlay">
                    <h5>${project.title}</h5>
                    <p>${project.shortDesc}</p>
                    <div class="d-flex gap-2 flex-wrap">
                        ${project.stack.map(tech => 
                            `<span class="badge bg-primary">${tech}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Add click handler
        col.querySelector('.project-card').addEventListener('click', () => {
            openProjectModal(project);
        });
        
        grid.appendChild(col);
    });
} */
window.renderProjects = renderProjects;

function openProjectModal(project) {
    const modal = document.getElementById('projectModal');
    
    const existingModal = bootstrap.Modal.getInstance(modal);
    if (existingModal) {
        existingModal.dispose();
    }
    
    modal.querySelector('.modal-title').textContent = project.title;
    
    // Generate links section
    let linksHTML = '';
    if (project.links) {
        linksHTML = `
            <div class="project-links mb-3 d-flex gap-2">
                ${project.links.demo ? `<a href="${project.links.demo}" target="_blank" class="btn btn-primary btn-sm"><i class="bi bi-play-circle"></i> View Demo</a>` : ''}
                ${project.links.github ? `<a href="${project.links.github}" target="_blank" class="btn btn-dark btn-sm"><i class="bi bi-github"></i> GitHub</a>` : ''}
                ${project.links.live ? `<a href="${project.links.live}" target="_blank" class="btn btn-success btn-sm"><i class="bi bi-box-arrow-up-right"></i> Live Site</a>` : ''}
            </div>
        `;
    }
    
    // Sort all media by order
    const allMedia = [
        ...(project.media?.videos || []).map(v => ({...v, mediaType: 'video'})),
        ...(project.media?.images || []).map(i => ({...i, mediaType: 'image'}))
    ].sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // Separate media types
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
    
    // Generate featured area
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
                ${renderMediaItem(featured, project.title)}
            </div>
        `;
    }
    
    // Combine all clickable thumbnails
    const allClickableImages = [
        ...(originalFeaturedImage ? [originalFeaturedImage] : []),
        ...thumbnailImages
    ];
    
    const allClickableVideos = [
        ...(originalFeaturedVideo ? [originalFeaturedVideo] : []),
        ...thumbnailVideos
    ];
    
    // Generate image thumbnails
    const imageThumbnailsHTML = allClickableImages.length > 0 ? `
        <div class="media-thumbnails mb-3">
            ${allClickableImages.map((item) => `
                <div class="media-item media-thumbnail cursor-pointer" 
                     data-media-type="image"
                     data-media-src="${item.src}"
                     data-media-title="${item.title || ''}"
                     style="cursor: pointer;">
                    <img src="${item.src}" 
                         class="img-fluid-work" 
                         alt="${item.title || project.title}">
                    ${item.title ? `<p class="text-muted small mt-1 mb-0">${item.title}</p>` : ''}
                </div>
            `).join('')}
        </div>
    ` : '';
    
    // Generate video thumbnails
    const videoThumbnailsHTML = allClickableVideos.length > 0 ? `
        <div class="media-thumbnails ${allClickableImages.length > 0 ? 'mt-3' : ''}">
            ${allClickableVideos.map((item) => {
                const embedUrl = item.type === 'vimeo' 
                    ? `https://player.vimeo.com/video/${item.id}`
                    : `https://www.youtube.com/embed/${item.id}`;
                
                return `
                    <div class="media-item media-thumbnail cursor-pointer" 
                         data-media-type="video"
                         data-video-type="${item.type}"
                         data-video-id="${item.id}"
                         data-media-title="${item.title || ''}"
                         style="cursor: pointer;">
                        <div class="ratio ratio-16x9">
                            <iframe src="${embedUrl}" 
                                    frameborder="0" 
                                    allow="autoplay; fullscreen; picture-in-picture" 
                                    allowfullscreen>
                            </iframe>
                        </div>
                        ${item.title ? `<p class="text-muted small mt-1 mb-0">${item.title}</p>` : ''}
                    </div>
                `;
            }).join('')}
        </div>
    ` : '';
    
    const thumbnailsHTML = imageThumbnailsHTML || videoThumbnailsHTML ? 
        imageThumbnailsHTML + videoThumbnailsHTML : '';
    
    // Generate other media
    const otherMediaHTML = otherMedia.length > 0 ? `
        <div class="other-media mt-3">
            ${otherMedia.map(item => renderMediaItem(item, project.title)).join('')}
        </div>
    ` : '';

    modal.querySelector('.modal-body').innerHTML = `
        <p>${project.fullDesc}</p>
        ${linksHTML}
        <div class="project-media-layout">
            ${featuredHTML}
            ${thumbnailsHTML ? `<div class="thumbnails-column">${thumbnailsHTML}</div>` : ''}
        </div>
        ${otherMediaHTML}
    `;
    
    // Add click handlers for all thumbnails
    modal.querySelectorAll('[data-media-type]').forEach(thumb => {
        thumb.addEventListener('click', function() {
            const mediaType = this.dataset.mediaType;
            
            // Remove active class from all thumbnails
            modal.querySelectorAll('[data-media-type]').forEach(t => 
                t.classList.remove('active')
            );
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            const featuredDisplay = document.getElementById('featured-display');
            if (!featuredDisplay) return;
            
            if (mediaType === 'image') {
                const src = this.dataset.mediaSrc;
                const title = this.dataset.mediaTitle;
                
                featuredDisplay.innerHTML = `
                    <img src="${src}" 
                         class="img-fluid w-100" 
                         alt="${title || project.title}">
                    ${title ? `<p class="text-muted small mt-2">${title}</p>` : ''}
                `;
            } else if (mediaType === 'video') {
                const videoType = this.dataset.videoType;
                const videoId = this.dataset.videoId;
                const title = this.dataset.mediaTitle;
                
                const embedUrl = videoType === 'vimeo' 
                    ? `https://player.vimeo.com/video/${videoId}`
                    : `https://www.youtube.com/embed/${videoId}`;
                
                featuredDisplay.innerHTML = `
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
        });
    });
    
    // Set first thumbnail as active by default
    const firstThumb = modal.querySelector('[data-media-type]');
    if (firstThumb) firstThumb.classList.add('active');
    
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

// Helper function to render a media item
function renderMediaItem(item, projectTitle) {
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

/*   const navbarNav = document.querySelector('.navbar-collapse');
  const navLinks = document.querySelectorAll('.nav-link');

  // Adicionar evento de clique para cada link de navegação
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      if (navbarNav.classList.contains('show')) {
        const navbarToggler = document.querySelector('.navbar-toggler');
        navbarToggler.click(); // Simular o clique para alternar o navbar
      }
    });
  }); */

});
