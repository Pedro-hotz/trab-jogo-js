let frames = 0;



const sprites = new Image();
sprites.src = './sprites.png';

// Pega o canvas no html e configurando o contexto 2D
const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');



const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,

    desenha() {
        

        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height)

        contexto.drawImage(

            sprites,

            this.spriteX, this.spriteY,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura,
        );

        

        contexto.drawImage(

            sprites,
            this.spriteX, this.spriteY,
            this.largura, this.altura,
            (this.x + this.largura), this.y,
            this.largura, this.altura,
        );
    },
};




function criaChao() {

    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,

        
        
        atualiza() {

            // faz a img do chao repetir sem parar
            const movimentoDoChao = 1;
            const repeteEm = this.largura / 2;
            const movimentacao = this.x - movimentoDoChao;

            
            this.x = movimentacao % repeteEm;
        },

        

        desenha() {

            contexto.drawImage(

                sprites,
                this.spriteX, this.spriteY,
                this.largura, this.altura,
                this.x, this.y,

                this.largura, this.altura,
            );

            contexto.drawImage(
                sprites,
                this.spriteX, this.spriteY,
                this.largura, this.altura,
                (this.x + this.largura), this.y,
                this.largura, this.altura,
            );
        },
    };
    return chao;
}




function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if (flappyBirdY >= chaoY) { // se for, ele baateu e morreu
        return true;
    }
    return false;
}



function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.2,

        pula() {

            flappyBird.velocidade = - flappyBird.pulo;
        },

        gravidade: 0.25,
        velocidade: 0,


        atualiza() {
            // aqui acontece a fisica e gravidade 

            if (fazColisao(flappyBird, globais.chao)) {
                updateTela(Telas.GAME_OVER);
                return;
            }

            // Física
            flappyBird.velocidade += flappyBird.gravidade;
            flappyBird.y += flappyBird.velocidade;
        },



        movimentos: [
            { spriteX: 0, spriteY: 0 },  // asa pra cima
            { spriteX: 0, spriteY: 26 }, // asa no meio
            { spriteX: 0, spriteY: 52 }, // asa pra baixo
        ],
        frameAtual: 0,


        atualizaOFrameAtual() {

            const intervalo = 10;
            const mudarFrame = frames % intervalo === 0;

            if (mudarFrame) {
                this.frameAtual = (this.frameAtual + 1) % this.movimentos.length;
            }
        },

        desenha() {

            this.atualizaOFrameAtual();
            const { spriteX, spriteY } = this.movimentos[this.frameAtual];

            contexto.drawImage(
                sprites,
                spriteX, spriteY,
                this.largura, this.altura,
                this.x, this.y,
                this.largura, this.altura,
            );
        }
    };

    return flappyBird;
}




const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,

    desenha() {

        contexto.drawImage(
            sprites,
            this.sX, this.sY,
            this.w, this.h,
            this.x, this.y,
            this.w, this.h
        );
    }
};





const mensagemGameOver = {

    sX: 134,
    sY: 153,
    w: 226,
    h: 200,
    x: (canvas.width / 2) - 226 / 2,
    y: 50,

    desenha() {

        contexto.drawImage(
            sprites,
            this.sX, this.sY,
            this.w, this.h,
            this.x, this.y,
            this.w, this.h
        );
    }
};



function criaCanos() {

    const canos = {     
           largura: 52,
        altura: 400,

        // cano de baixo
        chao: { spriteX: 0, spriteY: 169 },

        // Caano de cima
        ceu: { spriteX: 52, spriteY: 169 },

        espaco: 80, // espaço entre canos

        pares: [],

        desenha() {
            this.pares.forEach((par) => {
                const yRandom = par.y;
                const espacamentoEntreCanos = 90;

                // Cano de cima
                contexto.drawImage(
                    sprites,
                    this.ceu.spriteX, this.ceu.spriteY,
                    this.largura, this.altura,
                    par.x, yRandom,
                    this.largura, this.altura,
                );

                // Cano de baixo
                const canoChaoY = this.altura + espacamentoEntreCanos + yRandom;

                contexto.drawImage(
                    
                    sprites,
                    this.chao.spriteX, this.chao.spriteY,
                    this.largura, this.altura,
                    par.x, canoChaoY,
                    this.largura, this.altura,
                );

                par.canoCeu = { x: par.x, y: this.altura + yRandom };
                par.canoChao = { x: par.x, y: canoChaoY };
            });
        },

        // se bater nos canos, pega aqui
        temColisaoComOFlappyBird(par) {
            const flappy = globais.flappyBird;
            const cabeca = flappy.y;
            const pe = flappy.y + flappy.altura;

            // Se encostar no chão
            if ((flappy.x + flappy.largura) >= par.x) {
                if (cabeca <= par.canoCeu.y) return true;
                if (pe >= par.canoChao.y) return true;
            }

            return false;
        },

        // Muda a posição dos canos em frames diferentes
        atualiza() {
            const gerarNovoCano = frames % 100 === 0;

            if (gerarNovoCano) {

                this.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                });
            }

            this.pares.forEach((par) => {
                par.x -= 2;

                if (this.temColisaoComOFlappyBird(par)) {

                    updateTela(Telas.GAME_OVER);
                }

                if (par.x + this.largura <= 0) {

                    this.pares.shift();
                }
            });
        }
    };

    return canos;
}




function criaPlacar() {

    const placar = {
        pontuacao: 0,

        desenha() {
            contexto.font = '35px "VT323"';
            contexto.textAlign = 'right';
            contexto.fillStyle = 'white';
            contexto.fillText(`${this.pontuacao}`, canvas.width - 10, 35);

        },


        atualiza() {         //Atualiza pontos

            const intervalo = 20;
            if (frames % intervalo === 0) {
                this.pontuacao++;
            }
        }
    };

    return placar;
}



const globais = {}; // objetos usados em todas as telas

let telaAtiva = {}; // tela atual


function updateTela(novaTela) {
    telaAtiva = novaTela;

    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}



const Telas = {
    inicio: {

        inicializa() {

            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },

        desenha() {

            planoDeFundo.desenha();
            globais.flappyBird.desenha();

            globais.chao.desenha();
            mensagemGetReady.desenha();
        },

        click() {

            updateTela(Telas.jogo);
        },

        atualiza() {
            
            globais.chao.atualiza();
        }
    }
};




Telas.jogo = {

    inicializa() {

        globais.placar = criaPlacar();
    },

    desenha() {

        planoDeFundo.desenha();
        globais.canos.desenha();
        globais.chao.desenha();

        globais.flappyBird.desenha();

        globais.placar.desenha();
    },

    click() {

        globais.flappyBird.pula();


    },

    atualiza() {

        globais.canos.atualiza();
        globais.chao.atualiza();
        globais.flappyBird.atualiza();
        globais.placar.atualiza();

    }
};



Telas.GAME_OVER = {
    desenha() {
        mensagemGameOver.desenha();

        // Placar dentro do quadro do GAME OVER
        const scoreX = mensagemGameOver.x + 170;
        const scoreY = mensagemGameOver.y + 115;

        contexto.font = '25px "VT323"';
        contexto.fillStyle = 'white';
        contexto.textAlign = 'right';
       contexto.fillText(`${globais.placar.pontuacao}`, scoreX, scoreY);  // mostra a pontuação
    },

    click() {

        updateTela(Telas.inicio);
    },

    atualiza() {
    }
};



// função main
function loop() {
        telaAtiva.desenha();                 // desenha a tela atual
    telaAtiva.atualiza();                // atualiza a lógica da tela

    frames++;

    requestAnimationFrame(loop);        // faz rodar os frames melhor
}



window.addEventListener('click', () => {// toda vez que clica capta o click
    if (telaAtiva.click) {

        telaAtiva.click();
    }
});


updateTela(Telas.inicio);

loop();   // faz o jogo rodar
