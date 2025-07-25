let move_speed = 3,
    gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

let bird_dy = 0; // Bird vertical speed

function flapBird() {
    if (game_state !== 'Play') return;
    img.src = 'images/Bird-2.png';
    bird_dy = -7.6;
    setTimeout(() => {
        img.src = 'images/Bird.png';
    }, 100);
}

function startGame() {
    document.querySelectorAll('.pipe_sprite').forEach(e => e.remove());
    img.style.display = 'block';
    bird.style.top = '40vh';
    game_state = 'Play';
    message.innerHTML = '';
    score_title.innerHTML = 'Score : ';
    score_val.innerHTML = '0';
    message.classList.remove('messageStyle');
    play();
}

// Controls: Start game & flap
document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter') && game_state !== 'Play') {
        startGame();
    }
    if ((e.key === 'ArrowUp' || e.key === ' ') && game_state === 'Play') {
        flapBird();
    }
});

// Touch controls for mobile
document.addEventListener('touchstart', () => {
    if (game_state !== 'Play') {
        startGame();
    } else {
        flapBird();
    }
});

function play() {
    function move() {
        if (game_state !== 'Play') return;

        let pipe_sprites = document.querySelectorAll('.pipe_sprite');
        pipe_sprites.forEach((element) => {
            let pipe_rect = element.getBoundingClientRect();
            let bird_rect = bird.getBoundingClientRect();

            // Remove pipes that move out of screen
            if (pipe_rect.right <= 0) {
                element.remove();
            } else {
                // Collision detection
                if (
                    bird_rect.left < pipe_rect.left + pipe_rect.width &&
                    bird_rect.left + bird_rect.width > pipe_rect.left &&
                    bird_rect.top < pipe_rect.top + pipe_rect.height &&
                    bird_rect.top + bird_rect.height > pipe_rect.top
                ) {
                    gameOver();
                    return;
                } else {
                    if (
                        pipe_rect.right < bird_rect.left &&
                        pipe_rect.right + move_speed >= bird_rect.left &&
                        element.increase_score === '1'
                    ) {
                        score_val.innerHTML = +score_val.innerHTML + 1;
                        sound_point.play();
                        element.increase_score = '0'; // Avoid double score
                    }
                    element.style.left = pipe_rect.left - move_speed + 'px';
                }
            }
        });

        requestAnimationFrame(move);
    }

    requestAnimationFrame(move);

    function applyGravity() {
        if (game_state !== 'Play') return;

        let bird_rect = bird.getBoundingClientRect();

        bird_dy += gravity;
        bird.style.top = bird_rect.top + bird_dy + 'px';

        // Update bird_props for next check
        bird_props = bird.getBoundingClientRect();

        // Check if bird hits ground or goes off top
        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            gameOver();
            return;
        }

        requestAnimationFrame(applyGravity);
    }

    requestAnimationFrame(applyGravity);

    let pipe_separation = 0;
    let pipe_gap = 35;

    function createPipe() {
        if (game_state !== 'Play') return;

        if (pipe_separation > 115) {
            pipe_separation = 0;
            let pipe_pos = Math.floor(Math.random() * 43) + 8;

            // Top pipe
            let pipe_top = document.createElement('div');
            pipe_top.className = 'pipe_sprite';
            pipe_top.style.top = pipe_pos - 70 + 'vh';
            pipe_top.style.left = '100vw';

            document.body.appendChild(pipe_top);

            // Bottom pipe
            let pipe_bottom = document.createElement('div');
            pipe_bottom.className = 'pipe_sprite';
            pipe_bottom.style.top = pipe_pos + pipe_gap + 'vh';
            pipe_bottom.style.left = '100vw';
            pipe_bottom.increase_score = '1';

            document.body.appendChild(pipe_bottom);
        }

        pipe_separation++;
        requestAnimationFrame(createPipe);
    }

    requestAnimationFrame(createPipe);
}

function gameOver() {
    game_state = 'End';
    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter or Tap to Restart';
    message.classList.add('messageStyle');
    img.style.display = 'none';
    sound_die.play();
}
