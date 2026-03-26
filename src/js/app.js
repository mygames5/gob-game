import goblinImage from '../img/goblin.png';

// выносим все настройки в начало, чтобы не искать их по всему коду
const BOARD_SIZE = 4;
const INTERVAL_MS = 1000;
const MAX_MISSES = 5;

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.game-container');
    
    // если забыли добавить див в html — сразу узнаем об этом в консоли
    if (!container) {
        throw new Error('Контейнер .game-container не найден. Проверь index.html!');
    }

    const deadEl = document.getElementById('dead-count');
    const lostEl = document.getElementById('lost-count');

    let dead = 0;
    let lost = 0;
    let currentPosition = null;
    let clickedInThisTurn = false;
    let gameIntervalId = null; // тут будем хранить айдишник таймера

    const cells = [];

    // лепим сетку через современный .append()
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        container.append(cell);
        cells.push(cell);
    }

    const goblin = document.createElement('img');
    goblin.src = goblinImage;
    goblin.classList.add('goblin');

    // вынес логику прыжка в отдельную функцию, так чище
    const moveGoblin = () => {
        // если в прошлом раунде проспали — лови минус в карму
        if (currentPosition !== null && !clickedInThisTurn) {
            lost++;
            if (lostEl) lostEl.textContent = lost;
        }

        // если промахов слишком много — сворачиваем лавочку
        if (lost >= MAX_MISSES) {
            clearInterval(gameIntervalId); // убиваем таймер, чтобы не жрал память
            alert('Гоблины победили! Попробуй еще раз.');
            location.reload();
            return;
        }

        clickedInThisTurn = false;
        let newPosition;
        
        // ищем новую клетку, отличную от текущей
        do {
            newPosition = Math.floor(Math.random() * cells.length);
        } while (newPosition === currentPosition);

        cells[newPosition].append(goblin);
        currentPosition = newPosition;
    };

    // ловим клик именно по гоблину
    goblin.addEventListener('click', (e) => {
        if (!clickedInThisTurn) {
            dead++;
            if (deadEl) deadEl.textContent = dead;
            clickedInThisTurn = true;
            goblin.remove(); // убираем его сразу, типа "убили"
        }
        e.stopPropagation(); // чтобы клик не улетел на ячейку
    });

    // запускаем шарманку и сохраняем айди для очистки
    gameIntervalId = setInterval(moveGoblin, INTERVAL_MS);
    
    // запускаем первый раз сразу, не дожидаясь первой секунды интервала
    moveGoblin();
});