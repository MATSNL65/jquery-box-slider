;(function (w, $, undefined) {

  w.jqBoxSlider.registerAnimator('tile3d', (function () {

    var adaptor = {}
      , supports3d = true
      , vendorPrefix = '';

    adaptor.configure = function (can3D, prefix) {
      supports3d = can3D;
      vendorPrefix = prefix;
    };

    adaptor.initialize = function ($box, $slides, settings) {
      var imgURL = slideImageURL($slides.eq(0)) // ----------------------------- extract this fn out into the main plugin
        , $wrapper = $(document.createElement('div'))
        , fromLeft = 0
        , fromTop = 0
        , i = 0
        , j = 0
        , rows
        , cols
        , tileSpeed;
        
      // tile grid
      settings.tileSize || (settings.tileSize = 75);
      rows = settings.tileRows = $box.width() / settings.tileSize;
      cols = settings.tileCols = Math.ceil($box.width() / settings.tileSize);
      
      // timing offsets
      settings.tileTimings = $.extend({}, {
          row: 50
        , tile: 25
      }, settings.tileTimings);
      settings.tileTimings.tileSpeed = settings.speed - (
        (rows * settings.tileTimings.row) +
        (cols * settings.tileTimings.tile)
      );
      
      for (; i < rows; ++i) {
        fromTop = i * settings.tileSize;

        for (j = 0; j < cols; ++j) {
          fromLeft = j * settings.tileSize;
          $wrapper.append(createTile({
              fromTop: fromTop
            , fromLeft: j * settings.tileSize
            , imgURL: imgURL
            , side: settings.tileSize
            , speed: (settings.tileTimings.tileSpeed / 1000) + 's'
          }));
        }
      }

      $wrapper.css({position: 'absolute', top: 0, left: 0});
      $box.css('position', 'relative').append($wrapper);
      $slides.hide();
      settings.$tileWrapper = $wrapper;
      settings._slideFilter = function (index, settings) {
        return this.get(index) !== settings.$tileWrapper.get(0);
      }
    };

    adaptor.reset = function ($box, settings) {};

    adaptor.transition = function (settings) {
      var $tiles = settings.$tileWrapper.find('.bs-tile')
        , imgSrc = slideImageURL(settings.$nextSlide)
        , nextFace = settings.nextFace || 'back'
        , faceClass = '.bs-tile-face-' + nextFace
        , ret = {}
        , angle
        , i = 0
        , j = 0
        , rowStart;

      if (nextFace === 'back') {
        ret.nextFace = 'front';
        angle = 180;
      }
      else {
        ret.nextFace = 'back';
        angle = 0;
      }

      $tiles.find(faceClass).css('background-image', 'url(' + imgSrc + ')');

      for (; i < settings.tileRows; ++i) {
        rowStart = i * settings.tileTimings.row;
        
        (function (rowStart, i) {
          setTimeout(function () {
            for (j = 0; j < settings.tileCols; ++j) {
              gridIndex = (i * settings.tileCols) + j;
              
              (function () {
                var to = rowStart + j * settings.tileTimings.tile
                  , $tile = $tiles.eq(gridIndex);
      
                setTimeout(function () {
                  $tile.css(vendorPrefix + 'transform', 'rotate3d(0,1,0,' + angle + 'deg)');
                }, to);
              }());
            }
          }, rowStart);
        }(rowStart, i));
      }
      
      return ret;
    };

    adaptor.destroy = function ($box, settings) {};

    // locate the slides image and get it's url
    var slideImageURL = function ($slide) {
      return $slide.attr('src') || $slide.find('img').attr('src');
    };

    // creates a tile section
    var createTile = function (opts) {
      var $tileHolder = $(document.createElement('div'))
        , $tile = $(document.createElement('div'))
        , $front = $(document.createElement('div'))
        , back = document.createElement('div');

      $tileHolder
        .css({
            position: 'absolute'
          , top: opts.fromTop
          , left: opts.fromLeft
          , width: opts.side
          , height: opts.side
        })
        .css(vendorPrefix + 'perspective', 400);

      $tile
        .addClass('bs-tile')
        .css({width: opts.side, height: opts.side})
        .css(vendorPrefix + 'transform-style', 'preserve-3d')
        .css(vendorPrefix + 'transition', vendorPrefix + 'transform ' + opts.speed)
        .appendTo($tileHolder);

      back.style[vendorPrefix + 'transform'] = 'rotateY(180deg)';
      back.className = 'bs-tile-face-back';

      $front
        .addClass('bs-tile-face-front')
        .css('backgroundImage', 'url(' + opts.imgURL + ')')
        .add(back)
        .css({
            width: opts.side
          , height: opts.side
          , backgroundPosition: -opts.fromLeft + 'px ' + -opts.fromTop + 'px'
          , position: 'absolute'
          , top: 0
          , left: 0
        })
        .css(vendorPrefix + 'backface-visibility', 'hidden')
        .appendTo($tile);

      return $tileHolder;
    };

    var spinTiles = function ($tiles, faceClass, imgSrc, intv) {
      var angle = faceClass
    };

    return adaptor;

  }()));

}(window, jQuery || Zepto));
