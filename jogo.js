let frames = 0;

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


// fundo
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
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
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

            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2;
            const movimentacao = chao.x - movimentoDoChao;


            chao.x = movimentacao % repeteEm;
        },


        desenha() {

            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.x, chao.y,
                chao.largura, chao.altura,
            );

            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura,
            );
        },
    };
    return chao;
}

function fazColisao(flappyBird, chao) {

    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if (flappyBirdY >= chaoY) {
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
        pulo: 4.6,
        pula() {
            flappyBird.velocidade = - flappyBird.pulo;
        },
        gravidade: 0.25,
        velocidade: 0,


        atualiza() {

            if (fazColisao(flappyBird, globais.chao)) {

                updateTela(Telas.GAME_OVER);
                return;
            }

            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0, }, // asa pra cima
            { spriteX: 0, spriteY: 26, }, // asa no meio 
            { spriteX: 0, spriteY: 52, }, // asa pra baixo

        ],

        frameAtual: 0,


        atualizaOFrameAtual() {
            const intervaloDeFrames = 10;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if (passouOIntervalo) {
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao
            }
        },


        desenha() {


            flappyBird.atualizaOFrameAtual();
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];

            contexto.drawImage(
                sprites,
                this.spriteX, this.spriteY, // Sprite X, Sprite Y
                this.largura, this.altura, // Tamanho do recorte na sprite
                this.x, this.y,
                this.largura, this.altura,
            );

        }

    }


    return flappyBird;
}


// mensagemGetReady
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
            mensagemGetReady.sX, mensagemGetReady.sY,
            mensagemGetReady.w, mensagemGetReady.h,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.w, mensagemGetReady.h
        );
    }
}


// mensagemGameOver
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
            mensagemGameOver.sX, mensagemGameOver.sY,
            mensagemGameOver.w, mensagemGameOver.h,
            mensagemGameOver.x, mensagemGameOver.y,
            mensagemGameOver.w, mensagemGameOver.h
        );
    }
}



// Canos

function criaCanos() {

    const canos = {

        largura: 52,
        altura: 400,

        chao: {
            spriteX: 0,
            spriteY: 169,
        },

        ceu: {
            spriteX: 52,
            spriteY: 169,
        },

        espaco: 80,




        desenha() {
            canos.pares.forEach(function (par) {
                const yRandom = par.y;
                const espacamentoEntreCanos = 90;

                const canoCeuX = par.x;
                const canoCeuY = yRandom;

                // Cano de cime 
                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura,
                )

                // Cano
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;


                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,
                )

                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                }
            })
        },


        temColisaoComOFlappyBird(par) {
            const cabecaDoFlappy = globais.flappyBird.y;
            const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

            if ((globais.flappyBird.x + globais.flappyBird.largura) >= par.x) {

                if (cabecaDoFlappy <= par.canoCeu.y) {

                    return true;
                }


                if (peDoFlappy >= par.canoChao.y) {
                    return true;
                }

            }

            return false;
        },
        pares: [],



        atualiza() {
            const passou100Frames = frames % 100 === 0;

            if (passou100Frames) {
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                });
            }



            canos.pares.forEach(function (par) {
                par.x = par.x - 2;

                if (canos.temColisaoComOFlappyBird(par)) {
                    updateTela(Telas.GAME_OVER);
                }

                if (par.x + canos.largura <= 0) {
                    canos.pares.shift();
                }
            });

        }
    }

    return canos;
}



function criaPlacar() {

    const placar = {
        pontuacao: 0,


        desenha() {
            contexto.font = '35px "VT323"';
            contexto.textAlign = 'right';
            contexto.fillStyle = 'white';
            contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);
        },


        atualiza() {

            const intervaloDeFrames = 20;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if (passouOIntervalo) {

                placar.pontuacao = placar.pontuacao + 1;
            }
        }
    }


    return placar;
}



// Telas

const globais = {};
let telaAtiva = {};


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

        // Texto dentro do placar
        const scoreX = mensagemGameOver.x + 170; // ajuste horizontal
        const scoreY = mensagemGameOver.y + 115; // ajuste vertical

        contexto.font = '25px "VT323"';
        contexto.fillStyle = 'white';
        contexto.textAlign = 'right';
        contexto.fillText(`${globais.placar.pontuacao}`, scoreX, scoreY
            
        );
    },


    atualiza() {

    },


    click() {
        updateTela(Telas.inicio);
    }
}




function loop() {

    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1;
    requestAnimationFrame(loop);

}


window.addEventListener('click', function () {

    if (telaAtiva.click) {
        telaAtiva.click();
    }

});

updateTela(Telas.inicio);

loop();