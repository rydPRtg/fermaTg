document.addEventListener("DOMContentLoaded", function() {
  let coins = 0;  // Локальное хранение монет
  const coinCounter = document.getElementById('coin-counter');
  const squares = document.querySelectorAll('.square');  // Получаем все квадраты

  // Функция для обновления отображения монет
  function updateCoinsDisplay() {
    coinCounter.textContent = `Монеты: ${coins}`;
  }

  // Добавляем обработчики для каждого квадрата
  squares.forEach(square => {
    square.addEventListener('click', () => {
      square.classList.toggle('clicked');  // Меняем цвет квадрата
      coins += 1;  // Увеличиваем количество монет
      updateCoinsDisplay();  // Обновляем количество монет на экране
    });
  });

  // Обновление количества монет при старте
  updateCoinsDisplay();
});
