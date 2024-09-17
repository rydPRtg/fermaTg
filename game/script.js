document.addEventListener("DOMContentLoaded", function() {
  let activeButton = null; // Текущая активная кнопка
  let selectedPlot = null; // Грядка, на которую будет посажено семя

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

  // Функция для показа уведомления
  function showNotification(message) {
    notification.textContent = message;
    notification.style.display = 'block';

    setTimeout(() => {
      notification.style.display = 'none';
    }, 2000);
  }

  // Активация кнопки
  function activateButton(button) {
    deactivateActiveButton();
    button.classList.add('active');
    activeButton = button;
  }

  // Деактивация текущей кнопки
  function deactivateActiveButton() {
    if (activeButton) {
      activeButton.classList.remove('active');
      activeButton = null;
    }
  }

  // Посадка семени
  function plantSeed(plot, seedType) {
    const seed = seedData[seedType];

    // Добавляем изображение семени
    const seedImage = document.createElement('div');
    seedImage.classList.add('seed-image');
    seedImage.style.backgroundImage = `url('images/${seedType}.png')`;
    plot.appendChild(seedImage);

    // Добавляем таймер
    const timer = document.createElement('div');
    timer.classList.add('timer');
    plot.appendChild(timer);

    // Добавляем галочку
    const checkmark = document.createElement('div');
    checkmark.classList.add('checkmark');
    seedImage.appendChild(checkmark);

    let timeLeft = seed.growthTime / 1000;
    const interval = setInterval(() => {
      timeLeft -= 1;
      timer.textContent = `${timeLeft}s`;

      if (timeLeft <= 0) {
        clearInterval(interval);
        seedImage.style.backgroundImage = `url('${seed.matureImage}')`;
        seedImage.classList.add('mature'); // Отмечаем растение как созревшее
        timer.textContent = ''; // Очищаем таймер
      }
    }, 1000);
  }

  // Обработка кликов на грядки
  squares.forEach(square => {
    square.addEventListener('click', () => {
      // Если активирована кнопка "Обработать"
      if (activeButton === processButton && !square.classList.contains('clicked')) {
        square.classList.add('clicked'); // Обрабатываем грядку
        showNotification('Грядка обработана!');
      }
      // Если активирована кнопка "Посадить"
      else if (activeButton === plantButton) {
        if (!square.classList.contains('clicked')) {
          showNotification('Сначала обработайте грядку.'); // Грядка не обработана
        } else if (square.querySelector('.seed-image')) {
          showNotification('Уже растёт.'); // Уже посажено растение
        } else {
          selectedPlot = square;
          seedSelection.style.display = 'block'; // Открываем выбор семян
        }
      }
      // Если активирована кнопка "Собрать урожай"
      else if (activeButton === harvestButton && square.querySelector('.seed-image')) {
        const seedImage = square.querySelector('.seed-image');
        const timer = square.querySelector('.timer');
        if (seedImage.classList.contains('mature')) {
          seedImage.remove(); // Убираем созревшее растение
          timer.remove(); // Убираем таймер
          square.classList.remove('clicked'); // Грядка снова становится необработанной
          showNotification('Урожай собран!');
        } else {
          showNotification('Растение ещё не созрело.');
        }
      }
    });
  });

  // Обработка кнопок управления
  processButton.addEventListener('click', () => {
    activateButton(processButton); // Активируем кнопку "Обработать"
  });

  plantButton.addEventListener('click', () => {
    activateButton(plantButton); // Активируем кнопку "Посадить"
  });

  harvestButton.addEventListener('click', () => {
    activateButton(harvestButton); // Активируем кнопку "Собрать урожай"
  });

  // Выбор семени и посадка
  document.querySelectorAll('.seed').forEach(seedButton => {
    seedButton.addEventListener('click', () => {
      const seedType = seedButton.getAttribute('data-seed');
      if (selectedPlot) {
        plantSeed(selectedPlot, seedType);
        seedSelection.style.display = 'none'; // Закрываем окно выбора семян
        selectedPlot = null;
      }
    });
  });
});
