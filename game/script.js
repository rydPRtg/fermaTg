const squares = document.querySelectorAll('.square');
squares.forEach(square => {
  square.addEventListener('click', () => {
    square.classList.toggle('clicked');
  });
});
