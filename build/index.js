var EventEmitter,
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty;

EventEmitter = (function() {
  'use strict';
  var createId, defineProperty, idKey, init, mixin;

  idKey = 'ಠ_ಠ';

  EventEmitter.listeners = {};

  EventEmitter.targets = {};

  EventEmitter.off = function(listenerId) {

    /*
    Note: @off, but no symmetrical "@on".  This is by design.
      One shouldn't add event listeners directly.  These static
      collections are maintained so that the listeners may be
      garbage collected and removed from the emitter's record.
      To that end, @off provides a handy interface.
     */
    delete this.listeners[listenerId];
    delete this.targets[listenerId];
    return this;
  };

  defineProperty = Object.defineProperty || function(obj, prop, _arg) {
    var value;
    value = _arg.value;
    return obj[prop] = value;
  };

  createId = (function() {
    var counter;
    counter = 0;
    return function() {
      return counter++;
    };
  })();

  mixin = function(obj) {
    var prop, prot, _results;
    prot = EventEmitter.prototype;
    _results = [];
    for (prop in prot) {
      _results.push(obj[prop] = prot[prop]);
    }
    return _results;
  };

  init = function(obj) {
    if (!(idKey in obj)) {
      defineProperty(obj, idKey, {
        value: "" + (Math.round(Math.random() * 1e9))
      });
    }
    if (!('_events' in obj)) {
      return defineProperty(obj, '_events', {
        value: {}
      });
    }
  };

  function EventEmitter(obj) {
    if (obj != null) {
      mixin(obj);
    }
  }

  EventEmitter.prototype.on = function(evt, listener) {
    var lid, listeners, _base;
    if (listener == null) {
      throw new Error('Listener is required!');
    }
    init(this);
    this.emit('newListener', evt, listener);
    listeners = (_base = this._events)[evt] || (_base[evt] = {});
    if (this[idKey] in listener) {
      lid = listener[this[idKey]];
    } else {
      lid = createId();
      defineProperty(listener, this[idKey], {
        value: lid
      });
    }
    EventEmitter.listeners[lid] = listeners[lid] = listener;
    EventEmitter.targets[lid] = this;
    return this;
  };

  EventEmitter.prototype.once = function(evt, listener) {
    var wrappedListener;
    wrappedListener = (function(_this) {
      return function() {
        var rest;
        rest = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _this.off(evt, wrappedListener);
        return listener.apply(_this, rest);
      };
    })(this);
    return this.on(evt, wrappedListener);
  };

  EventEmitter.prototype.off = function(evt, listener) {
    var key, listenerId, listeners, _ref;
    init(this);
    switch (arguments.length) {
      case 0:
        _ref = this._events;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          delete this._events[key];
        }
        break;
      case 1:
        this._events[evt] = {};
        break;
      default:
        listeners = this._events[evt];
        listenerId = listener[this[idKey]];
        if (listeners != null) {
          delete listeners[listenerId];
        }
        EventEmitter.off(listenerId);
    }
    return this;
  };

  EventEmitter.prototype.emit = function() {
    var evt, id, listener, listeners, rest, _ref;
    evt = arguments[0], rest = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    init(this);
    listeners = (_ref = this._events[evt]) != null ? _ref : [];
    for (id in listeners) {
      if (!__hasProp.call(listeners, id)) continue;
      listener = listeners[id];
      listener.call.apply(listener, [this].concat(__slice.call(rest)));
    }
    if (evt === 'error' && listeners.length === 0) {
      throw rest[0];
    }
    return this;
  };

  return EventEmitter;

})();

module.exports = EventEmitter;
