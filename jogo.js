console.log('[DevSoutinho] Flappy Bird');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


// [Plano de Fundo]
const planoDeFundo = {
    spriteX: 390,                             // posição x para fazer o recorte do chão que está na file "sprites.png" 
    spriteY: 0,                               // posição y == 
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height)         // preeenche de azul, atrás das imagens, a tela do começo ao final 

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,          // preenche o plano de fundo na tela inteira 
            planoDeFundo.largura, planoDeFundo.altura,
        );
    },
};

function criarChao(){
    const chao = {                          // Objeto chão 
    spriteX: 0,                           // posição x para fazer o recorte do chão que está na file "sprites.png"                                 
    spriteY: 610,                         // posição y ==
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,               // Faz o chão ficar em baixo, grudado na borda do fim

    atualiza() {
        const movimento = 1 
        const repeteEm = chao.largura / 2
        const movimentocao = chao.x - movimento 
        chao.x = movimentocao % repeteEm; 

    }, 
    desenha: function desenha() {         // Função do objeto que faz o aparecer na posição certa
        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            chao.x, chao.y,
            chao.largura, chao.altura,
        );

        contexto.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.largura, this.altura,
            (this.x + this.largura), chao.y,          // mesma lógica que o plano de fundo 
            this.largura, this.altura,
        );
    },
};
return chao;
}

function createFlappy() {

    const flappyBird = {                           // Objeto flappy bird 
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,
        velocidade: 0,
        gravidade: 0.25,

        subir() {
            this.velocidade = -this.pulo;
        },


        atualiza() {

            if (colisao(flappyBird, globais.chao)) {

                updateTela(telas.inicio)
                return 
            }

            this.velocidade += this.gravidade; // a velocidade aumenta a cada loop chamado
            this.y += this.velocidade// faz o flappy bird cair

        },

        desenha() {                 // função do objeto, para não ficar repetitivo     
            contexto.drawImage(
                sprites,
                this.spriteX, this.spriteY, // Sprite X, Sprite Y
                this.largura, this.altura, // Tamanho do recorte na sprite
                this.x, this.y,
                this.largura, this.altura,
            );
        }

    };

    return flappyBird;
}



function colisao(flap, chao) { 
    const flappyBirdY = flap.y + flap.altura;
    const chaoY = chao.y;

    return flappyBirdY >= chaoY;
}

const messagemInicio = {                          // Objeto messagem que aparece no inicio  
    spriteX: 134,                                   // posição x para fazer o recorte do chão que está na file "sprites.png"                                 
    spriteY: 0,                                      // posição y ==
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,               // Faz o chão ficar em baixo, grudado na borda do fim
    y: 50,
    desenha() {         // Função do objeto que faz o aparecer na posição certa
        contexto.drawImage(
            sprites,
            messagemInicio.spriteX, messagemInicio.spriteY,
            messagemInicio.largura, messagemInicio.altura,
            messagemInicio.x, messagemInicio.y,
            messagemInicio.largura, messagemInicio.altura,
        );
    }
}

let activeTela = {}

function updateTela(novaTela) {
    activeTela = novaTela;

    if (activeTela.inicializa) {
        activeTela.inicializa();
    }
};


const globais = {};

const telas = {
    inicio: {
        inicializa() {
            
            globais.chao = criarChao()
            globais.flappyBird = createFlappy()

        
        },

        desenha() {
            planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();

            messagemInicio.desenha();
        },
        atualiza() {
            globais.chao.atualiza()
        },
        click() {
            updateTela(telas.jogo)
        }
    }
};


telas.jogo = {

    // tem que ter essa ordem pois, precisa desenhar o fundo primeiro, depois o chão e para assim o personagem ser desenhado e aparecer na tela
    // Só que antes de gerar os frames, ele atualiza os valores do personagem 
    desenha() {
        planoDeFundo.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
    },
    atualiza() {
        globais.flappyBird.atualiza() // faz o flappy bird cair
    },

    click() {
        globais.flappyBird.subir();
    }
}



function loop() {                       // função main

    activeTela.desenha();            // Chama a função do objeto / tela que está ativa 
    activeTela.atualiza();           // ==




    requestAnimationFrame(loop);          // função ajuda a criar os frames da melhor forma 
}


window.addEventListener('click', function () {    // Toda vez que ouver um click na tela , muda a tela de inicio, para a tela do jogo
    // ou seja, chama a função updateTela() com o valor do objeto tela.jogo
    if (activeTela.click) {
        activeTela.click();
    }
});


updateTela(telas.inicio)                        // muda o valor da tela que está ativa
loop();                                         // Faz o jogo rodar 