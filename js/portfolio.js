import PortfolioNav from './PortfolioNav.js';
import ProjectManager from './ProjectManager.js';
import PageManager from './PageManager.js';

document.addEventListener("DOMContentLoaded", (event) => {
    new PortfolioNav();
    gsap.registerPlugin(SlowMo);

    const loadingOverlay = document.getElementById('loadingOverlay');
    
    var userLang = navigator.language || navigator.userLanguage;
    // Store current language

    if(userLang != ('pt' || 'en')) userLang = 'pt';
    let currentLanguage = userLang;

    // Initialize ProjectManager
    const pageManager = new PageManager('87g07cqn', 'production');
    const projectManager = new ProjectManager('87g07cqn', 'production');

    // Make it globally available with language support
    window.renderHomePage = async (lang = currentLanguage) => {
        await pageManager.renderPage('home', '#watercolor-text h1', '#watercolor-text .lead', '#watercolor-text .btn-viewwork', lang);
    };

    window.renderAboutPage = async (lang = currentLanguage) => {
        await pageManager.renderPage('about', '#aboutpage h1', '#aboutpage .about-text', '#aboutpage .tbd', lang);
    };

    window.renderWorkPage = async (lang = currentLanguage) => {
        await pageManager.renderPage('work', '#workpage h1', '#workpage .lead', 'workpage .tbd ', lang);
        window.renderProjects(lang);
    };

    window.renderProjects = async (lang = currentLanguage) => {
        currentLanguage = lang;
        await projectManager.fetchProjects(lang);
        await projectManager.renderProjectGrid('.project-grid');
    };

    // Loading overlay handlers
    window.addEventListener('load', function () {
        setTimeout(function () {
            loadingOverlay.classList.add('hidden');
        }, 500);
    });

    let resizeTimer;
    window.addEventListener('resize', function () {
        loadingOverlay.classList.remove('hidden');
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {
            loadingOverlay.classList.add('hidden');
        }, 500);
    });

    const navTranslations = {
        pt: {
            home: 'Início',
            work: 'Projectos',
            about: 'Sobre'
        },
        en: {
            home: 'Home',
            work: 'Work',
            about: 'About'
        }
    };

    function updateNavLanguage(lang = currentLanguage) {
        const links = document.querySelectorAll('#sidebar [data-page]'); // Only sidebar links
        console.log('Found nav links:', links.length);

        links.forEach(link => {
            const page = link.getAttribute('data-page');
            console.log('Updating page:', page, 'to lang:', lang);

            if (navTranslations[lang] && navTranslations[lang][page]) {
                const icon = link.querySelector('i');
                const iconHTML = icon ? icon.outerHTML : '';
                link.innerHTML = iconHTML + ' ' + navTranslations[lang][page];
            }
        });
    }

    updateNavLanguage();

const sidebar = document.getElementById('sidebar');
const togglerIcon = document.querySelector('.navbar-toggler-icon');

// When offcanvas is shown, change to close icon
sidebar.addEventListener('shown.bs.offcanvas', () => {
    togglerIcon.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'%3E%3C!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--%3E%3Cpath fill='rgb(177, 151, 252)' d='M192 64C86 64 0 150 0 256S86 448 192 448l192 0c106 0 192-86 192-192S490 64 384 64L192 64zm192 96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z'/%3E%3C/svg%3E\")";
});

// When offcanvas is hidden, change back to toggle icon
sidebar.addEventListener('hidden.bs.offcanvas', () => {
    togglerIcon.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'%3E%3C!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--%3E%3Cpath fill='rgb(177, 151, 252)' d='M384 128c70.7 0 128 57.3 128 128S454.7 384 384 384l-192 0c-70.7 0-128-57.3-128-128s57.3-128 128-128l192 0zM576 256c0-106-86-192-192-192L192 64C86 64 0 150 0 256S86 448 192 448l192 0c106 0 192-86 192-192zM192 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z'/%3E%3C/svg%3E\")";
});

    // Language Switching
    const languages = {
        'pt': {
            name: 'Português',
            flagUrl: 'https://flagcdn.com/pt.svg'
        },
        'en': {
            name: 'English',
            flagUrl: 'https://flagcdn.com/gb.svg'
        }
    };

    const currentLangFlag = document.getElementById('current-lang-flag');
    const langOptions = document.querySelectorAll('.lang-option');

    function switchLanguage(langCode) {
        if (languages[langCode]) {
            const newLang = languages[langCode];

            currentLanguage = langCode;

            currentLangFlag.src = newLang.flagUrl;
            currentLangFlag.alt = newLang.name;

            document.getElementById('current-lang-button').title = `Idioma atual: ${newLang.name}`;

            console.log(`Idioma alterado para: ${newLang.name} (${langCode})`);

            if (window.renderHomePage) {
                window.renderHomePage(langCode);
            }
            if (window.renderAboutPage) {
                window.renderAboutPage(langCode);
            }

            if (window.renderWorkPage) {
                window.renderWorkPage(langCode);
            }

            updateNavLanguage(langCode);

        } else {
            console.error('Código de idioma desconhecido:', langCode);
        }
    }

    langOptions.forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            const selectedLang = this.getAttribute('data-lang');
            switchLanguage(selectedLang);
        });
    });

});