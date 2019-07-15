'use strict';
(function() {
//добавляем событие клика на отрисованные пины
var mapPins = document.querySelector('.map__pins');
mapPins.addEventListener('click', function(evt) {
  var target = evt.target;
  while (target != mapPins) {
    if (target.className == 'map__pin') {
      var prevPin = mapPins.querySelector('.map__pin--active');
      //если предыдущий элемент существует с таким классом
      if (prevPin !== null) {
        closeCard(prevPin);
      }
      target.classList.add('map__pin--active');
      //получаем индекс тукущего пина
      var index = target.getAttribute('data-target');
      //отрисовываем текущую
      window.render.renderCard(index);
      return;
    }
    target = target.parentNode;
  }

});
var closeCard = function(prevPin) {
   //находим тукущую отрисованную карточку
   var currentCard = window.render.map.querySelector('.map__card');
   //удаляем предыдущую карточку
   window.render.map.removeChild(currentCard);

   prevPin.classList.remove('map__pin--active');
};
window.pin = {
  closeCard: closeCard
};
})();
