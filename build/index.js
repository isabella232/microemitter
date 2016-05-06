var EventEmitter,
  slice = [].slice,
  hasProp = {}.hasOwnProperty;

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

  defineProperty = Object.defineProperty || function(obj, prop, arg) {
    var value;
    value = arg.value;
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
    var prop, prot, results;
    prot = EventEmitter.prototype;
    results = [];
    for (prop in prot) {
      results.push(obj[prop] = prot[prop]);
    }
    return results;
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
    var base, lid, listeners;
    if (listener == null) {
      throw new Error('Listener is required!');
    }
    init(this);
    this.emit('newListener', evt, listener);
    listeners = (base = this._events)[evt] || (base[evt] = {});
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
        rest = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        _this.off(evt, wrappedListener);
        return listener.apply(_this, rest);
      };
    })(this);
    return this.on(evt, wrappedListener);
  };

  EventEmitter.prototype.off = function(evt, listener) {
    var key, listenerId, listeners, ref;
    init(this);
    switch (arguments.length) {
      case 0:
        ref = this._events;
        for (key in ref) {
          if (!hasProp.call(ref, key)) continue;
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
    var evt, id, listener, listeners, ref, rest;
    evt = arguments[0], rest = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    init(this);
    listeners = (ref = this._events[evt]) != null ? ref : [];
    for (id in listeners) {
      if (!hasProp.call(listeners, id)) continue;
      listener = listeners[id];
      listener.call.apply(listener, [this].concat(slice.call(rest)));
    }
    if (evt === 'error' && listeners.length === 0) {
      throw rest[0];
    }
    return this;
  };

  return EventEmitter;

})();

module.exports = EventEmitter;
