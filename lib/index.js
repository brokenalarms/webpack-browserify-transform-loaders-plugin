'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

var findPackageMetadataFilenameImpl = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(fs, parts, clue) {
    var p, i, filename, exists;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(parts.length === 0)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return', { filename: null, dirname: null });

          case 4:
            p = parts.join('');
            i = 0;

          case 6:
            if (!(i < clue.length)) {
              _context.next = 16;
              break;
            }

            filename = _path2.default.join(p, clue[i]);
            _context.next = 10;
            return pathExists(fs, filename);

          case 10:
            exists = _context.sent;

            if (!exists) {
              _context.next = 13;
              break;
            }

            return _context.abrupt('return', { filename: filename, dirname: p });

          case 13:
            i++;
            _context.next = 6;
            break;

          case 16:
            return _context.abrupt('return', findPackageMetadataFilenameImpl(fs, parts.slice(0, -1), clue));

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function findPackageMetadataFilenameImpl(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _escapeRegexp = require('escape-regexp');

var _escapeRegexp2 = _interopRequireDefault(_escapeRegexp);

var _nodeCallbackAdapter = require('node-callback-adapter');

var _nodeCallbackAdapter2 = _interopRequireDefault(_nodeCallbackAdapter);

var _minimatch = require('minimatch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  * @copyright 2015, Andrey Popp <8mayday@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  */

var log = (0, _debug2.default)('webpack-package-loaders-plugin');

var SPLIT_PATH = /(\/|\\)/;

function readFilePromise(fs, filename, encoding) {
  return new _bluebird2.default(function (resolve, reject) {
    fs.readFile(filename, function (err, data) {
      if (err) {
        reject(err);
      } else {
        if (encoding !== undefined) {
          data = data.toString(encoding);
        }
        resolve(data);
      }
    });
  });
}

function splitPath(path) {
  var parts = path.split(SPLIT_PATH);
  if (parts.length === 0) {
    return parts;
  } else if (parts[0].length === 0) {
    // when path starts with a slash, the first part is empty string
    return parts.slice(1);
  } else {
    return parts;
  }
}

function pathExists(fs, path) {
  return new _bluebird2.default(function (resolve, reject) {
    fs.stat(path, function (err) {
      resolve(!err);
    });
  });
}

function findPackageMetadataFilename(fs, currentFullPath, clue) {
  currentFullPath = splitPath(currentFullPath);
  if (!Array.isArray(clue)) {
    clue = [clue];
  }
  return findPackageMetadataFilenameImpl(fs, currentFullPath, clue);
}

function getByKeyPath(obj, keyPath) {
  for (var i = 0; i < keyPath.length; i++) {
    if (obj == null) {
      return;
    }
    obj = obj[keyPath[i]];
  }
  return obj;
}

function parsePackageData(src, loadersKeyPath) {
  var data = JSON.parse(src);
  var loaders = getByKeyPath(data, loadersKeyPath);
  if (loaders) {
    loaders.forEach(function (loader) {
      if (typeof loader.loader === 'string') {
        loader.test = new _minimatch.Minimatch(loader.test);
      }
    });
  }
  return data;
}

function injectNoLoaders(packageData, packageDirname) {
  return [];
}

var DEFAULT_OPTIONS = {
  packageMeta: 'package.json',
  loadersKeyPath: ['browserify', 'transform'],
  injectLoaders: injectNoLoaders
};

/**
 * Plugin which injects per-package loaders.
 *
 * @param {Object} options Options object allows the following keys
 */
var PackageLoadersPlugin = (_class = function () {
  function PackageLoadersPlugin(options) {
    _classCallCheck(this, PackageLoadersPlugin);

    this.options = _extends({}, DEFAULT_OPTIONS, options);
    this._packagesByDirectory = {};
    this._packageMetadatFilenameByDirectory = {};
    this._loadersByResource = {};
  }

  _createClass(PackageLoadersPlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      compiler.plugin('normal-module-factory', function (factory) {
        return factory.plugin('after-resolve', function (data, callback) {
          return _this.onAfterResolve(compiler, factory, data, callback);
        });
      });
    }
  }, {
    key: 'onAfterResolve',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(compiler, factory, data) {
        var resolveLoader, fs, _ref3, packageData, packageDirname, loaders, resourceRelative;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(this._loadersByResource[data.resource] !== undefined)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt('return', _extends({}, data, {
                  loaders: data.loaders.concat(this._loadersByResource[data.resource])
                }));

              case 2:
                log('processing ' + data.resource + ' resource');
                resolveLoader = _bluebird2.default.promisify(compiler.resolvers.loader.resolve);
                fs = compiler.inputFileSystem;
                _context2.next = 7;
                return this.findPackageForResource(fs, data.resource);

              case 7:
                _ref3 = _context2.sent;
                packageData = _ref3.packageData;
                packageDirname = _ref3.packageDirname;

                if (packageData) {
                  _context2.next = 12;
                  break;
                }

                return _context2.abrupt('return', data);

              case 12:
                loaders = getByKeyPath(packageData, this.options.loadersKeyPath);

                if (!loaders) {
                  loaders = [];
                }
                resourceRelative = _path2.default.relative(packageDirname, data.resource);

                loaders = loaders.concat(this.options.injectLoaders(packageData, packageDirname, data.resource)).map(function (loader) {
                  return resolveLoader(_path2.default.dirname(data.resource), "transform?" + loader);
                }).reverse();
                _context2.next = 18;
                return _bluebird2.default.all(loaders);

              case 18:
                loaders = _context2.sent;

                this._loadersByResource[data.resource] = loaders;
                log('adding ' + loaders + ' loaders for ' + resourceRelative + ' resource');
                return _context2.abrupt('return', _extends({}, data, {
                  loaders: loaders.concat(data.loaders)
                }));

              case 22:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function onAfterResolve(_x4, _x5, _x6) {
        return _ref2.apply(this, arguments);
      }

      return onAfterResolve;
    }()

    /**
     * Find a package metadata for a specified resource.
     */

  }, {
    key: 'findPackageForResource',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(fs, resource) {
        var _this2 = this;

        var dirname, _ref5, packageDirname, packageMeta, packageData;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                dirname = _path2.default.dirname(resource);

                if (this._packageMetadatFilenameByDirectory[dirname] === undefined) {
                  log('finding package directory for ' + dirname);
                  this._packageMetadatFilenameByDirectory[dirname] = findPackageMetadataFilename(fs, dirname, this.options.packageMeta);
                }
                _context4.next = 4;
                return this._packageMetadatFilenameByDirectory[dirname];

              case 4:
                _ref5 = _context4.sent;
                packageDirname = _ref5.dirname;
                packageMeta = _ref5.filename;

                if (packageDirname) {
                  _context4.next = 10;
                  break;
                }

                log('no package metadata found for ' + resource + ' resource');
                return _context4.abrupt('return', { packageData: null, packageDirname: packageDirname });

              case 10:
                if (this._packagesByDirectory[packageDirname] === undefined) {
                  this._packagesByDirectory[packageDirname] = _bluebird2.default.try(_asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                    var packageSource;
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            log('reading package data for ' + packageDirname);
                            _context3.next = 3;
                            return readFilePromise(fs, packageMeta, 'utf8');

                          case 3:
                            packageSource = _context3.sent;
                            return _context3.abrupt('return', parsePackageData(packageSource, _this2.options.loadersKeyPath));

                          case 5:
                          case 'end':
                            return _context3.stop();
                        }
                      }
                    }, _callee3, _this2);
                  })));
                }
                _context4.next = 13;
                return this._packagesByDirectory[packageDirname];

              case 13:
                packageData = _context4.sent;
                return _context4.abrupt('return', { packageData: packageData, packageDirname: packageDirname });

              case 15:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function findPackageForResource(_x7, _x8) {
        return _ref4.apply(this, arguments);
      }

      return findPackageForResource;
    }()
  }]);

  return PackageLoadersPlugin;
}(), (_applyDecoratedDescriptor(_class.prototype, 'onAfterResolve', [_nodeCallbackAdapter2.default], Object.getOwnPropertyDescriptor(_class.prototype, 'onAfterResolve'), _class.prototype)), _class);
exports.default = PackageLoadersPlugin;
