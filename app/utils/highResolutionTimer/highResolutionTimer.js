export default (function() {
  const HighResolutionTimer = function (options) {
    const _this = {};
    _this.timer = false;

    _this.total_ticks = 0;

    _this.start_time = undefined;
    _this.current_time = undefined;

    _this.duration = (options.duration) ? options.duration : 1000;
    _this.callback = (options.callback) ? options.callback : () => {};

    _this.run = () => {
      _this.current_time = Date.now();
      if (!_this.start_time) { _this.start_time = _this.current_time; }
      _this.callback(_this);

      let nextTick = _this.duration - (_this.current_time - (_this.start_time + (_this.total_ticks * _this.duration)));
      _this.total_ticks++;

      (function a(i) {
        i.timer = setTimeout(function() {
          i.run();
        }, nextTick);
      }(_this));

      return _this;
    };

    _this.stop = () => {
      clearTimeout(_this.timer);
      return _this;
    };

    _this.run();
    return _this;
  };

  return HighResolutionTimer;
}());
