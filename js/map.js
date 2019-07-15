'use strict';
(function() {
var pinMain = window.render.map.querySelector('.map__pin--main');
var pinMainWidth = pinMain.offsetWidth;
var pinMainHeight = pinMain.offsetHeight;
var defaultPinMainCoords = {
  x: pinMain.offsetLeft + pinMainWidth / 2,
  y: pinMain.offsetTop + pinMainHeight
};
// флаг для понимание открыта ли карта или нет
var isOpenMap = false;

 // Определяем размеры карты (понадобятся для ограничения вводимых координат адреса)
 var mapWidth = window.render.mapPins.clientWidth;
 var mapHeight = window.render.mapPins.clientHeight;
  var avalibleCoords = {
    minX: window.render.mapPins.offsetLeft + pinMainWidth,
    maxX: mapWidth - pinMainWidth,
    minY: window.render.mapPins.offsetTop + pinMainHeight,
    maxY: mapHeight  - pinMainHeight
  };

// проверяем не вышли ли мы за границы карты
 var setCoords = function (coords) {
  if (coords.x < avalibleCoords.minX) {
    coords.x = avalibleCoords.minX;
  } else if (coords.x > avalibleCoords.maxX) {
    coords.x = avalibleCoords.maxX;
  }
  if (coords.y < avalibleCoords.minY) {
    coords.y = avalibleCoords.minY;
  } else if (coords.y > avalibleCoords.maxY) {
    coords.y = avalibleCoords.maxY;
  }
  return coords;
};

//записываем в поле адрес начальные координаты
window.form.setAddress(defaultPinMainCoords.x, defaultPinMainCoords.y);

//делаем поля формы недоступными
window.form.setFormFeildStatus(false);
//функция показа карты
var showMap = function() {
  window.render.map.classList.remove('map--faded');
  window.form.unlockForm();
  window.render.renderAdvertisements();
  window.form.setFormFeildStatus(true);
  isOpenMap = true;
};

//вешаем событие перетаскивания
pinMain.addEventListener('mousedown', function(evt) {
  evt.preventDefault();
  var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };
  var onMouseUp =  function(upEvt) {
    upEvt.preventDefault();
    if(!isOpenMap) {
      showMap();
    }
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('mousemove', onMouseMove);
  };
  var onMouseMove = function(moveEvt) {
    moveEvt.preventDefault();
    // задаем координаты смещения
        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };
        //перезаписываем начальные координаты
        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };
        var newCoords = {
          y: pinMain.offsetTop - shift.y,
          x: pinMain.offsetLeft  - shift.x
        };
          newCoords = setCoords(newCoords);
          // перемещаем метку на карте
          pinMain.style.top = (newCoords.y) + 'px';
          pinMain.style.left = (newCoords.x) + 'px';
          // запонимаем новые коррдинаты для вывода в поле адреса
          var shiftedPinMainCoords = {
            x: pinMain.offsetLeft - shift.x + pinMainWidth / 2,
            y: pinMain.offsetTop - shift.y + pinMainHeight
          };
          window.form.setAddress(shiftedPinMainCoords.x, shiftedPinMainCoords.y);
  };
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});
})();


