document.addEventListener("DOMContentLoaded", function() {
  let coins = 0;
  const coinCounter = document.getElementById('coin-counter');
  const squares = document.querySelectorAll('.square');

  // Функция для обновления монет на сервере
  function updateCoinsOnServer(coins) {
    fetch('/update_coins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coins: coins })
    });
  }

  // Функция для обновления состояния квадратов на сервере
  function updateSquaresOnServer(squaresState) {
    fetch('/update_squares', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ squares: squaresState })
    });
  }

  // Отслеживаем клики по квадратам
  squares.forEach((square, index) => {
    square.addEventListener('click', () => {
      square.classList.toggle('clicked');
      coins += 1;  // Увеличиваем количество монет
      coinCounter.textContent = `Монеты: ${coins}`;  // Обновляем счетчик

      // Обновляем монеты на сервере
      updateCoinsOnServer(coins);

      // Получаем текущее состояние квадратов (0 - зеленый, 1 - коричневый)
      const squaresState = Array.from(squares).map(sq => sq.classList.contains('clicked') ? 1 : 0).join('');

      // Обновляем состояние квадратов на сервере
      updateSquaresOnServer(squaresState);
    });
  });
});
