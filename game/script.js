document.addEventListener("DOMContentLoaded", function() {
  let activeButton = null;
  let selectedPlot = null;
  let seedInventory = { carrot: 0, pumpkin: 0, cucumber: 0, tomato: 0, pepper: 0 }; // Инвентарь семян
  let seedPrices = { carrot: 10, pumpkin: 15, cucumber: 20, tomato: 25, pepper: 30 }; // Стоимость семян

  const processButton = document.getElementById('process');
  const plantButton = document.getElementById('plant');
  const harvestButton = document.getElementById('harvest');
  const storageButton = document.getElementById('storage');
  const shopButton = document.getElementById('shop');
  const seedSelection = document.getElementById('seed-selection');
  const notification = document.getElementById('notification');
  const squares = document.querySelectorAll('.square');
  const storageWindow = document.getElementById('storage-window');
  const closeStorageButton = document.getElementById('close-storage');
  const inventoryList = document.getElementById('inventory-list');
  const shopWindow = document.getElementById('shop-window');
  const buyList = document.getElementById('buy-list');
  const sellList = document.getElementById('sell-list');
  const closeShopButton = document.getElementById('close-shop');
  let coins = 100; // Стартовое количество монет
  const coinCounter = document.getElementById('coin-counter');

  const seedData = {
    carrot: { growthTime: 30000, experience: 25, matureImage: 'images/mature_carrot.png' },
    pumpkin: { growthTime: 45000, experience: 35, matureImage: 'images/mature_pumpkin.png' },
    cucumber: { growthTime: 50000, experience: 40, matureImage: 'images/mature_cucumber.png' },
    tomato: { growthTime: 60000, experience: 50, matureImage: 'images/mature_tomato.png' },
    pepper: { growthTime: 120000, experience: 70, matureImage: 'images/mature_pepper.png' }
  };

  const plotImages = {
    unprocessed: 'images/unprocessed_plot.png',
    processed: 'images/processed_plot.png'
  };

  function showNotification(message) {
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 2000);
  }

  function activateButton(button) {
    deactivateActiveButton();
    button.classList.add('active');
    activeButton = button;
  }

  function deactivateActiveButton() {
    if (activeButton) {
      activeButton.classList.remove('active');
      activeButton = null;
    }
  }

  function updateStorage() {
    inventoryList.innerHTML = '';
    for (let seedType in seedInventory) {
      if (seedInventory[seedType] > 0) {
        const listItem = document.createElement('div');
        listItem.classList.add('inventory-item');

        const seedImage = document.createElement('img');
        seedImage.src = `images/${seedType}.png`;
        seedImage.classList.add('seed-icon');

        const seedCount = document.createElement('span');
        seedCount.textContent = `x${seedInventory[seedType]}`;

        listItem.appendChild(seedImage);
        listItem.appendChild(seedCount);
        inventoryList.appendChild(listItem);
      }
    }
  }

  function updateCoins() {
    coinCounter.textContent = `Монеты: ${coins}`;
  }

  function updateShop() {
    buyList.innerHTML = '';
    sellList.innerHTML = '';

    for (let seedType in seedData) {
      // Купить
      const buyItem = document.createElement('div');
      buyItem.classList.add('shop-item');

      const seedImage = document.createElement('img');
      seedImage.src = `images/${seedType}.png`;
      seedImage.classList.add('seed-icon');

      const seedPrice = document.createElement('span');
      seedPrice.textContent = `Цена: ${seedPrices[seedType]}`;

      const buyButton = document.createElement('button');
      buyButton.textContent = 'Купить';
      buyButton.addEventListener('click', () => {
        if (coins >= seedPrices[seedType]) {
          coins -= seedPrices[seedType];
          seedInventory[seedType] += 1;
          updateCoins();
          updateStorage();
          updateShop();
          showNotification(`${seedType} куплено!`);
        } else {
          showNotification('Недостаточно монет!');
        }
      });

      buyItem.appendChild(seedImage);
      buyItem.appendChild(seedPrice);
      buyItem.appendChild(buyButton);
      buyList.appendChild(buyItem);

      // Продать
      if (seedInventory[seedType] > 0) {
        const sellItem = document.createElement('div');
        sellItem.classList.add('shop-item');

        const sellSeedImage = document.createElement('img');
        sellSeedImage.src = `images/${seedType}.png`;
        sellSeedImage.classList.add('seed-icon');

        const sellInput = document.createElement('input');
        sellInput.type = 'number';
        sellInput.min = 1;
        sellInput.max = seedInventory[seedType];
        sellInput.value = 1;

        const sellButton = document.createElement('button');
        sellButton.textContent = 'Продать';
        sellButton.addEventListener('click', () => {
          const sellAmount = parseInt(sellInput.value);
          if (sellAmount <= seedInventory[seedType]) {
            seedInventory[seedType] -= sellAmount;
            coins += seedPrices[seedType] * sellAmount;
            updateCoins();
            updateStorage();
            updateShop();
            showNotification(`${sellAmount} ${seedType} продано!`);
          }
        });

        sellItem.appendChild(sellSeedImage);
        sellItem.appendChild(sellInput);
        sellItem.appendChild(sellButton);
        sellList.appendChild(sellItem);
      }
    }
  }

  function plantSeed(plot, seedType) {
    if (seedInventory[seedType] <= 0) {
      showNotification('У вас нет этого семени.');
      return;
    }

    seedInventory[seedType] -= 1;
    updateStorage();

    const seed = seedData[seedType];
    const seedImage = document.createElement('div');
    seedImage.classList.add('seed-image');
    seedImage.style.backgroundImage = `url('images/${seedType}.png')`;
    plot.appendChild(seedImage);

    const timer = document.createElement('div');
    timer.classList.add('timer');
    plot.appendChild(timer);

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
        seedImage.classList.add('mature');
        timer.textContent = '';
      }
    }, 1000);
  }

  squares.forEach(square => {
    square.style.backgroundImage = `url('${plotImages.unprocessed}')`;

    square.addEventListener('click', () => {
      if (activeButton === processButton && !square.classList.contains('clicked')) {
        square.classList.add('clicked');
        square.style.backgroundImage = `url('${plotImages.processed}')`;
        showNotification('Грядка обработана!');
      } else if (activeButton === plantButton) {
        if (!square.classList.contains('clicked')) {
          showNotification('Сначала обработайте грядку.');
        } else if (square.querySelector('.seed-image')) {
          showNotification('Уже растёт.');
        } else {
          selectedPlot = square;
          seedSelection.style.display = 'block';
          updateSeedSelection();
        }
      } else if (activeButton === harvestButton && square.querySelector('.seed-image')) {
        const seedImage = square.querySelector('.seed-image');
        const timer = square.querySelector('.timer');
        if (seedImage.classList.contains('mature')) {
          const seedType = seedImage.style.backgroundImage.match(/images\/(.+)\.png/)[1];
          seedInventory[seedType] += 2; // Добавляем 2 семени на склад
          updateStorage();

          seedImage.remove();
          timer.remove();
          square.classList.remove('clicked');
          square.style.backgroundImage = `url('${plotImages.unprocessed}')`;
          showNotification('Урожай собран!');
        } else {
          showNotification('Растение ещё не созрело.');
        }
      }
    });
  });

  function updateSeedSelection() {
    const seedButtons = document.querySelectorAll('.seed');
    seedButtons.forEach(seedButton => {
      const seedType = seedButton.getAttribute('data-seed');
      if (seedInventory[seedType] > 0) {
        seedButton.style.display = 'block';
      } else {
        seedButton.style.display = 'none';
      }
    });
  }

  processButton.addEventListener('click', () => {
    activateButton(processButton);
  });

  plantButton.addEventListener('click', () => {
    activateButton(plantButton);
  });

  harvestButton.addEventListener('click', () => {
    activateButton(harvestButton);
  });

  storageButton.addEventListener('click', () => {
    storageWindow.style.display = 'block';
    updateStorage();
  });

  closeStorageButton.addEventListener('click', () => {
    storageWindow.style.display = 'none';
  });

  shopButton.addEventListener('click', () => {
    shopWindow.style.display = 'block';
    updateShop();
  });

  closeShopButton.addEventListener('click', () => {
    shopWindow.style.display = 'none';
  });

  document.querySelectorAll('.seed').forEach(seedButton => {
    seedButton.addEventListener('click', () => {
      const seedType = seedButton.getAttribute('data-seed');
      if (selectedPlot) {
        plantSeed(selectedPlot, seedType);
        seedSelection.style.display = 'none';
        selectedPlot = null;
      }
    });
  });

  updateCoins();
});
