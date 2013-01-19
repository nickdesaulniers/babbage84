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
      xRE = /x/,
      xREg = /x/g;

  offScreenCanvas.width = onScreenCanvas.width;
  offScreenCanvas.height = onScreenCanvas.heigth;

  var offScreenContext = offScreenCanvas.getContext('2d');

  function $ (id) { return document.getElementById(id); };
  function _ (id) { return parseInt($(id).value, 10); };
  function roundTwo (x) { return Math.round(x * 100) / 100; };

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
        xTicks = (config.xmax + -config.xmin) / config.xscl,
        xTickWidth = width / xTicks,
        yTicks = (config.ymax + -config.ymin) / config.yscl,
        yTickWidth = height / yTicks,
        centerWidth = (Math.abs(config.xmin) - Math.abs(config.xmax)) * xTickWidth,
        centerHeight = (Math.abs(config.ymin) - Math.abs(config.ymax)) * yTickWidth;

    ctx.save();
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.scale(1, -1);

    // x-axis
    ctx.beginPath();
    ctx.moveTo(-width, centerHeight);
    ctx.lineTo(width, centerHeight);
    ctx.stroke();

    // x-axis ticks
    for (var x = -width; x <= width; x += xTickWidth) {
      ctx.beginPath();
      ctx.moveTo(x, centerHeight - 10);
      ctx.lineTo(x, centerHeight + 10);
      ctx.stroke();
    }

    // y-axis
    ctx.beginPath();
    ctx.moveTo(centerWidth, -height);
    ctx.lineTo(centerWidth, height);
    ctx.stroke();

    // y-axis ticks
    for (var y = -height; y <= height; y += yTickWidth) {
      ctx.beginPath();
      ctx.moveTo(centerWidth - 10, y);
      ctx.lineTo(centerWidth + 10, y);
      ctx.stroke();
    }

    ctx.restore();
    return [xTickWidth, yTickWidth];
  };

  var replaceX = function (equation, xVal) {
    return equation.replace(xREg, '(' + xVal + ')');
  };

  var plotAll = function (config, xTickWidth, yTickWidth) {
    var fOfX = $('fOfX').value,
        gOfX = $('gOfX').value,
        hOfX = $('hOfX').value,
        ctx = onScreenContext,
        width = ctx.canvas.width;

    ctx.save();
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.scale(1, -1);

    [fOfX, gOfX, hOfX].forEach(function (equation, i) {
      var y,
          colors = ['red', 'green', 'blue'],
          color = colors[i]
          xTicks = ctx.canvas.width / xTickWidth;

      ctx.save();
      ctx.strokeStyle = color;

      if (xRE.test(equation)) {
        console.log(equation + ' contains x');
        ctx.beginPath();
        ctx.moveTo(-width / 2,
                   calculator.parse(replaceX(equation, -width / xTickWidth))
                   * yTickWidth
                  );
        for (var i = -width / 2; i <= width / 2; i += xTickWidth / config.xres) {
          var x, y;
          x = i;
          y = calculator.parse(replaceX(equation, i / xTickWidth)) * yTickWidth;

          x = roundTwo(x * 100) / 100;
          y = roundTwo(y * 100) / 100;

          console.log('(' + x + ', ' + y + '), width: ' + width + ', i: ' + i);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else {
        console.log(equation + ' does not contain x');
        y = calculator.parse(equation) * yTickWidth;
        ctx.beginPath();
        ctx.moveTo(-width, y);
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
    plotAll(stats, tickWidths[0], tickWidths[1]);
  };

  graph.replot = function () {
    onScreenContext.clearRect(0, 0, onScreenCanvas.width, onScreenCanvas.height);
    graph.load();
  };

  window.graph = graph;
})()
