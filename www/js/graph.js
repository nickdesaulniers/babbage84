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
    var xTicks = (config.xmax + -config.xmin) / config.xscl;
    var xTickWidth = width / xTicks;
    for (var i = 0, x = 0; i <= xTicks; i++, x += xTickWidth) {
      //console.log(i);
      ctx.beginPath();
      ctx.moveTo(xTickWidth * i, centerHeight - 10);
      ctx.lineTo(xTickWidth * i, centerHeight + 10);
      ctx.stroke();
    }

    // y-axis
    ctx.beginPath();
    ctx.moveTo(centerWidth, 0);
    ctx.lineTo(centerWidth, height);
    ctx.stroke();

    // y-axis ticks
    var yTicks = (config.ymax + -config.ymin) / config.yscl;
    yTickWidth = height / yTicks;
    for (var j = 0, y = 0; j <= yTicks; j++, y += yTickWidth) {
      //console.log(j);
      ctx.beginPath();
      ctx.moveTo(centerWidth - 10, yTickWidth * j);
      ctx.lineTo(centerWidth + 10, yTickWidth * j);
      ctx.stroke();
    }
    return [xTickWidth, yTickWidth];
    //console.log(centerWidth, centerHeight);
  };

  var replaceX = function (equation, xVal) {
    return equation.replace(xRE, '(' + xVal + ')');
  };

  var plotAll = function (xTickWidth, yTickWidth) {
    var fOfX = $('fOfX').value,
        gOfX = $('gOfX').value,
        hOfX = $('hOfX').value,
        ctx = onScreenContext,
        width = ctx.canvas.width;

    ctx.save();
    ctx.translate(0, ctx.canvas.height / 2);
    ctx.scale(1, -1);

    [fOfX, gOfX, hOfX].forEach(function (equation, i) {
      var y, colors = ['red', 'green', 'blue'], color = colors[i];

      ctx.save();
      ctx.strokeStyle = color;

      if (xRE.test(equation)) {
        console.log(equation + ' contains x');
      } else {
        y = calculator.parse(equation) * yTickWidth;
        console.log(equation + ' does not contain x');
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
    });
    ctx.restore();
  };

  graph.load = function () {
    var stats = getStats();
    var tickWidths = createGrid(stats);
    //console.log(stats);
    plotAll(tickWidths[0], tickWidths[1]);
  };

  window.graph = graph;
})()
