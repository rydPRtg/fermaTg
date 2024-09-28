document.addEventListener("DOMContentLoaded", function() {
  const ratingWindow = document.getElementById('rating-window');
  const closeRatingWindowButton = document.getElementById('close-rating-window');
  const ratingList = document.getElementById('rating-list');

  function openRatingWindow() {
    ratingList.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const seedType = getRandomSeedType();
      const seedCount = getRandomSeedCount();

      const ratingItem = document.createElement('div');
      ratingItem.classList.add('rating-item');

      const seedImage = document.createElement('img');
      seedImage.src = `images/${seedType}.png`;

      const seedCountSpan = document.createElement('span');
      seedCountSpan.textContent = `x${seedCount}`;

      const acceptButton = document.createElement('button');
      acceptButton.textContent = 'Принять';
      acceptButton.addEventListener('click', () => {
        acceptSeed(seedType, seedCount);
        ratingItem.remove();
      });

      const rejectButton = document.createElement('button');
      rejectButton.textContent = 'Отклонить';
      rejectButton.addEventListener('click', () => {
        ratingItem.remove();
      });

      ratingItem.appendChild(seedImage);
      ratingItem.appendChild(seedCountSpan);
      ratingItem.appendChild(acceptButton);
      ratingItem.appendChild(rejectButton);

      ratingList.appendChild(ratingItem);
    }

    ratingWindow.style.display = 'block';
  }

  function getRandomSeedType() {
    const seedTypes = ['carrot', 'pumpkin', 'cucumber', 'tomato', 'pepper'];
    return seedTypes[Math.floor(Math.random() * seedTypes.length)];
  }

  function getRandomSeedCount() {
    return Math.floor(Math.random() * (25 - 5 + 1)) + 5;
  }

  function acceptSeed(seedType, seedCount) {
    seedInventory[seedType] += seedCount;
    updateStorage();
    showNotification(`${seedCount} ${seedType} добавлено на склад!`);
  }

  closeRatingWindowButton.addEventListener('click', () => {
    ratingWindow.style.display = 'none';
  });

  // Добавляем обработчик события для кнопки "Рейтинг"
  const ratingButton = document.querySelector('.button:nth-child(6)');
  ratingButton.addEventListener('click', openRatingWindow);
});
