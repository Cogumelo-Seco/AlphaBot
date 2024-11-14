module.exports = {
    witch: [
        {
            type: 'regenerate',
            name: 'Poção de vida pequena',
            name_EN: 'Small life potion',
            description: 'Recupera 10 pontos de vida',
            description_EN: 'Restores 10 life points',
            cost: 10,
            amount: 1,
            power: {
                life: 10,
                mana: 0,
            }
        },
        {
            type: 'regenerate',
            name: 'Poção de mana pequena',
            name_EN: 'Small mana potion',
            description: 'Recupera 10 pontos de mana',
            description_EN: 'Restores 10 mana points',
            cost: 10,
            amount: 1,
            power: {
                life: 0,
                mana: 10,
            }
        },
        {
            type: 'regenerate',
            name: 'Poção de vida e mana pequena',
            name_EN: 'Small life and mana potion',
            description: 'Recupera 10 pontos de vida e 10 pontos de mana',
            description_EN: 'Restores 10 health and 10 mana',
            cost: 20,
            amount: 1,
            power: {
                life: 10,
                mana: 10,
            }
        },
        {
            type: 'regenerate',
            name: 'Poção de vida média',
            name_EN: 'Medium life potion',
            description: 'Recupera 100 pontos de vida',
            description_EN: 'Restores 100 life points',
            cost: 95,
            amount: 1,
            power: {
                life: 100,
                mana: 0,
            }
        },
        {
            type: 'regenerate',
            name: 'Poção de mana média',
            name_EN: 'Medium mana potion',
            description: 'Recupera 100 pontos de mana',
            description_EN: 'Restores 100 mana points',
            cost: 95,
            amount: 1,
            power: {
                life: 0,
                mana: 100,
            }
        },
        {
            type: 'regenerate',
            name: 'Poção de vida e mana média',
            name_EN: 'Medium life and mana potion',
            description: 'Recupera 100 pontos de vida e 100 pontos de mana',
            description_EN: 'Restores 100 health and 100 mana',
            cost: 190,
            amount: 1,
            power: {
                life: 100,
                mana: 100,
            }
        },
        {
            type: 'regenerate',
            name: 'Poção de vida grande',
            name_EN: 'Big life potion',
            description: 'Recupera 200 pontos de vida',
            description_EN: 'Restores 200 life points',
            cost: 185,
            amount: 1,
            power: {
                life: 200,
                mana: 0,
            }
        },
        {
            type: 'regenerate',
            name: 'Poção de mana grande',
            name_EN: 'Big mana potion',
            description: 'Recupera 200 pontos de mana',
            description_EN: 'Restores 200 mana points',
            cost: 185,
            amount: 1,
            power: {
                life: 0,
                mana: 200,
            }
        },
        {
            type: 'regenerate',
            name: 'Poção de vida e mana grande',
            name_EN: 'Big life and mana potion',
            description: 'Recupera 200 pontos de vida e 200 pontos de mana',
            description_EN: 'Restores 200 health and 200 mana',
            cost: 370,
            amount: 1,
            power: {
                life: 200,
                mana: 200,
            }
        },
    ],
    blacksmith: [
        /* ------ 1 ------ */
        {
            type: 'tool',
            name: 'Espada simples',
            name_EN: 'Simple sword',
            description: 'Adiciona mais 10 pontos de força',
            description_EN: 'Adds 10 more strength points',
            cost: 500,
            category: 1,
            requiredItems: [
                {
                    name: 'Presa de Wolf vampire',
                    name_EN: 'Wolf vampire fang',
                    amount: 1
                },
                {
                    name: 'Garra de Gárgula',
                    name_EN: 'Gárgula claw',
                    amount: 2
                }
            ],
            power: {
                attack: 10
            }
        },
        {
            type: 'defense',
            name: 'Armadura de malha simples',
            name_EN: 'Mesh armor simple',
            description: 'Adiciona mais 100 pontos de vida total',
            description_EN: 'Adds another 100 total life points',
            cost: 500,
            category: 1,
            requiredItems: [
                {
                    name: 'Dente de Gárgula',
                    name_EN: 'Gárgula tooth',
                    amount: 1
                },
                {
                    name: 'Pele de Slideshow golem',
                    name_EN: 'Slideshow golem Skin',
                    amount: 2
                }
            ],
            power: {
                totalLife: 100,
                totalMana: 0
            }
        },
        {
            type: 'magic',
            name: 'Ritual de aumento de mana simples',
            name_EN: 'Simple mana boosting ritual',
            description: 'Adiciona mais 100 pontos de mana total',
            description_EN: 'Adds another 100 total mana points',
            cost: 500,
            category: 1,
            requiredItems: [
                {
                    name: 'Olho de Slideshow golem',
                    name_EN: 'Slideshow golem eye',
                    amount: 1
                },
                {
                    name: 'Pata de Wolf vampire',
                    name_EN: 'Wolf Vampire paw',
                    amount: 2
                }
            ],
            power: {
                totalLife: 0,
                totalMana: 100
            }
        },
        /* ------ 2 ------ */
        {
            type: 'tool',
            name: 'Espada de batalha',
            name_EN: 'Battle sword',
            description: 'Adiciona mais 20 pontos de força',
            description_EN: 'Adds 20 more strength points',
            cost: 1500,
            category: 2,
            requiredItems: [
                {
                    name: 'Mão de Obama',
                    name_EN: 'Obama\'s hand',
                    amount: 3
                },
                {
                    name: 'Dente de Apostolos',
                    name_EN: 'Apostles\' Tooth',
                    amount: 6
                }
            ],
            power: {
                attack: 20
            }
        },
        {
            type: 'defense',
            name: 'Armadura de diamante',
            name_EN: 'Diamond armor',
            description: 'Adiciona mais 250 pontos de vida total',
            description_EN: 'Adds another 250 total life points',
            cost: 1000,
            category: 2,
            requiredItems: [
                {
                    name: 'Mão de Obama Suprema',
                    name_EN: 'Supreme Obama\'s Hand',
                    amount: 3
                },
                {
                    name: 'Pele de Apostolos',
                    name_EN: 'Apostolos skin',
                    amount: 4
                }
            ],
            power: {
                totalLife: 250,
                totalMana: 0
            }
        },
        {
            type: 'magic',
            name: 'Ritual de aumento de mana complexo',
            name_EN: 'Complex mana boosting ritual',
            description: 'Adiciona mais 300 pontos de mana total',
            description_EN: 'Adds another 300 total mana points',
            cost: 1000,
            category: 2,
            requiredItems: [
                {
                    name: 'Mão de Obama Suprema',
                    name_EN: 'Supreme Obama\'s Hand',
                    amount: 2
                },
                {
                    name: 'Mão de Obama',
                    name_EN: 'Obama\'s hand',
                    amount: 2
                },
                {
                    name: 'Mana de Apostolos',
                    name_EN: 'Mana of Apostolos',
                    amount: 3
                }
            ],
            power: {
                totalLife: 0,
                totalMana: 300
            }
        }
    ]
}