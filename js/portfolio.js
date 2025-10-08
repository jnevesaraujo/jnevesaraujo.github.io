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


  // In your work.html or portfolio.js
function renderProjects() {
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
}
window.renderProjects = renderProjects;

function openProjectModal(project) {
    const modal = document.getElementById('projectModal');
    
    // Dispose any existing modal instance first
    const existingModal = bootstrap.Modal.getInstance(modal);
    if (existingModal) {
        existingModal.dispose();
    }
    
    modal.querySelector('.modal-title').textContent = project.title;
    
    let videoEmbed = '';
    if (project.video) {
        if (project.videoType === 'vimeo') {
            videoEmbed = `<iframe src="https://player.vimeo.com/video/${project.videoId}" width="100%" height="400" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
        } else if (project.videoType === 'youtube') {
            videoEmbed = `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${project.videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }
    }

    modal.querySelector('.modal-body').innerHTML = `
        <p>${project.fullDesc}</p>
        ${videoEmbed}
        <div class="project-images">
            ${project.images.map(img => 
                `<img src="${img}" class="img-fluid mb-3" alt="${project.title}">`
            ).join('')}
        </div>
    `;
    
    // Create fresh modal instance
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
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
