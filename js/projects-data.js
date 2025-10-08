// projects-data.js
export const projects = [
    {
        id: 'alfa-mito-sbk',
        title: 'Alfa Mito SBK',
        shortDesc: 'Landing page para recolha de leads campanha Alfa Romeo',
        fullDesc: 'Full detailed description here with more context, challenges, solutions, etc.',
        thumbnail: 'assets/imgs/alfamitoSbk_th.jpg',
        images: [
            'assets/imgs/alfamitoSbk_1.jpg',
            'assets/imgs/alfamitoSbk_2.jpg',
            'assets/imgs/alfamitoSbk_3.jpg'
        ],
        video: 'assets/videos/alfamito.mp4', // optional
        stack: ['Html', 'Php', 'Flourish'],
        link: 'https://example.com', // optional
        github: 'https://github.com/...' // optional
    },
    {
        id: 'ambre-solaire',
        title: 'Ambre Solaire',
        shortDesc: 'Pós-produção audiovisual para aplicação rótulo embalagem Garnier',
        fullDesc: 'Detailed description...',
        thumbnail: 'assets/imgs/ambresolaire-bruma_seca_th.jpg',
        images: ['assets/imgs/ambresolaire_1.jpg'],
        stack: ['Premiere Pro', 'Illustrator', 'Photoshop'],
    },
        {
        id: 'meo-kids',
        title: 'MEO Kids',
        shortDesc: 'Animação digital para promover novo interface MEO Kids',
        fullDesc: 'Full detailed description here with more context, challenges, solutions, etc.',
        thumbnail: 'assets/imgs/argumentarioRegressoAulas_th.jpg',
        images: [        ],
        video: true,
        videoType: 'vimeo', // or 'youtube'
        videoId: '251079431',
        stack: ['Photoshop', 'After effects'],
    },
    // ... more projects
];