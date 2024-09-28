document.addEventListener("DOMContentLoaded", function () {
  const ratingButton = document.getElementById('rating');
  const ratingWindow = document.getElementById('rating-window');
  const closeRatingButton = document.getElementById('close-rating');
  const ratingList = document.getElementById('rating-list');

  const seeds = [
    { type: 'carrot', img: 'images/carrot.png' },
    { type: 'pumpkin', img: 'images/pumpkin.png' },
    { type: 'cucumber', img: 'images/cucumber.png' },
    { type: 'tomato', img: 'images/tomato.png' },
    { type: 'pepper', img: 'images/pepper.png' }
  ];

  // Функция для генерации случайного количества семян
  function getRandomQuantity() {
    return Math.floor(Math.random() * (25 - 5 + 1)) + 5;
  }

  // Функция для генерации списка семян
  function generateRatingList() {
    ratingList.innerHTML = ''; // Очищаем список перед добавлением новых элементов

    for (let i = 0; i < 10; i++) {
      const seed = seeds[Math.floor(Math.random() * seeds.length)];
      const quantity = getRandomQuantity();

      const ratingItem = document.createElement('div');
      ratingItem.classList.add('rating-item');

      const seedImage = document.createElement('img');
      seedImage.src = seed.img;

      const seedQuantity = document.createElement('span');
      seedQuantity.textContent = `x${quantity}`;

      const acceptButton = document.createElement('button');
      acceptButton.textContent = 'Принять';
      acceptButton.addEventListener('click', () => {
        ratingItem.style.opacity = 0.5;
        acceptButton.disabled = true;
        declineButton.disabled = true;
      });

      const declineButton = document.createElement('button');
      declineButton.textContent = 'Отклонить';
      declineButton.addEventListener('click', () => {
        ratingItem.remove();
      });

      ratingItem.appendChild(seedImage);
      ratingItem.appendChild(seedQuantity);
      ratingItem.appendChild(acceptButton);
      ratingItem.appendChild(declineButton);

      ratingList.appendChild(ratingItem);
    }
  }

  // Открытие окна рейтинга
  ratingButton.addEventListener('click', () => {
    ratingWindow.style.display = 'block';
    generateRatingList();
  });

  // Закрытие окна рейтинга
  closeRatingButton.addEventListener('click', () => {
    ratingWindow.style.display = 'none';
  });
});
