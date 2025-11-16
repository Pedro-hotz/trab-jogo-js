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
    contexto.fillRect(0,0, canvas.width, canvas.height)         // preeenche de azul, atrás das imagens, a tela do começo ao final 

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

const chao = {                          // Objeto chão 
  spriteX: 0,                           // posição x para fazer o recorte do chão que está na file "sprites.png"                                 
  spriteY: 610,                         // posição y ==
  largura: 224,
  altura: 112,
  x: 0,
  y: canvas.height - 112,               // Faz o chão ficar em baixo, grudado na borda do fim
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
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      (chao.x + chao.largura), chao.y,          // mesma lógica que o plano de fundo 
      chao.largura, chao.altura,
    );
  },
};


const flappyBird = {                           // Objeto flappy bird 
  spriteX: 0,
  spriteY: 0,
  largura: 33,
  altura: 24,
  x: 10,
  y: 50,
  desenha: function desenha() {                 // função do objeto, para não ficar repetitivo     
    contexto.drawImage(
      sprites,
      flappyBird.spriteX, flappyBird.spriteY, // Sprite X, Sprite Y
      flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
      flappyBird.x, flappyBird.y,
      flappyBird.largura, flappyBird.altura,
    );
  }
}

function loop() {
  // tem que ter essa ordem pois, precisa desenhar o fundo primeiro, depois o chão e para assim o personagem ser desenhado e aparecer na tela
  planoDeFundo.desenha();
  chao.desenha();
  flappyBird.desenha();

  flappyBird.y = flappyBird.y + 1; // faz o flappy bird cair 

  requestAnimationFrame(loop);
}

loop();                                         // Faz o jogo rodar 