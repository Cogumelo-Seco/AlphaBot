const Monsters = [
    [
        {
            name: 'Gárgula',
            life: 50,
            attack: 5,
            image: 'http://pm1.narvii.com/6803/d6e076950775a5efefc7de5114360c66bf370f37v2_00.jpg',
            drops: [ 
                {
                    name: 'Dente de Gárgula',
                    name_EN: 'Gárgula tooth',
                    amount: 1,
                    price: 15,
                },
                {
                    name: 'Garra de Gárgula',
                    name_EN: 'Gárgula claw',
                    amount: 1,
                    price: 20,
                } 
            ]
        },
        {
            name: 'Slideshow golem',
            life: 70,
            attack: 10,
            image: 'https://cdn.discordapp.com/attachments/766021715695632396/907799402691854416/Z.png',
            drops: [ 
                {
                    name: 'Olho de Slideshow golem',
                    name_EN: 'Slideshow golem eye',
                    amount: 1,
                    price: 18,
                },
                {
                    name: 'Pele de Slideshow golem',
                    name_EN: 'Slideshow golem Skin',
                    amount: 1,
                    price: 21,
                } 
            ]
        },
        {
            name: 'Wolf vampire',
            life: 100,
            attack: 3,
            image: 'https://cdn.discordapp.com/attachments/766021715695632396/907799881211605032/images.png',
            drops: [ 
                {
                    name: 'Presa de Wolf vampire',
                    name_EN: 'Wolf vampire fang',
                    amount: 1,
                    price: 22,
                },
                {
                    name: 'Pata de Wolf vampire',
                    name_EN: 'Wolf Vampire paw',
                    amount: 1,
                    price: 23,
                } 
            ]
        },
    ],
    [
        {
            name: 'Apostolos',
            life: 300,
            attack: 60,
            image: 'https://cdn.discordapp.com/attachments/766021715695632396/907799503384477697/180.png',
            drops: [ 
                {
                    name: 'Mana de Apostolos',
                    name_EN: 'Mana of Apostolos',
                    amount: 1,
                    price: 50,
                },
                {
                    name: 'Pele de Apostolos',
                    name_EN: 'Apostolos skin',
                    amount: 1,
                    price: 43,
                },
                {
                    name: 'Dente de Apostolos',
                    name_EN: 'Apostles\' Tooth',
                    amount: 2,
                    price: 30,
                } 
            ]
        },
        {
            name: 'Obama',
            life: 700,
            attack: 20,
            image: 'https://cdn.discordapp.com/attachments/807074443867193384/907811366541361162/unknown.png',
            drops: [ 
                {
                    name: 'Mão de Obama',
                    name_EN: 'Obama\'s hand',
                    amount: 2,
                    price: 50,
                },
                {
                    name: 'Mão de Obama Suprema',
                    name_EN: 'Supreme Obama\'s Hand',
                    amount: 1,
                    price: 60,
                }
            ]
        }
    ],
    [
        {
            name: 'Mamaco',
            life: 1000,
            attack: 100,
            image: 'https://cdn.discordapp.com/attachments/766021715695632396/907799565695057962/unknown.png',
            drops: [ 
                {
                    name: 'Pele de Mamaco',
                    name_EN: 'Mamaco skin',
                    amount: 1,
                    price: 90,
                }
            ]
        },
        {
            name: 'Night knight',
            life: 800,
            attack: 120,
            image: 'https://cdn.discordapp.com/attachments/766021715695632396/907799705671598150/9d0c1659a46495b33635ddbd8a93b7473dc417e7_00.png',
            drops: [ 
                {
                    name: 'Espada de Night knight',
                    name_EN: 'Night knight\'s sword',
                    amount: 1,
                    price: 89,
                },
                {
                    name: 'Capacete de Night knight',
                    name_EN: 'Night knight\'s helmet',
                    amount: 1,
                    price: 88,
                }
            ]
        },
    ],
    [
        {
            name: 'Zel',
            life: 1300,
            attack: 480,
            image: 'https://cdn.discordapp.com/attachments/766021715695632396/908123907893108756/Z.png',
            drops: [ 
                {
                    name: 'Barba sagrada',
                    name_EN: 'Sacred beard',
                    amount: 1,
                    price: 110,
                }
            ]
        },
        {
            name: 'Sapo',
            life: 1500,
            attack: 450,
            image: 'https://cdn.discordapp.com/attachments/766021715695632396/908123380073508944/ataaa.png',
            drops: [ 
                {
                    name: 'Sapo frito',
                    name_EN: 'Fried Sapo',
                    amount: 1,
                    price: 110,
                }
            ]
        },
        {
            name: 'Cogumelo',
            life: 1313,
            attack: 500,
            image: 'https://cdn.discordapp.com/attachments/807074443867193384/907811853760077885/Cogu_pixelado_Roxo.png',
            drops: [ 
                {
                    type: 'regenerate',
                    name: 'Pó de Cogumelo',
                    name_EN: 'Cogumelo powder',
                    amount: 1,
                    usable: true,
                    description: 'Cheire um pó e recupere 500 de vida e mana',
                    description_EN: 'Smell some powder and recover 500 health and mana',
                    power: {
                        life: 500,
                        mana: 500
                    }
                }
            ]
        },
    ],
    [
        {
            name: 'Slan',
            life: 10000,
            attack: 1000,
            image: 'https://cdn.discordapp.com/attachments/766021715695632396/907799624125915136/latest.png',
            drops: [ 
                {
                    name: 'Cabelo de Slan',
                    name_EN: 'Slan\'s hair',
                    amount: 1,
                    price: 150,
                }
            ]
        },
        {
            name: 'Ednaldo Pereira',
            life: 10500,
            attack: 1500,
            image: 'https://tenor.com/view/ednaldo-pereira-gif-23303208',
            drops: [ 
                {
                    name: 'Óculos de Ednaldo Pereira',
                    name_EN: 'Ednaldo Pereira\'s Glasses',
                    amount: 1,
                    price: 155,
                }
            ]
        }
    ] 
]

module.exports = Monsters;