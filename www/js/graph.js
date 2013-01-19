(function () {
  function Config (xmin, xmax, xscl, ymin, ymax, yscl, xres) {
    this.xmin = xmin;
    this.xmax = xmax;
    this.xscl = xscl;
    this.ymin = ymin;
    this.ymax = ymax;
    this.yscl = yscl;
    this.xres = xres;
  };

  var graph = {},
      onScreenCanvas = document.getElementById('canvas'),
      onScreenContext = onScreenCanvas.getContext('2d'),
      offScreenCanvas = document.createElement('canvas'),
      xRE = /x/g;

  offScreenCanvas.width = onScreenCanvas.width;
  offScreenCanvas.height = onScreenCanvas.heigth;

  var offScreenContext = offScreenCanvas.getContext('2d');

  function $(id) { return document.getElementById(id); };
  function _(id) { return parseInt($(id).value, 10); }

  var getStats = function () {
    return new Config(
      _('xmin'),
      _('xmax'),
      _('xscl'),
      _('ymin'),
      _('ymax'),
      _('yscl'),
      _('xres')
    );
  };

  var createGrid = function (config) {
    var ctx = onScreenContext,
        width = ctx.canvas.width,
        height = ctx.canvas.height,
        centerWidth = width / 2,
        centerHeight = height / 2;

    // x-axis
    ctx.beginPath();
    ctx.moveTo(0, centerHeight);
    ctx.lineTo(width, centerHeight);
    ctx.stroke();

    // x-axis ticks
    var numTicks = (config.xmax + -config.xmin) / config.xscl;
    var tickWidth = width / numTicks;
    for (var i = 0, x = 0; i <= numTicks; i++, x += tickWidth) {
      //console.log(i);
      ctx.beginPath();
      ctx.moveTo(tickWidth * i, centerHeight - 10);
      ctx.lineTo(tickWidth * i, centerHeight + 10);
      ctx.stroke();
    }

    // y-axis
    ctx.beginPath();
    ctx.moveTo(centerWidth, 0);
    ctx.lineTo(centerWidth, height);
    ctx.stroke();

    // y-axis ticks
    numTicks = (config.ymax + -config.ymin) / config.yscl;
    tickWidth = height / numTicks;
    for (var j = 0, y = 0; j <= numTicks; j++, y += tickWidth) {
      //console.log(j);
      ctx.beginPath();
      ctx.moveTo(centerWidth - 10, tickWidth * j);
      ctx.lineTo(centerWidth + 10, tickWidth * j);
      ctx.stroke();
    }
    //console.log(centerWidth, centerHeight);
  };

  var replaceX = function (equation, xVal) {
    return equation.replace(xRE, '(' + xVal + ')');
  };

  var plotAll = function () {
    var fOfX = $('fOfX').value,
        gOfX = $('gOfX').value,
        hOfX = $('hOfX').value,
        ctx = onScreenContext;

    [fOfX, gOfX, hOfX].forEach(function (equation) {
      if (xRE.test(equation)) {
        var y = calculator.parse(equation);
        console.log(equation + ' contains x');
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      } else {
        console.log(equation + ' does not contain x');
      }
    });
  };

  graph.load = function () {
    var stats = getStats();
    //console.log(stats);
    createGrid(stats);
    plotAll();
  };

  window.graph = graph;
})()
