// projects-data.js
export const projects = [
        {
        id: 'blackjack25',
        title: 'Blackjack 25',
        shortDesc: 'This project is a simple implementation of a card game called Blackjack, with a twist: the goal is to get as close to 25 points as possible without going over.',
        fullDesc: 'This project is a simple implementation of a card game called Blackjack, with a twist: the goal is to get as close to 25 points as possible without going over. The project was developed as a school assignment to practice fundamental concepts in JavaScript and the frontend was implemented with the framework bootstrap.',
        thumbnail: 'assets/imgs/blackjack25_th.webp',
        stack: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
        links: {
            demo: 'https://jnevesaraujo.github.io/Blackjack25',
            github: 'https://github.com/jnevesaraujo/Blackjack25'
           // live: 'https://livesite.com' // optional
        },
        media: {
            images: [
                {
                    src: 'assets/imgs/blackjack/Blackjack25_desktopHome.webp',
                    layout: 'full-width',
                    order: 1
                },
                {
                    src: 'assets/imgs/blackjack/Blackjack25_desktopPlayerWon.webp',
                    layout: 'thumbnail',
                    order: 2
                },
                {
                    src: 'assets/imgs/blackjack/Blackjack25_homescreenMobile.webp',
                    layout: 'thumbnail',
                    order: 3
                },
                {
                    src: 'assets/imgs/blackjack/Blackjack25_dealerWon.webp',
                    layout: 'thumbnail',
                    order: 4
                }
            ]
        }
    },
    {
        id: 'alfa-mito-sbk',
        title: 'Alfa Mito SBK',
        shortDesc: 'Landing page para recolha de leads campanha Alfa Romeo',
        fullDesc: 'Full detailed description here with more context, challenges, solutions, etc.',
        thumbnail: 'assets/imgs/alfamitoSbk_th.jpg',
        stack: ['HTML', 'PHP', 'Flourish'],
        link: 'https://example.com', // optional
        github: 'https://github.com/...', // optional
        media: {
            images: [
                {
                    src: 'assets/imgs/alfamitoSbk_1.jpg',
                    layout: 'full-width',
                    order: 1
                },
                                {
                    src: 'assets/imgs/alfamitoSbk_2.jpg',
                    layout: 'full-width',
                    order: 2
                },
                                {
                    src: 'assets/imgs/alfamitoSbk_3.jpg',
                    layout: 'full-width',
                    order: 3
                }
            ]
        }
    },
    {
        id: 'ambre-solaire',
        title: 'Ambre Solaire',
        shortDesc: 'Pós-produção audiovisual para aplicação rótulo embalagem Garnier',
        fullDesc: 'Detailed description...',
        thumbnail: 'assets/imgs/ambresolaire-bruma_seca_th.jpg',
        stack: ['Premiere Pro', 'Illustrator', 'Photoshop'],
        media: {
            videos: [
                {
                    type: 'youtube',
                    id: 'DHOIKyM1bTs',
                    title: 'Final Product',
                    layout: 'full-width', // Custom class for styling
                    order: 1
                },
                {
                    type: 'youtube',
                    id: 'TMSd0rC59vA',
                    title: 'Process Video 1',
                    layout: 'thumbnail',
                    order: 2
                },
                {
                    type: 'youtube',
                    id: 'fKf7P5caQnc',
                    title: 'Process Video 2',
                    layout: 'thumbnail',
                    order: 3
                }
            ],
            images: [
                {
                    src: 'ambresolaire-bruma_seca_th.jpg',
                    layout: 'full-width',
                    order: 4
                }
            ]
        }
    },
        {
        id: 'meo-kids',
        title: 'MEO Kids',
        shortDesc: 'Animação digital para promover novo interface MEO Kids',
        fullDesc: 'Full detailed description here with more context, challenges, solutions, etc.',
        thumbnail: 'assets/imgs/argumentarioRegressoAulas_th.jpg',
        stack: ['Photoshop', 'After effects'],
        media: {
            videos: [
                {
                    type: 'vimeo',
                    id: '251079431',
                    title: 'Final Product',
                    layout: 'featured', // Custom class for styling
                    order: 1
                }
            ]
        }
    },
    // ... more projects
];