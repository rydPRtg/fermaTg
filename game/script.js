document.addEventListener("DOMContentLoaded", function() {
  let coins = 0;
  let experience = 0;
  let level = 1;
  let activeButton = null;
  let selectedPlot = null;
  const experiencePerLevel = 100;
  const maxLevel = 999;

  const coinCounter = document.getElementById('coin-counter');
  const experienceCounter = document.getElementById('experience');
  const levelCounter = document.getElementById('level');
  const processButton = document.getElementById('process');
  const plantButton = document.getElementById('plant');
  const harvestButton = document.getElementById('harvest');
  const seedSelection = document.getElementById('seed-selection');
  const notification = document.getElementById('notification');
  const squares = document.querySelectorAll('.square');

  const seedData = {
    carrot: { growthTime: 30000, experience: 25, matureImage: 'images/mature_carrot.png' },
    pumpkin: { growthTime: 45000, experience: 35, matureImage: 'images/mature_pumpkin.png' },
    cucumber: { growthTime: 50000, experience: 40, matureImage: 'images/mature_cucumber.png' },
    tomato: { growthTime: 60000, experience: 50, matureImage: 'images/mature_tomato.png' },
    pepper: { growthTime: 120000, experience: 70, matureImage: 'images/mature_pepper.png' }
  };

  // Функция для обновления монет
  function updateCoinsDisplay() {
    coinCounter.textContent = `Монеты: ${coins}`;
  }

  // Функция для обновления опыта и уровня
  function updateExperience(amount) {
    experience += amount;
    const experienceForNextLevel = level * experiencePerLevel;

    while (experience >= experienceForNextLevel && level < maxLevel) {
      experience -= experienceForNextLevel;
      level += 1;
    }

    levelCounter.textContent = `Уровень: ${level}`;
    experienceCounter.textContent = `Опыт: ${experience} / ${level * experiencePerLevel}`;
  }

  // Функция для показа уведомлений
  function showNotification(message) {
    notification.textContent = message;
    notification.classList.remove('hidden');
    notification.style.display = 'block';

    setTimeout(() => {
      notification.style.display = 'none';
    }, 2000);
  }

  // Отключение предыдущей активной кнопки
  function deactivateActiveButton() {
    if (activeButton) {
      activeButton.classList.remove('active');
      activeButton = null;
    }
  }

  // Активация кнопки "Обработать"
  processButton.addEventListener('click', () => {
    deactivateActiveButton();
    processButton.classList.add('active');
    activeButton = processButton;
  });

  // Активация кнопки "Посадить"
  plantButton.addEventListener('click', () => {
    deactivateActiveButton();
    plantButton.classList.add('active');
    activeButton = plantButton;
  });

  // Активация кнопки "Собрать"
  harvestButton.addEventListener('click', () => {
    deactivateActiveButton();
    harvestButton.classList.add('active');
    activeButton = harvestButton;
  });

  // Обработка выбора семени
  document.querySelectorAll('.seed').forEach(seedButton => {
    seedButton.addEventListener('click', () => {
      const seedType = seedButton.getAttribute('data-seed');
      if (selectedPlot) {
        plantSeed(selectedPlot, seedType);
      }
      seedSelection.classList.add('hidden');  // Скрываем окно после выбора семени
      selectedPlot = null;
    });
  });

  // Посадка семени на грядку
  function plantSeed(plot, seedType) {
    const seed = seedData[seedType];
    plot.classList.add('growing');
    plot.style.backgroundImage = `url('images/${seedType}.png')`;
    plot.dataset.seed = seedType;

    const timer = document.createElement('div');
    timer.classList.add('timer');
    plot.appendChild(timer);
    let timeLeft = seed.growthTime / 1000;

    const interval = setInterval(() => {
      timeLeft -= 1;
      timer.textContent = `${timeLeft}s`;

      if (timeLeft <= 0) {
        clearInterval(interval);
        plot.classList.remove('growing');
        plot.classList.add('mature');
        plot.style.backgroundImage = `url('${seed.matureImage}')`;
        timer.textContent = 'Созрело';
      }
    }, 1000);
  }

  // Сбор урожая
  function harvest(plot) {
    const seedType = plot.dataset.seed;
    if (!plot.classList.contains('mature')) {
      showNotification('Растение ещё не созрело.');
      return;
    }

    const seed = seedData[seedType];
    plot.classList.remove('mature');
    plot.style.backgroundImage = '';
    plot.dataset.seed = '';
    plot.classList.remove('clicked');
    updateExperience(seed.experience);
  }

  // Добавляем обработчики для каждой грядки
  squares.forEach(square => {
    square.addEventListener('click', () => {
      if (activeButton === processButton && !square.classList.contains('clicked')) {
        square.classList.add('clicked');
      } else if (activeButton === plantButton) {
        if (!square.classList.contains('clicked')) {
          showNotification('Сначала обработайте грядку.');
        } else if (square.classList.contains('growing') || square.classList.contains('mature')) {
          showNotification('Уже растёт.');
        } else {
          selectedPlot = square;
          seedSelection.classList.remove('hidden');  // Окно выбора семян открывается только при выборе обработанной грядки
        }
      } else if (activeButton === harvestButton) {
        if (square.classList.contains('mature')) {
          harvest(square);
        } else {
          showNotification('Растение ещё не созрело.');
        }
      }
    });
  });

  // Скрываем окно выбора семян при старте игры
  seedSelection.classList.add('hidden');

  updateCoinsDisplay();
  updateExperience(0);
});
