'use strict';

(function() {
  var ADS_DATA = {
      QUANTITY: 8,
      TITLES: [
      'Большая уютная квартира',
      'Маленькая неуютная квартира',
      'Огромный прекрасный дворец',
      'Маленький ужасный дворец',
      'Красивый гостевой домик',
      'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря',
      'Неуютное бунгало по колено в воде'
      ],
        TYPES: [
        'palace',
        'flat',
        'house',
        'bungalo'
        ],
      CHECKIN_TIMES: [
      '12:00',
      '13:00',
      '14:00'],
      CHECKOUT_TIMES: [
      '12:00',
      '13:00',
      '14:00'],
      FEATURES: [
      'wifi',
      'dishwasher',
      'parking',
      'washer',
      'elevator',
      'conditioner'],
      xRangeFrom: 300,
      xRangeTo: 900,
      yRangeFrom: 130,
      yRangeTo: 630,
      priceRangeFrom: 1000,
      priceRangeTo: 1000000,
      roomsRangeFrom: 1,
      roomsRangeTo: 5,
      guestsRangeFrom: 1,
      guestsRangeTo: 15,
      PHOTOS: [
      'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
      ]
    };

    var PIN_SIZE = {
      WIDTH: 50,
      HEIGHT: 70
    };

    var TYPES_MAP = {
      palace: 'Дворец',
      flat: 'Квартира',
      house: 'Дом',
      bungalo: 'Бунгало'
    };

    var template = document.querySelector('template');
    var map = document.querySelector('.map');
    var mapPins = map.querySelector('.map__pins');
    var mapFilters = map.querySelector('.map__filters-container');
    var isExistPins = false;

    //функция генерации случайных значений
    var generateRandomData = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    //функция перемешивания массива PHOTOS
    var shufflePhotos = function (arr){
      //копируем массив
      var copyArr = arr.slice(0);

      for (var i = copyArr.length - 1; i  > 0; i--){
        var j = Math.floor(Math.random()*(i + 1));
        var temp = copyArr[j];
        copyArr[j] = copyArr[i];
        copyArr[i] = temp;
      }
      return copyArr;
    };
    //функция обрезки массива FEATURES
    var cutFeatures = function (arr) {
      return arr.slice(0, generateRandomData(1,arr.length));
    };
    //функция генерации случайных данных
    var generateAds = function () {
      var OFFERS= [];
      for (var i = 0; i < ADS_DATA.QUANTITY; i++) {
        var x = generateRandomData(0, map.clientWidth + 1);
        var y = generateRandomData(ADS_DATA.yRangeFrom, ADS_DATA.yRangeTo + 1);
        OFFERS.push({
          author: {
            avatar: 'img/avatars/user' +  (i < 10 ? '0' : '') + (i + 1) + '.png'
          },
          offer: {
            title: ADS_DATA.TITLES[i],
            address: x + ', ' + y,
            price: generateRandomData(ADS_DATA.priceRangeFrom, ADS_DATA.priceRangeTo),
            type: ADS_DATA.TYPES[generateRandomData(0, ADS_DATA.TYPES.length-1)],
            rooms: generateRandomData(ADS_DATA.roomsRangeFrom, ADS_DATA.roomsRangeTo),
            guests:generateRandomData(ADS_DATA.guestsRangeFrom, ADS_DATA.guestsRangeTo),
            checkin: ADS_DATA.CHECKIN_TIMES[generateRandomData(0, ADS_DATA.CHECKIN_TIMES.length-1)],
            checkout: ADS_DATA.CHECKOUT_TIMES[generateRandomData(0, ADS_DATA.CHECKOUT_TIMES.length-1)],
            features: cutFeatures(ADS_DATA.FEATURES),
            description : '',
            photos: shufflePhotos(ADS_DATA.PHOTOS)

          },
          location: {
            x: x,
            y: y
          }
        }
          )
        };
      return OFFERS;
    };
    //отрисовка преимуществ
    var createFeaturesFragment = function (adData, template) {
      var featuresElements = template.querySelector('.popup__features');
      var featureItem = template.querySelectorAll('.popup__feature');

      [].forEach.call(featureItem, function (element) {
        featuresElements.removeChild(element);
        });
        for (var i = 0; i < adData.offer.features.length; i++) {
        var listElement = document.createElement('li');
        listElement.classList.add('popup__feature');
        listElement.classList.add('popup__feature--' + adData.offer.features[i]);
        featuresElements.appendChild(listElement);
      }

      return featuresElements;
    };
    // огтрисовка фото
    var createPhotoFragment = function (adData, template) {
      var photoElements = template.querySelector('.popup__photos');
      var photoItem = template.querySelector('.popup__photo');

      photoItem.src = adData.offer.photos[0];
      for (var i = 1; i < adData.offer.photos.length; i++) {
      var photoItemClone = photoItem.cloneNode(true);
      photoItemClone.src = adData.offer.photos[i];
      photoElements.appendChild(photoItemClone);
    }

    return photoElements;

    };
    // создание  одного обьявления
    var getOneAd = function (ad, template) {
      var adTemplate = template.content.querySelector('.map__card');
      var adElement = adTemplate.cloneNode(true);
      adElement.querySelector('.popup__title').textContent = ad.offer.title;
      adElement.querySelector('.popup__text--address').textContent = ad.offer.address;
      adElement.querySelector('.popup__text--price').textContent = ad.offer.price + 'Р/ночь';
      adElement.querySelector('.popup__type').textContent = TYPES_MAP[ad.offer.type];
      adElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + (ad.offer.rooms > 1 ? ' комнаты' : ' комната') + ' для ' + ad.offer.guests +  (ad.offer.guests > 1 ? ' гостей' : ' гостя');
      adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
      createFeaturesFragment(ad,adElement);
      createPhotoFragment(ad,adElement);
      adElement.querySelector('.popup__description').textContent = ad.offer.description;
      adElement.querySelector('.popup__avatar').src = ad.author.avatar;
      return adElement;
    };
    //создание одной метки
    var getPin = function (ad, template, index) {
      var pinTemplate = template.content.querySelector('.map__pin');
      var pinElement = pinTemplate.cloneNode(true);
      var pinX = ad.location.x - PIN_SIZE.WIDTH / 2;
      var pinY =  ad.location.y  - PIN_SIZE.HEIGHT;
      pinElement.style ='left: ' + pinX + 'px; top: ' +  pinY +'px;';
      pinElement.querySelector('img').src =ad.author.avatar;
      pinElement.querySelector('img').alt =ad.offer.title;
      pinElement.setAttribute('data-target', index);
      return pinElement;
    };

    //отрисовка похожих объявлений
    var advertisements = generateAds();

    //функця отрисовки одной карточки
    var renderCard = function(index) {
      var fragmentAds = document.createDocumentFragment();
      fragmentAds.appendChild(getOneAd(advertisements[index], template));
      map.insertBefore(fragmentAds, mapFilters);
    };
    var renderAdvertisements = function() {
    // отрисовка на карте пинов и одного обьявления
    //проверяем отрисовывали ли мы пины, если нет по отрисовываем
      if (!isExistPins) {
        var firstCard = 0;
        var fragmentPins = document.createDocumentFragment();
        for (var i = 0; i < ADS_DATA.QUANTITY; i++) {
          fragmentPins.appendChild(getPin(advertisements[i], template, i));
        }
        renderCard(firstCard);
        mapPins.appendChild(fragmentPins);
        isExistPins = true;
      }
    };
  window.render = {
    renderAdvertisements: renderAdvertisements,
    renderCard : renderCard,
    map : map,
    mapPins : mapPins
  };
})();
