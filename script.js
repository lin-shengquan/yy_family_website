document.addEventListener('DOMContentLoaded', function() {
    const cover = document.getElementById('cover');
    const enterBtn = document.getElementById('enter-btn');
    const navLinks = document.querySelectorAll('.nav-links a');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const memberPhotos = document.querySelectorAll('.member-photo img');
    const momentItems = document.querySelectorAll('.moment-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    let starCount = 0;
    const starSymbols = ['⭐', '✨', '🌟', '💫', '⭐'];
    
    function createStar(x, y) {
        const star = document.createElement('div');
        star.className = 'star';
        star.textContent = starSymbols[Math.floor(Math.random() * starSymbols.length)];
        star.style.left = x + 'px';
        star.style.top = y + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance + 20;
        
        star.style.setProperty('--tx', tx + 'px');
        star.style.setProperty('--ty', ty + 'px');
        star.style.fontSize = (12 + Math.random() * 12) + 'px';
        
        document.body.appendChild(star);
        starCount++;
        
        star.addEventListener('animationend', function() {
            star.remove();
            starCount--;
        });
    }
    
    let lastMoveTime = 0;
    document.addEventListener('mousemove', function(e) {
        const now = Date.now();
        if (now - lastMoveTime > 30) {
            createStar(e.clientX, e.clientY);
            lastMoveTime = now;
        }
    });

    enterBtn.addEventListener('click', function() {
        cover.classList.add('hidden');
    });

    cover.addEventListener('click', function(e) {
        if (e.target === cover) {
            cover.classList.add('hidden');
        }
    });

    const mainContent = document.getElementById('main-content');
    const sections = document.querySelectorAll('.section');
    let currentSection = 0;
    let isScrolling = false;

    function scrollToSection(index) {
        if (isScrolling) return;
        if (index < 0 || index >= sections.length) return;

        isScrolling = true;
        currentSection = index;

        const scrollAmount = index * window.innerHeight;
        mainContent.scrollTo({
            top: scrollAmount,
            behavior: 'smooth'
        });

        setTimeout(() => {
            isScrolling = false;
        }, 600);
    }

    mainContent.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (isScrolling) return;

        if (e.deltaY > 0) {
            scrollToSection(currentSection + 1);
        } else {
            scrollToSection(currentSection - 1);
        }
    }, { passive: false });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const sectionIndex = Array.from(sections).indexOf(targetElement);
                if (sectionIndex !== -1) {
                    scrollToSection(sectionIndex);
                }
            }
        });
    });

    const scrollIndicators = document.querySelectorAll('.scroll-indicator');
    scrollIndicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            scrollToSection(currentSection + 1);
        });
    });

    function openLightbox(src, caption) {
        lightboxImg.src = src;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
        mainContent.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        mainContent.style.overflow = '';
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.querySelector('.gallery-overlay span').textContent;
            openLightbox(img.src, caption);
        });
    });

    memberPhotos.forEach(photo => {
        photo.addEventListener('click', function() {
            const caption = this.alt;
            openLightbox(this.src, caption);
        });
    });

    momentItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            openLightbox(img.src, '温馨时刻');
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    const logo = document.querySelector('.logo');
    logo.addEventListener('click', function() {
        scrollToSection(0);
    });

    const gameGrid = document.getElementById('game-grid');
    const gameTask = document.getElementById('game-task');
    const gameSteps = document.getElementById('game-steps');
    const gameStatus = document.getElementById('game-status');
    const restartBtn = document.getElementById('restart-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const gameWin = document.getElementById('game-win');

    const MAZE_WIDTH = 15;
    const MAZE_HEIGHT = 15;
    const CELL_SIZE = 35;

    let maze = [];
    let playerPos = { x: 0, y: 0 };
    let endPos = { x: MAZE_WIDTH - 1, y: MAZE_HEIGHT - 1 };
    let steps = 0;
    let isGameOver = false;

    function generateMaze() {
        maze = [];
        for (let y = 0; y < MAZE_HEIGHT; y++) {
            maze[y] = [];
            for (let x = 0; x < MAZE_WIDTH; x++) {
                maze[y][x] = 1;
            }
        }

        const stack = [];
        const startX = 0;
        const startY = 0;
        maze[startY][startX] = 0;
        stack.push({ x: startX, y: startY });

        const directions = [
            { dx: 0, dy: -2 },
            { dx: 0, dy: 2 },
            { dx: -2, dy: 0 },
            { dx: 2, dy: 0 }
        ];

        while (stack.length > 0) {
            const current = stack[stack.length - 1];
            const neighbors = [];

            for (const dir of directions) {
                const nx = current.x + dir.dx;
                const ny = current.y + dir.dy;

                if (nx >= 0 && nx < MAZE_WIDTH && ny >= 0 && ny < MAZE_HEIGHT && maze[ny][nx] === 1) {
                    neighbors.push({ x: nx, y: ny, dx: dir.dx / 2, dy: dir.dy / 2 });
                }
            }

            if (neighbors.length > 0) {
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                maze[current.y + next.dy][current.x + next.dx] = 0;
                maze[next.y][next.x] = 0;
                stack.push({ x: next.x, y: next.y });
            } else {
                stack.pop();
            }
        }

        maze[endPos.y][endPos.x] = 0;

        const deadEndWalls = [];
        for (let y = 1; y < MAZE_HEIGHT - 1; y++) {
            for (let x = 1; x < MAZE_WIDTH - 1; x++) {
                if (maze[y][x] === 1) {
                    let adjacentPaths = 0;
                    if (maze[y - 1][x] === 0) adjacentPaths++;
                    if (maze[y + 1][x] === 0) adjacentPaths++;
                    if (maze[y][x - 1] === 0) adjacentPaths++;
                    if (maze[y][x + 1] === 0) adjacentPaths++;

                    if (adjacentPaths === 1) {
                        deadEndWalls.push({ x, y });
                    }
                }
            }
        }

        const deadEndCount = Math.floor(deadEndWalls.length * 0.4);
        for (let i = 0; i < deadEndCount; i++) {
            if (deadEndWalls.length === 0) break;
            const idx = Math.floor(Math.random() * deadEndWalls.length);
            const wall = deadEndWalls[idx];
            maze[wall.y][wall.x] = 0;

            const sideDirs = [
                { dx: 0, dy: -1 },
                { dx: 0, dy: 1 },
                { dx: -1, dy: 0 },
                { dx: 1, dy: 0 }
            ];

            for (const dir of sideDirs) {
                const nx = wall.x + dir.dx;
                const ny = wall.y + dir.dy;
                if (nx > 0 && nx < MAZE_WIDTH - 1 && ny > 0 && ny < MAZE_HEIGHT - 1 && maze[ny][nx] === 1) {
                    const adjacentCount = [
                        maze[ny - 1]?.[nx] === 0,
                        maze[ny + 1]?.[nx] === 0,
                        maze[ny]?.[nx - 1] === 0,
                        maze[ny]?.[nx + 1] === 0
                    ].filter(Boolean).length;

                    if (adjacentCount <= 1) {
                        maze[ny][nx] = 0;
                        break;
                    }
                }
            }

            deadEndWalls.splice(idx, 1);
        }
    }

    function renderMaze() {
        gameGrid.innerHTML = '';
        gameGrid.style.gridTemplateColumns = `repeat(${MAZE_WIDTH}, ${CELL_SIZE}px)`;
        gameGrid.style.gridTemplateRows = `repeat(${MAZE_HEIGHT}, ${CELL_SIZE}px)`;

        for (let y = 0; y < MAZE_HEIGHT; y++) {
            for (let x = 0; x < MAZE_WIDTH; x++) {
                const cell = document.createElement('div');
                cell.className = 'game-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.style.width = CELL_SIZE + 'px';
                cell.style.height = CELL_SIZE + 'px';

                if (maze[y][x] === 1) {
                    cell.classList.add('wall');
                }

                if (x === 0 && y === 0) {
                    cell.classList.add('start');
                }

                if (x === endPos.x && y === endPos.y) {
                    cell.classList.add('end');
                    const target = document.createElement('div');
                    target.className = 'game-target';
                    const fatherImg = document.createElement('img');
                    fatherImg.src = '相片/father.png';
                    fatherImg.alt = '爸爸';
                    const motherImg = document.createElement('img');
                    motherImg.src = '相片/mother.png';
                    motherImg.alt = '妈妈';
                    target.appendChild(fatherImg);
                    target.appendChild(motherImg);
                    cell.appendChild(target);
                }

                gameGrid.appendChild(cell);
            }
        }

        renderPlayer();
    }

    function renderPlayer() {
        const existingChars = gameGrid.querySelectorAll('.game-character');
        existingChars.forEach(c => c.remove());

        const player = document.createElement('div');
        player.className = 'game-character';
        const img = document.createElement('img');
        img.src = '相片/me.png';
        img.alt = '我';
        player.appendChild(img);

        const cell = gameGrid.querySelector(`[data-x="${playerPos.x}"][data-y="${playerPos.y}"]`);
        if (cell) {
            cell.appendChild(player);
        }
    }

    function movePlayer(dx, dy) {
        if (isGameOver) return;

        const newX = playerPos.x + dx;
        const newY = playerPos.y + dy;

        if (newX < 0 || newX >= MAZE_WIDTH || newY < 0 || newY >= MAZE_HEIGHT) {
            return;
        }

        if (maze[newY][newX] === 1) {
            return;
        }

        playerPos = { x: newX, y: newY };
        steps++;
        updateSteps();

        checkCell(newX, newY);
        renderPlayer();
    }

    function checkCell(x, y) {
        if (x === endPos.x && y === endPos.y) {
            isGameOver = true;
            gameStatus.textContent = '状态：找到爸爸妈妈！';
            gameStatus.style.color = '#66bb6a';
            gameWin.classList.add('active');
        }
    }

    function updateSteps() {
        gameSteps.textContent = steps;
    }

    function initGame() {
        generateMaze();
        playerPos = { x: 0, y: 0 };
        steps = 0;
        isGameOver = false;
        
        updateSteps();
        gameStatus.textContent = '状态：探索中';
        gameStatus.style.color = '#66bb6a';
        gameWin.classList.remove('active');
        
        renderMaze();
    }

    document.addEventListener('keydown', function(e) {
        if (isGameOver) return;
        
        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                movePlayer(0, -1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                movePlayer(0, 1);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                movePlayer(-1, 0);
                break;
            case 'ArrowRight':
                e.preventDefault();
                movePlayer(1, 0);
                break;
        }
    });

    restartBtn.addEventListener('click', initGame);
    playAgainBtn.addEventListener('click', initGame);
    tryAgainBtn.addEventListener('click', initGame);

    initGame();
});