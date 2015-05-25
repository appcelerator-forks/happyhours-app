function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "nl.fokkezb.pullToRefresh/" + s : s.substring(0, index) + "/nl.fokkezb.pullToRefresh/" + s.substring(index + 1);
    return path;
}

function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function refresh() {
        show();
        onRefreshstart();
    }
    function hide() {
        refreshControl.endRefreshing();
    }
    function show() {
        refreshControl.beginRefreshing();
    }
    function onRefreshstart() {
        $.trigger("release", {
            source: $,
            hide: hide
        });
    }
    new (require("alloy/widget"))("nl.fokkezb.pullToRefresh");
    this.__widgetId = "nl.fokkezb.pullToRefresh";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    exports.destroy = function() {};
    _.extend($, $.__views);
    var refreshControl;
    $.refresh = refresh;
    $.hide = hide;
    $.show = show;
    !function(args) {
        if (!_.isArray(args.children) || !_.contains([ "Ti.UI.ListView", "Ti.UI.TableView", "de.marcelpociot.CollectionView" ], args.children[0].apiName)) {
            console.error("[pullToRefresh] is missing required Ti.UI.ListView or Ti.UI.TableView or de.marcelpociot.CollectionView as first child element.");
            return;
        }
        var list = args.children[0];
        delete args.children;
        _.extend($, args);
        refreshControl = Ti.UI.createRefreshControl();
        refreshControl.addEventListener("refreshstart", onRefreshstart);
        list.refreshControl = refreshControl;
        $.addTopLevelView(list);
    }(arguments[0] || {});
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;