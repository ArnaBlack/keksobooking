//добавляем событие клика на отрисованные пины
var mapPins = document.querySelector('.map__pins');
mapPins.addEventListener('click', function(evt) {
  var target = evt.target;
  while (target != mapPins) {
    if (target.className == 'map__pin') {
      var prevPin = mapPins.querySelector('.map__pin--active');
      //если предыдущий элемент существует с таким классом
      if (prevPin !== null) {
        prevPin.classList.remove('map__pin--active');
      }
      target.classList.add('map__pin--active');
      //находим тукущую отрисованную карточку
      var currentCard = window.render.map.querySelector('.map__card');
      //получаем индекс тукущего пина
      var index = target.getAttribute('data-target');
      //удаляем предыдущую карточку
      window.render.map.removeChild(currentCard);
      //отрисовываем текущую
      window.render.renderCard(index);
      return;
    }
    target = target.parentNode;
  }

});
