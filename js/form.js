'use strict';

(function(){
  var formAd = document.querySelector('.ad-form');
  var formFields= formAd.querySelectorAll('fieldset');
  var roomField = formAd.querySelector('#room_number');
  var capacityField = formAd.querySelector('#capacity');
  var adress =  formAd.querySelector('#address');

  //функция разблокировки формы
  var unlockForm = function() {
    formAd.classList.remove('ad-form--disabled');
  };

  //функция проверки полей формы на доступность или недоступность
  var setFormFeildStatus = function(isAvalibleForm) {
    if(isAvalibleForm) {
      formFields.forEach(function(elem) {
        elem.disabled = false;
      });
    }
    else {
      formFields.forEach(function(elem) {
        elem.disabled = true;
      });
    }
    };
  //делаем недоступными option все кроме первого
  var resetOptions = function() {
    for (var i = 1; i < capacityField.options.length; i++) {
      capacityField.options[i].disabled = true;
    }
  };
  //сопоставляем поля
  var matchFields = function() {
    roomField.addEventListener('change', function() {
      var currentIndex = roomField.options.selectedIndex;
      resetOptions();
      for (var i = 0; i <= currentIndex; i++) {
        capacityField.options[i].disabled = false;
      }
    });
  };
  //показываем диалоговое окно об успешной отправке
  var showSuccess = function() {
    document.querySelector('.success').classList.remove('hidden');
    document.addEventListener('keydown', onEscPress);
  };
  //закрываем диалоговое окно
  var hiddenSuccess = function() {
    document.querySelector('.success').classList.add('hidden');
    document.removeEventListener('keydown', onEscPress);
  };

  var clearFields = function() {
    formAd.reset();
  };

  matchFields();
  formAd.addEventListener('submit', function(evt) {
    evt.preventDefault();
    var price = form.querySelector('#price');
    var title = form.querySelector('#title');
    if(!title.value) {
      title.focus();
    }
    else if (!price.value) {
      price.focus();
    }
    else {
      showSuccess();
    }
  });

  var onEscPress = function(evt) {
    if (evt.keyCode === 27) {
      hiddenSuccess();
      clearFields();
    }
  };

  // записываем адрес в поле
  var setAddress = function (coordX, coordY) {
    adress.setAttribute('value', 'x: ' + coordX  + ' y: ' + coordY);
  };
  window.form = {
    setAddress: setAddress,
    setFormFeildStatus: setFormFeildStatus,
    unlockForm: unlockForm
  };
})();
