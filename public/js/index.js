var messagebox = document.getElementById('messages');
var LEFT = 0,
    UP = 1,
    RIGHT = 2,
    DOWN = 3;
var toy = document.getElementById('toy');
var display = document.getElementById('screen');
display.width = display.scrollWidth;
display.height = display.scrollHeight;
ctx = display.getContext('2d');
var cursor = {
  x: display.width / 2,
  y: display.height / 2
};
var mouse = {
  x: 0,
  y: 0
};
ctx.strokeStyle = 'black';
ctx.linewidth = 1;
var xspeed = 2;
var yspeed = 2;
var keys = [0, 0, 0, 0];

var s = document.getElementById('switch')
s.onclick = function () {
  if (s.className == 'on') {
    toy.className = null;
    s.className = 'off';
    document.getElementById('joystick-controls').className = 'hidden';
    document.getElementById('normal-controls').className = null;
  } else {
    toy.className = 'joystick';
    s.className = 'on';
    document.getElementById('normal-controls').className = 'hidden';
    document.getElementById('joystick-controls').className = null;
  }
};

window.onresize = function resize() {
  display.width = display.scrollWidth;
  display.height = display.scrollHeight;
  erase();
};

function update(x, y) {
  ctx.beginPath();
  ctx.moveTo(cursor.x, cursor.y);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.closePath();
  cursor.x = x;
  cursor.y = y;
}

function draw() {
  var x = cursor.x,
      y = cursor.y;
  if (keys[UP]) y -= yspeed;
  if (keys[RIGHT]) x += xspeed;
  if (keys[DOWN]) y += yspeed;
  if (keys[LEFT]) x -= xspeed;
  // lower bound restriction
  x = x < 0 ? 0 : x;
  y = y < 0 ? 0 : y;
  // upper bound restriction
  x = x > display.width ? display.width : x;
  y = y > display.height ? display.height : y;
  update(x, y);
}

function erase() {
  if (toy.className.search('erasing') >= 0) return;
  var className = toy.className;
  toy.className += ' erasing';
  setTimeout(function () {
    ctx.clearRect(0, 0, display.width, display.height);
  }, 250);
  setTimeout(function () {
    toy.className = className;
  }, 500);
}

display.ondblclick = erase;

/************ KEYBOARD CONTORLS ************/

document.onkeydown = document.onkeyup = function updateKeys(e) {
  e = e || window.event;
  if (37 <= e.keyCode <= 40) keys[e.keyCode - 37] = e.type == 'keydown';
  if (e.keyCode == 32 && e.type == 'keydown') erase();
}

/************ MOUSE CONTORLS ************/

document.onmousemove = function mouseMove(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

var leftctrl = document.getElementsByClassName('control left')[0];
var rightctrl = document.getElementsByClassName('control right')[0];
var updown = -1;
var leftright = -1;

leftctrl.onmousedown = function (e) {
  var inity = mouse.y,
      initx = mouse.x;
  updown = setInterval(function () {
    var dy = mouse.y - inity,
        dx = mouse.x - initx;
    yspeed = Math.abs(dx + dy) / 10;
    if (dx + dy > 0) {
      keys[DOWN] = 1;
      keys[UP] = 0;
    } else {
      keys[UP] = 1;
      keys[DOWN] = 0;
    }
  }, 30);
};

rightctrl.onmousedown = function (e) {
  var inity = mouse.y,
      initx = mouse.x;
  leftright = setInterval(function () {
    var dy = mouse.y - inity,
        dx = mouse.x - initx;
    xspeed = Math.abs(dx - dy) / 10;
    if (dx - dy > 0) {
      keys[RIGHT] = 1;
      keys[LEFT] = 0;
    } else {
      keys[LEFT] = 1;
      keys[RIGHT] = 0;
    }
  }, 30);
};

var joystick = document.getElementsByClassName('control joystick')[0];

joystick.onmousedown = function (e) {
  var inity = mouse.y,
      initx = mouse.x;
  leftright = setInterval(function () {
    var dx = mouse.x - initx;
    xspeed = Math.abs(dx) / 10;
    if (dx > 0) {
      keys[RIGHT] = 1;
      keys[LEFT] = 0;
    } else {
      keys[LEFT] = 1;
      keys[RIGHT] = 0;
    }
  }, 30);
  updown = setInterval(function () {
    var dy = mouse.y - inity;
    yspeed = Math.abs(dy) / 10;
    if (dy > 0) {
      keys[DOWN] = 1;
      keys[UP] = 0;
    } else {
      keys[UP] = 1;
      keys[DOWN] = 0;
    }
  }, 30);
};

document.onmouseup = function mouseup(event) {
   if (updown != -1) {
     clearInterval(updown);
     mousedown = -1;
   }
   if (leftright != -1) {
     clearInterval(leftright);
     mousedown = -1;
   }
   keys = [0, 0, 0, 0];
   xspeed = 2;
   yspeed = 2;
};

/************ TOUCH CONTROLS ************/

var lefttouch = {
  id: -1,
  x: 0,
  y: 0
};
var righttouch = {
  id: -1,
  x: 0,
  y: 0
};
var joysticktouch = {
  id: -1,
  x: 0,
  y: 0
};

leftctrl.ontouchstart = function lefttouchstart (e) {
  if (lefttouch.id != -1) return;
  var touch = e.changedTouches[0];
  lefttouch.id = touch.identifier;
  lefttouch.x = touch.clientX;
  lefttouch.y = touch.clientY;
};

rightctrl.ontouchstart = function righttouchstart (e) {
  if (righttouch.id != -1) return;
  var touch = e.changedTouches[0];
  righttouch.id = touch.identifier;
  righttouch.x = touch.clientX;
  righttouch.y = touch.clientY;
};

joystick.ontouchstart = function righttouchstart (e) {
  if (joysticktouch.id != -1) return;
  var touch = e.changedTouches[0];
  joysticktouch.id = touch.identifier;
  joysticktouch.x = touch.clientX;
  joysticktouch.y = touch.clientY;
};

document.ontouchmove = function touchmove (e) {
  var touches = e.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    if (touches[i].identifier == lefttouch.id) {
      var dy = touches[i].clientY - lefttouch.y,
          dx = touches[i].clientX - lefttouch.x;
      yspeed = Math.abs(dx + dy) / 10;
      if (dx + dy > 0) {
        keys[DOWN] = 1;
        keys[UP] = 0;
      } else {
        keys[UP] = 1;
        keys[DOWN] = 0;
      }
    } else if (touches[i].identifier == righttouch.id) {
      var dy = touches[i].clientY - righttouch.y,
          dx = touches[i].clientX - righttouch.x;
      xspeed = Math.abs(dx - dy) / 10;
      if (dx - dy > 0) {
        keys[RIGHT] = 1;
        keys[LEFT] = 0;
      } else {
        keys[LEFT] = 1;
        keys[RIGHT] = 0;
      }
    } else if (touches[i].identifier == joysticktouch.id) {
      var dy = touches[i].clientY - joysticktouch.y,
          dx = touches[i].clientX - joysticktouch.x;

      xspeed = Math.abs(dx) / 10;
      if (dx > 0) {
        keys[RIGHT] = 1;
        keys[LEFT] = 0;
      } else {
        keys[LEFT] = 1;
        keys[RIGHT] = 0;
      }

      yspeed = Math.abs(dy) / 10;
      if (dy > 0) {
        keys[DOWN] = 1;
        keys[UP] = 0;
      } else {
        keys[UP] = 1;
        keys[DOWN] = 0;
      }
    }
  }
};

document.ontouchend = function touchend (e) {
  var touches = e.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    if (touches[i].identifier == lefttouch.id) {
      lefttouch.id = -1;
      keys[UP] = 0;
      keys[DOWN] = 0;
      yspeed = 2;
    } else if (touches[i].identifier == righttouch.id) {
      righttouch.id = -1;
      keys[RIGHT] = 0;
      keys[LEFT] = 0;
      xspeed = 2;
    } else if (touches[i].identifier == joysticktouch.id) {
      joysticktouch.id = -1;
      keys[UP] = 0;
      keys[DOWN] = 0;
      keys[RIGHT] = 0;
      keys[LEFT] = 0;
      yspeed = 2;
      xspeed = 2;
    }
  }
};

var taps = 0;
var taptimeouts = [];
display.ontouchstart = function displaytap (e) {
  taps++;
  if (taps == 2) {
    taps = 0;
    for (var i = 0; i < taptimeouts.length; i++) {
      clearTimeout(taptimeouts[i]);
    }
    erase();
  } else {
    taptimeouts.push(setTimeout(function () {
      taps--;
    }, 500));
  }
}

/************ DRAW LOOP ************/

setInterval(draw, 30);
