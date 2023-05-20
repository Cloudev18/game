document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
  
    // Variables du jeu 
    const paddleWidth = 100;
    const paddleHeight = 10;
    const brickRowCount = 5;
    const brickColumnCount = 8;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;
    const ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;
    let bricks = [];
  
    // Créer les briques
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
  
    // Gestion des touches pressées
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
  
    // Détection de la touche enfoncée
    function keyDownHandler(event) {
      if (event.key === 'Right' || event.key === 'ArrowRight') {
        rightPressed = true;
      } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
        leftPressed = true;
      }
    }
  
    // Détection de la touche relâchée
    function keyUpHandler(event) {
      if (event.key === 'Right' || event.key === 'ArrowRight') {
        rightPressed = false;
      } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
        leftPressed = false;
      }
    }
  
    // Dessiner la balle
    function drawBall() {
      context.beginPath();
      context.arc(x, y, ballRadius, 0, Math.PI * 2);
      context.fillStyle = '#0095DD';
      context.fill();
      context.closePath();
    }
  
    // Dessiner la raquette
    function drawPaddle() {
      context.beginPath();
      context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
      context.fillStyle = '#0095DD';
      context.fill();
      context.closePath();
    }
  
    // Dessiner les briques
    function drawBricks() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
            const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            context.beginPath();
            context.rect(brickX, brickY, brickWidth, brickHeight);
            context.fillStyle = '#0095DD';
            context.fill();
            context.closePath();
          }
        }
      }
    }
  
    // Gérer la collision entre la balle et les briques
    function collisionDetection() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const brick = bricks[c][r];
          if (brick.status === 1) {
            if (
              x > brick.x &&
              x < brick.x + brickWidth &&
              y > brick.y &&
              y < brick.y + brickHeight
            ) {
              dy = -dy; // Inverser la direction de la balle
              brick.status = 0; // Marquer la brique comme détruite
            }
          }
        }
      }
    }
  
    // Dessiner le jeu
    function draw() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();
  
      // Déplacement de la balle
      x += dx;
      y += dy;
  
      // Rebond sur les bords gauche et droit
      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }
  
      // Rebond sur le bord supérieur
      if (y + dy < ballRadius) {
        dy = -dy;
      } else if (y + dy > canvas.height - ballRadius) {
        // Rebond sur la raquette ou fin de partie
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
        } else {
          alert('Partie terminée');
          document.location.reload();
        }
      }
  
      // Déplacement de la raquette
      if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
      } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
      }
  
      requestAnimationFrame(draw);
    }
  
    // Gérer les interactions
    function mouseMoveHandler(event) {
      const relativeX = event.clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    }
  
    document.addEventListener('mousemove', mouseMoveHandler);
  
    draw();
  });
  
