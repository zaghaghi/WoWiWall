function createImageTiles(paper, width, imageURL, imageWidth, imageHeight, starty) {
  var images = paper.set();
  for (var i = -2*imageWidth; i <= width+2*imageWidth; i+=imageWidth) {
    images.push(paper.image(imageURL, i, starty, imageWidth, imageHeight ));
  }
  return images;
}

var data = [{"id":18, "x":100, "y":70, "type":10, "data":"دختر کبرا خانم با پسر عباس آقا ازدواج کرد!", "rot":0},
    {"id":2, "x":300, "y":100, "type":10, "data":"واه واه چه حرفا"  , "rot":0},
    {"id":3, "x":1000, "y":400, "type":10, "data":"عجب دیوار جالبی", "rot":10},
    {"id":4, "x":300, "y":400, "type":10, "data":"عجب دیوار جالبی", "rot":-20},
    {"id":5, "x":3000, "y":400, "type":10, "data":"عجب دیوار جالبی", "rot":60},
    {"id":10, "x":3000, "y":100, "type":10, "data":"مرگ بر شاه", "rot":180},
    {"id":12, "x":2500, "y":200, "type":10, "data":";-)", "rot":90},
    {"id":15, "x":2600, "y":200, "type":10, "data":";-*", "rot":90},
    {"id":6, "x":2000, "y":100, "type":20, "data":"i/u/1.jpg", "rot":5, "width":400, "height":300},
    {"id":20, "x":550, "y":200, "type":21, "data":"i/u/3.png", "rot":0, "width":119, "height":100},
    {"id":8, "x":800, "y":200,"type":10,"data":"لعنت بر کسی که اینجا آشغال بریزد", "rot":25}];

function createDataItems(paper, data) {
  items = paper.set();
  for (var i = 0; i < data.length; i++) {
    if (data[i].type>=10 && data[i].type<20) {
      item = paper.text(data[i].x, data[i].y, data[i].data)
        .attr({ "font-size": 20, "font-family": "dast_nevisregular, Tahoma", "fill":"#fff"});
      item.rotate(data[i].rot);
    }
    else if (data[i].type>=20 && data[i].type<30) {
      item = paper.image(data[i].data, data[i].x, data[i].y, data[i].width, data[i].height);
      item.rotate(data[i].rot, data[i].x + data[i].width/2, data[i].y + data[i].height/2);
    }
    //item.rot = data[i].rot;
    item.click(function() {
      $('#item-actions').modal({backdrop: false, show:true});
    });
    items.push(item);
  };
  return items;
}

$(document).ready(function() {
  doc = this;
  var w = $(window).width();
  var h = 142+488;//$(window).height();
  var top = 50;
  w = 640;
  h = 488;//630;//480;
  var paper2 = Raphael('wall2', w, h);
  var paper1 = Raphael('wall1', w, h);
  
  var wallImages = createImageTiles(paper2, w, "i/tile5.png", 128,488, 0);
  var set = createDataItems(paper1, data);

  var speed = 1.1;
  
  var active = true;

  var viewBoxX = 0;
  var lastdx = 0;
  var ldx = 0;
  var start = function () {
    ldx = 0;
  }
  var move = function (dx, dy) {
    if (this.dx == undefined) {
      this.dx = dx;
    }
    else {
      if (dx != this.dx) {
        if (dx == 0) {
          return;
        }
        this.dx = dx;
        wallImages.translate(-wallImages.getBBox().x-233, 0);
        wallImages.translate(dx%233.0, 0);
        //**streetImages.translate(-streetImages.getBBox().x-186, 0);
        //**streetImages.translate((dx*speed)%186.0, 0);
        viewBoxX = lastdx+dx;
        paper1.setViewBox(-viewBoxX, 0, w, h, true);
        ldx = dx;
      }
    }
  }
  var up = function() {
    lastdx += ldx;
  };

  $('.arrow-right').click(function(){
    dx = -53;
    wallImages.translate(-wallImages.getBBox().x-233, 0);
    wallImages.translate(dx%233.0, 0);
    //**streetImages.translate(-streetImages.getBBox().x-186, 0);
    //**streetImages.translate((dx*speed)%186.0, 0);
    viewBoxX = lastdx+dx;
    paper1.setViewBox(-viewBoxX, 0, w, h, true);
    lastdx += dx;
    return true;
  });

  $('.arrow-left').click(function(){
    dx = 53;
    wallImages.translate(-wallImages.getBBox().x-233, 0);
    wallImages.translate(dx%233.0, 0);
    //**streetImages.translate(-streetImages.getBBox().x-186, 0);
    //**streetImages.translate((dx*speed)%186.0, 0);
    viewBoxX = lastdx+dx;
    paper1.setViewBox(-viewBoxX, 0, w, h, true);
    lastdx += dx;
    return true;
  });

  $(window).resize(function() {
  });

  $(document).mousedown(function(e) {
    if (!active) return;
    this.lock = true;
    this.x = e.pageX;
    this.y = e.pageY;
    start();
  });

  $(document).mousemove(function(e) {
    if (!active) return;
    if (this.lock == undefined) {
      return;
    }
    if (this.lock) {
      move(e.pageX - this.x, e.pageY - this.y);
    }
  });

  $(document).mouseup(function() {
    if (!active) return;
    up();
    this.lock = false;
  });

  var pagex, pagey;
  $(document).dblclick(function(e) {
    if (!active) {
      return false;
    }
    if (!$(e.target).is('svg')) {
      return false;
    }
    var wall0 = $('.inner-center');
    var _pagex = e.pageX;
    var _pagey = e.pageY;

    pagex = _pagex - wall0.position().left;
    pagey = _pagey - wall0.position().top;
    $('#insert-select').modal({backdrop: false, show:true});
  });

  $('#insert-select').on('show', function () {
    active = false;
    $('#degree').val(6);
    $('#size').val(2);
    $('#input-text').val('');
  });
  $('#insert-select').on('shown', function() {
    $('#input-text').focus();
  });
  $('#insert-select').on('hidden', function () {
    active = true;
  });

  $('#paste-text').click(function() {
    paper1.text(pagex-viewBoxX, pagey, $('#input-text').val())
        .attr({ "font-size": parseInt($('#size option:selected').text()),
            "font-family": $('#font option:selected').val()+", Tahoma",
            "fill":"#fff"})
        .rotate(parseInt($('#degree option:selected').text()))
        .click(function() {
          $('#item-actions').modal({backdrop: false, show:true});
        });

    $('#insert-select').modal('hide');
  });

  $('#font').change(function() {
    $('#input-text').css('font-family',
                $('#font option:selected').val());
  });

  $('#dummy-form').submit(function() {
    return false;
  })



  $('#item-actions').on('show', function(){
    active = false;
  });
  $('#item-actions').on('hidden', function(){
    active = true;
  });
  
  $('#richer').click(function(){
    $('#item-actions').modal('hide');
  });
  $('#weaker').click(function(){
    $('#item-actions').modal('hide');
  });
  $('#cancel-action').click(function(){
    $('#item-actions').modal('hide');
  });
});