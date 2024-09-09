document.addEventListener("DOMContentLoaded", function() {
  let coins = 0;
  const coinCounter = document.getElementById('coin-counter');
  const squares = document.querySelectorAll('.square');

  squares.forEach(square => {
    square.addEventListener('click', () => {
      square.classList.toggle('clicked');
      coins += 1;  // Увеличиваем количество монет
      coinCounter.textContent = `Монеты: ${coins}`;  // Обновляем счетчик
    });
  });
});
