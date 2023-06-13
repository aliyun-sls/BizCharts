import * as G2 from '@antv/g2/lib/core';
import G2__default, { Util as Util$1, Shape, Animate, PathUtil } from '@antv/g2/lib/core';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import warning from 'warning';
import '@antv/g2/lib/geom/index';
import '@antv/g2/lib/facet/index';

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  }
  return x !== x && y !== y;
}
function length(obj) {
  if (Util$1.isArray(obj)) {
    return obj.length;
  } else if (Util$1.isObject(obj)) {
    return Object.keys(obj).length;
  }
  return 0;
}
var Util = Util$1.mix({}, Util$1, {
  shallowEqual(objA, objB) {
    if (is(objA, objB)) {
      return true;
    }
    if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
      return false;
    }
    if (Util$1.isArray(objA) !== Util$1.isArray(objB)) {
      return false;
    }
    if (length(objA) !== length(objB)) {
      return false;
    }
    let ret = true;
    Util$1.each(objA, (v, k) => {
      if (!is(v, objB[k])) {
        return ret = false;
      }
      return true;
    });
    return ret;
  },
  without(objA, keys = []) {
    const ret = {};
    Util$1.each(objA, (v, k) => {
      if (Util$1.indexOf(keys, k) === -1) {
        ret[k] = v;
      }
    });
    return ret;
  },
  length
});

var Themes = {};

const addFuncMap = {
  Chart: "addChart",
  Coord: "addCoord",
  Geom: "addGeom",
  Axis: "addAxis",
  Tooltip: "addTooltip",
  Legend: "addLegend",
  Label: "addLabel",
  View: "addView",
  Guide: "addGuide",
  GuideLine: "addGuideLine",
  GuideImage: "addGuideImage",
  GuideText: "addGuideText",
  GuideRegion: "addGuideRegion",
  GuideHtml: "addGuideHtml",
  GuideArc: "addGuideArc",
  GuideRegionFilter: "addGuideRegionFilter",
  GuideDataMarker: "addGuideDataMarker",
  GuideDataRegion: "addGuideDataRegion",
  Facet: "addFacet"
};
const iAdd = {
  addElement(name, config, elemInfo) {
    this[addFuncMap[name]](config, elemInfo, elemInfo.id, elemInfo.viewId, elemInfo.parentInfo);
  },
  getConfigContainer(viewContainer, vId) {
    if (vId) {
      if (!viewContainer.views) {
        viewContainer.views = {};
      }
      viewContainer = viewContainer.views[vId];
      if (!viewContainer) {
        viewContainer = {};
        viewContainer.views[vId] = viewContainer;
      }
    }
    return viewContainer;
  },
  addUniqueElement(config, name, elemInfo, id, vId) {
    const configContainer = this.getConfigContainer(config, vId);
    if (configContainer[name]) ;
    configContainer[name] = elemInfo;
    return id;
  },
  addChart(config, elemInfo, id) {
    return this.addUniqueElement(config, "chart", elemInfo, id, null);
  },
  addView(configContainer, elemInfo, id) {
    if (!configContainer.views) {
      configContainer.views = {};
    }
    configContainer.views[id] = elemInfo;
    return id;
  },
  addAxis(config, elemInfo, id, vId) {
    const configContainer = this.getConfigContainer(config, vId);
    if (!configContainer.axises) {
      configContainer.axises = {};
    }
    configContainer.axises[id] = elemInfo;
    return id;
  },
  addCoord(config, elemInfo, id, vId) {
    return this.addUniqueElement(config, "coord", elemInfo, id, vId);
  },
  addGeom(config, elemInfo, id, vId, isLabel) {
    const configContainer = this.getConfigContainer(config, vId);
    if (!configContainer.geoms) {
      configContainer.geoms = {};
    }
    if (configContainer.geoms[id]) {
      if (isLabel) {
        configContainer.geoms[id].label = elemInfo.label;
      } else {
        if (!configContainer.geoms[id].label) {
          console.log("geom label error");
        }
        elemInfo.label = configContainer.geoms[id].label;
        configContainer.geoms[id] = elemInfo;
      }
    } else {
      configContainer.geoms[id] = elemInfo;
    }
    return id;
  },
  addLabel(config, elemInfo, id, vId, parentInfo) {
    const configContainer = this.getConfigContainer(config, vId);
    if (!configContainer.geoms) {
      configContainer.geoms = {};
    }
    this.addGeom(config, { label: elemInfo }, parentInfo.id, vId, true);
    return id;
  },
  addTooltip(config, elemInfo, id, vId) {
    return this.addUniqueElement(config, "tooltip", elemInfo, id, vId);
  },
  addFacet(config, elemInfo, id, vId) {
    return this.addUniqueElement(config, "facet", elemInfo, id, vId);
  },
  addLegend(config, elemInfo, id, vId) {
    const configContainer = this.getConfigContainer(config, vId);
    if (!configContainer.legends) {
      configContainer.legends = {};
    }
    configContainer.legends[id] = elemInfo;
    return id;
  },
  addGuide(config, elemInfo, id, vId) {
    return this.addUniqueElement(config, "guide", elemInfo, id, vId);
  },
  addTypedGuide(config, name, elemInfo, id, vId, parentInfo) {
    const configContainer = this.getConfigContainer(config, vId);
    let guide = configContainer.guide;
    if (!guide) {
      this.addUniqueElement("guide", {}, parentInfo.id, vId);
      guide = configContainer.guide;
    }
    if (!guide.elements) {
      guide.elements = {};
    }
    elemInfo.type = name;
    guide.elements[id] = elemInfo;
    return id;
  },
  addGuideLine(config, props, id, vId, parentInfo) {
    this.addTypedGuide(config, "line", props, id, vId, parentInfo);
  },
  addGuideImage(config, props, id, vId, parentInfo) {
    this.addTypedGuide(config, "image", props, id, vId, parentInfo);
  },
  addGuideText(config, props, id, vId, parentInfo) {
    this.addTypedGuide(config, "text", props, id, vId, parentInfo);
  },
  addGuideRegion(config, props, id, vId, parentInfo) {
    this.addTypedGuide(config, "region", props, id, vId, parentInfo);
  },
  addGuideHtml(config, props, id, vId, parentInfo) {
    this.addTypedGuide(config, "html", props, id, vId, parentInfo);
  },
  addGuideArc(config, props, id, vId, parentInfo) {
    this.addTypedGuide(config, "arc", props, id, vId, parentInfo);
  },
  addGuideRegionFilter(config, props, id, vId, parentInfo) {
    this.addTypedGuide(config, "regionFilter", props, id, vId, parentInfo);
  },
  addGuideDataMarker(config, props, id, vId, parentInfo) {
    this.addTypedGuide(config, "dataMarker", props, id, vId, parentInfo);
  },
  addGuideDataRegion(config, props, id, vId, parentInfo) {
    this.addTypedGuide(config, "dataRegion", props, id, vId, parentInfo);
  }
};

const deleteFuncMap$1 = {
  Chart: "deleteChart",
  Coord: "deleteCoord",
  Geom: "deleteGeom",
  Axis: "deleteAxis",
  Tooltip: "deleteTooltip",
  Legend: "deleteLegend",
  Label: "deleteLabel",
  View: "deleteView",
  Guide: "deleteGuide",
  GuideLine: "deleteTypedGuide",
  GuideImage: "deleteTypedGuide",
  GuideText: "deleteTypedGuide",
  GuideRegion: "deleteTypedGuide",
  GuideHtml: "deleteTypedGuide",
  GuideArc: "deleteTypedGuide",
  GuideRegionFilter: "deleteTypedGuide",
  GuideDataMarker: "deleteTypedGuide",
  GuideDataRegion: "deleteTypedGuide",
  Facet: "deleteFacet"
};
const iMerge = {
  merge(config, deleteInfos, elementInfos, clear) {
    this.mergeDelete(config, deleteInfos, elementInfos);
    this.mergeUpdate(config, clear);
  },
  mergeDelete(config, deleteInfos, elementInfos) {
    Object.keys(deleteInfos).forEach((id) => {
      const funName = deleteFuncMap$1[elementInfos[id].name];
      let deleteConfigContainer = config;
      if (elementInfos[id].viewId) {
        deleteConfigContainer = config.views[elementInfos[id].viewId];
      }
      if (this[funName]) {
        this[funName](deleteConfigContainer, id, elementInfos[id].parentInfo.id);
      }
    });
  },
  deleteAxis(config, id) {
    if (!config)
      return;
    delete config.axises[id];
  },
  deleteTooltip(config) {
    if (!config)
      return;
    delete config.tooltip;
  },
  deleteCoord(config) {
    if (!config)
      return;
    delete config.coord;
  },
  deleteLegend(config, id) {
    if (!config)
      return;
    delete config.legends[id];
  },
  deleteGuide(config) {
    if (!config)
      return;
    delete config.guide;
  },
  deleteGeom(config, id) {
    if (!config || !config.geoms)
      return;
    delete config.geoms[id];
  },
  deleteLabel(config, id, parentId) {
    if (!config || !config.geoms || !config.geoms[parentId])
      return;
    delete config.geoms[parentId].label;
  },
  deleteFacet(config) {
    if (!config)
      return;
    delete config.facet;
  },
  deleteTypedGuide(config, id) {
    if (!config || !config.guide)
      return;
    delete config.guide.elements[id];
  },
  deleteView(config, id) {
    if (!config)
      return;
    delete config.views[id];
  },
  mergeUpdate(config, clear) {
    this.mergeChart(config, clear);
    this.mergeAxises(config, clear);
    this.mergeCoord(config, clear);
    this.mergeGeoms(config.geoms, clear);
    this.mergeLegends(config.legends, clear);
    this.mergeTooltip(config, clear);
    this.mergeViews(config.views, clear);
    this.mergeGuide(config.guide, clear);
  },
  mergeChart(config, clear) {
    if (config.chart && config.chart.updateProps) {
      config.chart.props = config.chart.updateProps;
    }
    if (clear) {
      delete config.chart.g2Instance;
    }
  },
  mergeAxises(config, clear) {
    const axises = config.axises;
    if (!axises == null) {
      return;
    }
    for (const id in axises) {
      if (axises[id] && axises[id].updateProps) {
        axises[id].props = axises[id].updateProps;
      }
      if (clear) {
        delete axises[id].g2Instance;
      }
    }
    return;
  },
  mergeTooltip(config, clear) {
    if (!config.tooltip)
      return;
    if (clear) {
      delete config.tooltip.g2Instance;
    }
    if (config.tooltip.updateProps) {
      config.tooltip.props = config.tooltip.updateProps;
    }
  },
  mergeCoord(config, clear) {
    if (!config.coord)
      return;
    if (clear)
      delete config.coord.g2Instance;
    if (config.coord.updateProps) {
      config.coord.props = config.coord.updateProps;
    }
  },
  mergeLegends(legends, clear) {
    if (!legends)
      return;
    for (const id in legends) {
      if (legends[id]) {
        const legendConfig = legends[id];
        if (clear) {
          delete legendConfig.g2Instance;
        }
        if (legendConfig.updateProps)
          legendConfig.props = legendConfig.updateProps;
      }
    }
  },
  mergeGeoms(geoms, clear) {
    if (geoms == null)
      return;
    for (const id in geoms) {
      if (geoms[id]) {
        if (clear) {
          delete geoms[id].g2Instance;
          if (geoms[id].label && geoms[id].label.g2Instance) {
            if (geoms[id].label.updateProps) {
              geoms[id].label.props = geoms[id].label.updateProps;
            }
            delete geoms[id].label.g2Instance;
          }
        }
        if (geoms[id].updateProps)
          geoms[id].props = geoms[id].updateProps;
      }
    }
  },
  mergeGuide(guide, clear) {
    if (guide == null)
      return;
    const guides = guide.elements;
    for (const id in guides) {
      if (guides[id]) {
        if (clear) {
          delete guides[id].g2Instance;
        }
        if (guides[id].updateProps) {
          guides[id].props = guides[id].updateProps;
        }
      }
    }
  },
  mergeView(view, clear) {
    if (!view)
      return;
    if (clear && view.g2Instance) {
      delete view.g2Instance;
    }
    if (view.updateProps) {
      view.props = view.updateProps;
    }
    this.mergeCoord(view, clear);
    this.mergeAxises(view, clear);
    this.mergeGeoms(view.geoms, clear);
    this.mergeGuide(view.guide, clear);
  },
  mergeViews(views, clear) {
    if (views == null)
      return;
    for (const id in views) {
      if (views[id]) {
        this.mergeView(views[id], clear);
      }
    }
  }
};

var common = {
  COORD_FUNC_PROPS: ["rotate", "scale", "reflect", "transpose"],
  GEOM_FUNC_PROPS: [
    "position",
    "color",
    "size",
    "shape",
    "opacity",
    "tooltip",
    "style",
    "animate",
    "active",
    "select"
  ]
};

const chartItemEvents = [
  { prop: "onPlotMove", event: "plotmove" },
  { prop: "onPlotEnter", event: "plotenter" },
  { prop: "onPlotLeave", event: "plotleave" },
  { prop: "onPlotClick", event: "plotclick" },
  { prop: "onPlotDblClick", event: "plotdblclick" },
  { prop: "onItemSelected", event: "itemselected" },
  { prop: "onItemUnselected", event: "itemunselected" },
  { prop: "onItemSelectedChange", event: "itemselectedchange" },
  { prop: "onTooltipChange", event: "tooltip:change" },
  { prop: "onTooltipShow", event: "tooltip:show" },
  { prop: "onTooltipHide", event: "tooltip:hide" }
];
const baseEventNames = [
  "mouseenter",
  "mousemove",
  "mouseleave",
  "click",
  "dblclick",
  "mousedown",
  "mouseup",
  "touchstart",
  "touchmove",
  "touchend"
];
const baseEventsPostfix = [
  "Mouseenter",
  "Mousemove",
  "Mouseleave",
  "Click",
  "Dblclick",
  "Mousedown",
  "Mouseup",
  "Touchstart",
  "Touchmove",
  "Touchend"
];
const shapes = [
  "point",
  "area",
  "line",
  "path",
  "interval",
  "schema",
  "polygon",
  "edge",
  "axis-title",
  "axis-label",
  "axis-ticks",
  "axis-line",
  "axis-grid",
  "legend-title",
  "legend-item",
  "legend-marker",
  "legend-text",
  "guide-text",
  "guide-region",
  "guide-line",
  "guide-image",
  "label"
];
const shapesEvtNamePrefix = [
  "onPoint",
  "onArea",
  "onLine",
  "onPath",
  "onInterval",
  "onSchema",
  "onPolygon",
  "onEdge",
  "onAxisTitle",
  "onAxisLabel",
  "onAxisTicks",
  "onAxisLine",
  "onAxisGrid",
  "onLegendTitle",
  "onLegendItem",
  "onLegendMarker",
  "onLegendText",
  "onGuideText",
  "onGuideRegion",
  "onGuideLine",
  "onGuideImage",
  "onLabel"
];
const shapeEvents = [];
for (let i = 0; i < shapes.length; i += 1) {
  for (let j = 0; j < baseEventNames.length; j += 1) {
    shapeEvents.push({
      prop: `${shapesEvtNamePrefix[i]}${baseEventsPostfix[j]}`,
      event: `${shapes[i]}:${baseEventNames[j]}`
    });
  }
}
const chartEvents = chartItemEvents.concat(shapeEvents);
function genBaseEvents() {
  return [
    { prop: "onMouseEnter", event: "mouseenter" },
    { prop: "onMouseMove", event: "mousemove" },
    { prop: "onMouseLeave", event: "mouseleave" },
    { prop: "onClick", event: "click" },
    { prop: "onDblClick", event: "dblclick" },
    { prop: "onMouseDown", event: "mousedown" },
    { prop: "onMouseUp", event: "mouseup" },
    { prop: "onTouchStart", event: "touchstart" },
    { prop: "onTouchMove", event: "touchmove" },
    { prop: "onTouchEnd", event: "touchend" }
  ];
}
function genItemBaseEvents(type) {
  const geomEvents = genBaseEvents();
  Util.map(geomEvents, (key) => {
    const event = key.event;
    key.event = `${type}:${event}`;
    return key;
  });
  return geomEvents;
}
const baseEvents = genBaseEvents();
const baseEventObjectTypes = {
  onMouseEnter: PropTypes.object,
  onMouseMove: PropTypes.object,
  onMouseLeave: PropTypes.object,
  onClick: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onDblClick: PropTypes.object,
  onMouseDown: PropTypes.object,
  onMouseUp: PropTypes.object,
  onTouchStart: PropTypes.object,
  onTouchMove: PropTypes.object,
  onTouchEnd: PropTypes.object
};
const baseEventFuncTypes = {
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
  onDblClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onTouchStart: PropTypes.func,
  onTouchMove: PropTypes.func,
  onTouchEnd: PropTypes.func
};
function bindEvents(chart, EVENTS = {}, props) {
  Util.each(EVENTS, (key) => {
    const { prop, event } = key;
    const fns = props[prop];
    if (Util.isFunction(fns)) {
      chart.on(event, fns);
    } else if (Util.isObject(fns)) {
      for (const name in fns) {
        if (fns[name] !== void 0) {
          chart.on(`${name}:${event}`, fns[name]);
        }
      }
    }
  });
}
function bindBaseEvents(chart, props) {
  bindEvents(chart, baseEvents, props);
}
function updateEvents(chart, EVENTS = {}, props, nextProps) {
  Util.each(EVENTS, (key) => {
    const { prop, event } = key;
    const fns = props[prop];
    const nextFns = nextProps[prop];
    let name;
    if (!Util.shallowEqual(fns, nextFns)) {
      if (Util.isFunction(fns) && Util.isFunction(nextFns)) {
        chart.off(event, fns);
        chart.on(event, nextFns);
      } else if (Util.isObject(fns) && Util.isObject(nextFns)) {
        for (name in fns) {
          if (Object.prototype.hasOwnProperty.call(fns, name)) {
            chart.off(`${name}:${event}`, fns[name]);
          }
        }
        for (name in nextFns) {
          if (Object.prototype.hasOwnProperty.call(nextFns, name)) {
            chart.on(`${name}:${event}`, nextFns[name]);
          }
        }
      }
    }
  });
}
function updateBaseEvents(chart, props, nextProps) {
  updateEvents(chart, baseEvents, props, nextProps);
}
function unbindEvents(chart, EVENTS = {}, props) {
  Util.each(EVENTS, (key) => {
    const { prop, event } = key;
    const fns = props[prop];
    if (Util.isFunction(fns)) {
      chart.off(event, fns);
    } else if (Util.isObject(fns)) {
      for (const name in fns) {
        if (Object.prototype.hasOwnProperty.call(fns, name)) {
          chart.off(`${name}:${event}`, fns[name]);
        }
      }
    }
  });
}
function unbindBaseEvents(chart, props) {
  unbindEvents(chart, baseEvents, props);
}
var EventUtil = {
  baseEventObjectTypes,
  baseEventFuncTypes,
  genBaseEvents,
  genItemBaseEvents,
  bindEvents,
  bindBaseEvents,
  updateEvents,
  updateBaseEvents,
  unbindEvents,
  unbindBaseEvents,
  chartEvents
};

var __defProp$8 = Object.defineProperty;
var __getOwnPropSymbols$4 = Object.getOwnPropertySymbols;
var __hasOwnProp$4 = Object.prototype.hasOwnProperty;
var __propIsEnum$4 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$8 = (obj, key, value) => key in obj ? __defProp$8(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$4 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$4.call(b, prop))
      __defNormalProp$8(a, prop, b[prop]);
  if (__getOwnPropSymbols$4)
    for (var prop of __getOwnPropSymbols$4(b)) {
      if (__propIsEnum$4.call(b, prop))
        __defNormalProp$8(a, prop, b[prop]);
    }
  return a;
};
var __objRest$2 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$4.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$4)
    for (var prop of __getOwnPropSymbols$4(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$4.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const COORD_FUNC_PROPS$1 = common.COORD_FUNC_PROPS;
const GEOM_FUNC_PROPS$1 = common.GEOM_FUNC_PROPS;
var g2Creator = {
  createChart(config) {
    const chartConfig = config.chart;
    const chart = new G2.Chart(chartConfig.props);
    chartConfig.g2Instance = chart;
    return chart;
  },
  executeChartConfig(chart, config) {
    const chartConfig = config.chart;
    const props = chartConfig.props;
    chart.coord("rect", {});
    chart.source(props.data, props.scale);
    if (!config.facet && !props.axis || (!config.facet || props.axis === false)) {
      chart.axis(false);
    }
    chart.legend(false);
    chart.tooltip(false);
    if (props.filter) {
      props.filter.forEach((filterArg) => {
        chart.filter(filterArg[0], filterArg[1]);
      });
    }
    EventUtil.bindEvents(chart, EventUtil.chartEvents, props);
    EventUtil.bindBaseEvents(chart, props);
  },
  coord(chart, config) {
    const coordConfig = config.coord;
    if (!coordConfig || coordConfig.g2Instance) {
      return;
    }
    const _a = coordConfig.props, { type } = _a, others = __objRest$2(_a, ["type"]);
    const coordIns = chart.coord(
      type || "rect",
      undefined(others, COORD_FUNC_PROPS$1)
    );
    undefined(COORD_FUNC_PROPS$1, others, (value, key) => {
      coordIns[key](...value);
    });
    coordConfig.g2Instance = coordIns;
  },
  createLabel(geom, labelConfig) {
    if (!labelConfig || labelConfig.g2Instance) {
      return;
    }
    const _a = labelConfig.props, { content } = _a, labelOthers = __objRest$2(_a, ["content"]);
    if (content) {
      if (undefined(content)) ; else {
        labelConfig.g2Instance = geom.label(content, labelOthers);
      }
    }
  },
  createGeom(chart, geomConfig) {
    if (geomConfig.g2Instance) {
      if (geomConfig.label) {
        this.createLabel(geomConfig.g2Instance, geomConfig.label);
      }
      return;
    }
    const props = geomConfig.props;
    const geom = chart[props.type || "interval"]();
    if (props.adjust) {
      geom.adjust(props.adjust);
    }
    undefined(GEOM_FUNC_PROPS$1, props, (value, key) => {
      geom[key](...value);
    });
    geomConfig.g2Instance = geom;
    this.createLabel(geom, geomConfig.label);
  },
  geoms(chart, config) {
    const geoms = config.geoms;
    if (!geoms) {
      return;
    }
    for (const id in geoms) {
      if (Object.prototype.hasOwnProperty.call(geoms, id)) {
        this.createGeom(chart, geoms[id]);
      }
    }
  },
  legends(chart, config) {
    const legends = config.legends;
    for (const id in legends) {
      if (legends[id]) {
        const legendConfig = legends[id];
        if (legendConfig.g2Instance) {
          return;
        }
        const _a = legendConfig.props, { name, visible } = _a, cfg = __objRest$2(_a, ["name", "visible"]);
        let relVisible = visible;
        if (!Object.prototype.hasOwnProperty.call(legendConfig.props, "visible")) {
          relVisible = true;
        }
        const arg = !relVisible ? relVisible : cfg;
        legendConfig.g2Instance = chart.legend(...name ? [name, arg] : [arg]);
      }
    }
  },
  tooltip(chart, config) {
    const tooltipConfig = config.tooltip;
    if (!tooltipConfig || tooltipConfig.g2Instance) {
      return;
    }
    tooltipConfig.g2Instance = chart.tooltip(__spreadValues$4({}, tooltipConfig.props));
  },
  createAxis(chart, axisConfig) {
    if (axisConfig.g2Instance) {
      return;
    }
    const _a = axisConfig.props, { name, visible } = _a, others = __objRest$2(_a, ["name", "visible"]);
    if (visible || !Object.prototype.hasOwnProperty.call(axisConfig.props, "visible")) {
      axisConfig.g2Instance = chart.axis(name, others);
    } else {
      axisConfig.g2Instance = chart.axis(name, false);
    }
  },
  axises(chart, config) {
    const axises = config.axises;
    for (const id in axises) {
      if (axises[id]) {
        this.createAxis(chart, axises[id]);
      }
    }
  },
  views(chart, config) {
    const views = config.views;
    for (const id in views) {
      if (views[id]) {
        this.createView(chart, views[id]);
      }
    }
  },
  createView(chart, viewConfig) {
    if (viewConfig.parentInfo.name === "Facet") {
      return;
    }
    if (viewConfig.g2Instance) {
      if (viewConfig.filter) {
        viewConfig.filter.forEach((filterArg) => {
          viewConfig.g2Instance.filter(filterArg[0], filterArg[1]);
        });
      }
      this.coord(viewConfig.g2Instance, viewConfig);
      this.axises(viewConfig.g2Instance, viewConfig);
      this.geoms(viewConfig.g2Instance, viewConfig);
      this.guide(viewConfig.g2Instance, viewConfig.guide);
      return;
    }
    const _a = viewConfig.props, { scale, data, instance, axis, filter, geoms } = _a, others = __objRest$2(_a, ["scale", "data", "instance", "axis", "filter", "geoms"]);
    let view;
    if (instance) {
      view = instance;
    } else {
      view = chart.view(__spreadValues$4({}, others));
    }
    if (data) {
      view.source(data, scale);
    }
    if (scale) {
      view.scale(scale);
    }
    if (filter) {
      filter.forEach((filterArg) => {
        view.filter(filterArg[0], filterArg[1]);
      });
    }
    if (!(axis === true || instance)) {
      view.axis(false);
    }
    viewConfig.g2Instance = view;
    this.coord(view, viewConfig);
    this.axises(view, viewConfig);
    this.geoms(view, viewConfig);
    this.guide(view, viewConfig.guide);
  },
  facetView(view, viewConfig) {
    const _a = viewConfig.props, { scale, data, axis, geoms } = _a; __objRest$2(_a, ["scale", "data", "axis", "geoms"]);
    if (data) {
      view.source(data, scale);
    }
    if (scale) {
      view.scale(scale);
    }
    if (axis === false) {
      view.axis(false);
    }
    this.coord(view, viewConfig);
    this.axises(view, viewConfig);
    this.geoms(view, viewConfig);
    this.guide(view, viewConfig.guide);
    iMerge.mergeView(viewConfig, true);
  },
  guide(chart, guide) {
    if (!guide) {
      return;
    }
    const guides = guide.elements;
    for (const id in guides) {
      if (guides[id]) {
        const guideConfig = guides[id];
        if (!guideConfig.g2Instance) {
          const _a = guideConfig.props, others = __objRest$2(_a, ["type"]);
          guideConfig.g2Instance = chart.guide()[guideConfig.type](others);
        }
      }
    }
  },
  facet(chart, config) {
    const facetConfig = config.facet;
    if (!facetConfig || facetConfig.g2Instance) {
      return;
    }
    const _a = facetConfig.props, { children, type } = _a, others = __objRest$2(_a, ["children", "type"]);
    if (!children) {
      chart.facet(type, others);
      return;
    }
    const views = config.views;
    let facetView = null;
    for (const id in views) {
      if (views[id] && views[id].parentInfo.name === "Facet" && views[id].parentInfo.id === facetConfig.id) {
        facetView = views[id];
        break;
      }
    }
    if (facetView) {
      iMerge.mergeView(facetView, true);
      others.eachView = (view) => {
        this.facetView(view, facetView);
      };
      chart.facet(type, others);
    }
  },
  synchronizeG2Add(chart, config) {
    this.coord(chart, config);
    this.axises(chart, config);
    this.legends(chart, config);
    this.tooltip(chart, config);
    this.geoms(chart, config);
    this.facet(chart, config);
    this.views(chart, config);
    this.guide(chart, config.guide);
  },
  synchronizeG2Views(chart, config) {
    const views = config.views;
    for (const id in views) {
      if (views[id]) {
        this.synchronizeG2View(views[id].g2Instance, views[id]);
      }
    }
  },
  synchronizeG2View(view, viewConfig) {
    view.clear();
    this.clearViewG2Instance(viewConfig);
    const _a = viewConfig.props, { scale, data, instance, axis, geoms } = _a; __objRest$2(_a, ["scale", "data", "instance", "axis", "geoms"]);
    if (data) {
      view.source(data, scale);
    }
    if (scale) {
      view.scale(scale);
    }
    if (!(axis === true || instance)) {
      view.axis(false);
    }
    this.coord(view, viewConfig);
    this.axises(view, viewConfig);
    this.geoms(view, viewConfig);
    this.guide(view, viewConfig.guide);
  },
  clearViewG2Instance(viewConfig) {
    if (viewConfig.coord) {
      delete viewConfig.coord.g2Instance;
    }
    if (viewConfig.axises) {
      Object.keys(viewConfig.axises).forEach((id) => {
        delete viewConfig.axises[id].g2Instance;
      });
    }
    if (viewConfig.geoms) {
      Object.keys(viewConfig.geoms).forEach((id) => {
        delete viewConfig.geoms[id].g2Instance;
        if (viewConfig.geoms[id].label) {
          delete viewConfig.geoms[id].label.g2Instance;
        }
      });
    }
    if (viewConfig.guide && viewConfig.guide.elements) {
      Object.keys(viewConfig.guide.elements).forEach((id) => {
        delete viewConfig.guide.elements[id].g2Instance;
      });
    }
  }
};

var __defProp$7 = Object.defineProperty;
var __getOwnPropSymbols$3 = Object.getOwnPropertySymbols;
var __hasOwnProp$3 = Object.prototype.hasOwnProperty;
var __propIsEnum$3 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$3 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$3.call(b, prop))
      __defNormalProp$7(a, prop, b[prop]);
  if (__getOwnPropSymbols$3)
    for (var prop of __getOwnPropSymbols$3(b)) {
      if (__propIsEnum$3.call(b, prop))
        __defNormalProp$7(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$3.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$3)
    for (var prop of __getOwnPropSymbols$3(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$3.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const COORD_FUNC_PROPS = common.COORD_FUNC_PROPS;
const GEOM_FUNC_PROPS = common.GEOM_FUNC_PROPS;
const iUpdate = {
  needRebuildChart(config) {
    if (config.chart.props == null || config.chart.updateProps == null)
      return false;
    const chartProps = config.chart.props;
    const nextChartProps = config.chart.updateProps;
    if (!undefined(chartProps.padding, nextChartProps.padding)   )
      return true;
  },
  needReExecute(config) {
    const geoms = config.geoms;
    if (geoms == null)
      return false;
    for (const id in geoms) {
      if (geoms[id].props && geoms[id].updateProps && (geoms[id].props.type !== geoms[id].updateProps.type || geoms[id].props.color && !geoms[id].updateProps.color || geoms[id].props.size && !geoms[id].updateProps.size || geoms[id].props.shape && !geoms[id].updateProps.shape))
        return true;
    }
    return false;
  },
  synchronizeG2Update(chart, config) {
    this.updateChart(chart, config.chart);
    this.updateAxises(chart, config.axises);
    this.updateTooltip(chart, config);
    this.updateCoord(chart, config);
    this.updateLegends(chart, config.legends);
    this.updateGeoms(chart, config.geoms);
    this.updateGuide(chart, config.guide);
    this.updateFacet(chart, config);
    this.updateViews(chart, config);
  },
  updateChart(chart, chartConfig) {
    if (!chartConfig)
      return;
    const props = chartConfig.props;
    const nextProps = chartConfig.updateProps;
    const { width, height, animate, data, scale } = props;
    const {
      width: nextWidth,
      height: nextHeight,
      animate: nextAnimate,
      data: nextData,
      scale: nextScale
    } = nextProps;
    if (data !== nextData) {
      chart.changeData(nextData);
    }
    if (!undefined(scale, nextScale)) {
      if (undefined(nextScale)) ; else {
        chart.scale(nextScale);
      }
    }
    if (animate !== nextAnimate) {
      chart.animate(nextAnimate);
    }
    if (width !== nextWidth && height !== nextHeight) {
      chart.changeSize(nextWidth, nextHeight);
    } else if (width !== nextWidth) {
      chart.changeWidth(nextWidth);
    } else if (height !== nextHeight) {
      chart.changeHeight(nextHeight);
    }
    EventUtil.updateEvents(chart, EventUtil.chartEvents, chartConfig.props, nextProps);
    EventUtil.updateBaseEvents(chart, chartConfig.updateProps, nextProps);
  },
  updateAxis(chart, axisConfig) {
    const _a = axisConfig.props, { name, visible } = _a, others = __objRest$1(_a, ["name", "visible"]);
    const _b = axisConfig.updateProps, { name: nextName, visible: nextVisible } = _b, nextOthers = __objRest$1(_b, ["name", "visible"]);
    warning(name === nextName, "`name` propertry should not be changed in `<Axis />`");
    if (visible !== nextVisible) {
      chart.axis(name, !!nextVisible);
    }
    if (!undefined(others, nextOthers)) {
      chart.axis(name, nextOthers);
    }
  },
  updateAxises(chart, axises) {
    if (!axises)
      return;
    for (const id in axises) {
      if (axises[id] && axises[id].props && axises[id].updateProps) {
        this.updateAxis(chart, axises[id]);
      }
    }
    return;
  },
  updateTooltip(chart, config) {
    if (!config.tooltip)
      return;
    const props = config.tooltip.props;
    const nextProps = config.tooltip.updateProps;
    if (props == null && nextProps == null) {
      return;
    }
    if (!undefined(props, nextProps)) {
      chart.tooltip(__spreadValues$3({}, nextProps));
    }
  },
  updateCoord(chart, config) {
    const coordConfig = config.coord;
    if (!coordConfig)
      return;
    const props = coordConfig.props;
    const nextProps = coordConfig.updateProps;
    if (props == null || nextProps == null) {
      return;
    }
    const nextAttrs = undefined(nextProps, COORD_FUNC_PROPS.concat(["type"]));
    if (!undefined(props, nextProps)) {
      const g2Instance = chart.coord(nextProps.type, nextAttrs);
      coordConfig.g2Instance = g2Instance;
      undefined(COORD_FUNC_PROPS, nextProps, (value, key) => {
        g2Instance[key](...value);
      });
    }
  },
  updateLegend(chart, legendConfig) {
    const props = legendConfig.props;
    const nextProps = legendConfig.updateProps;
    if (!nextProps)
      return;
    if (undefined(props, nextProps)) ;
    const _a = nextProps, { name, visible } = _a, cfg = __objRest$1(_a, ["name", "visible"]);
    const arg = !visible ? visible : cfg;
    chart.legend(...name ? [name, arg] : [arg]);
  },
  updateLegends(chart, legends) {
    if (legends == null) {
      return;
    }
    for (const id in legends) {
      if (legends[id]) {
        this.updateLegend(chart, legends[id]);
      }
    }
  },
  updateLabel(geom, props, nextProps) {
    if (props == null || nextProps == null) {
      return;
    }
    const _a = props, others = __objRest$1(_a, ["content"]);
    const _b = nextProps, { content: nextContent } = _b, nextOthers = __objRest$1(_b, ["content"]);
    if (!undefined(others, nextOthers) ) {
      if (undefined(nextContent)) ; else {
        geom.label(nextContent, nextOthers);
      }
    }
  },
  updateGeom(chart, geomConfig) {
    const props = geomConfig.props;
    const nextProps = geomConfig.updateProps;
    if (!props || !nextProps)
      return;
    if (props.type !== nextProps.type) {
      return;
    }
    const geom = geomConfig.g2Instance;
    if (undefined(props, nextProps)) ;
    const _a = props, { adjust } = _a, attrs = __objRest$1(_a, ["adjust"]);
    const _b = nextProps, { adjust: nextAdjust } = _b, nextAttrs = __objRest$1(_b, ["adjust"]);
    if (adjust || nextAdjust) {
      geom.adjust(nextAdjust);
    }
    undefined(GEOM_FUNC_PROPS, attrs, nextAttrs, (value, key) => {
      geom[key](...value);
    });
    if (geomConfig.label) {
      this.updateLabel(geom, geomConfig.label.props, geomConfig.label.updateProps);
    }
  },
  updateGeoms(chart, geoms) {
    if (geoms == null) {
      return false;
    }
    for (const id in geoms) {
      if (geoms[id]) {
        this.updateGeom(chart, geoms[id]);
      }
    }
    return false;
  },
  isTypedGuideChanged(config) {
    if (!undefined(config.props, config.updateProps)) {
      return true;
    }
  },
  updateGuide(chart, guide) {
    if (!guide || !guide.elements) {
      return;
    }
    const guides = guide.elements;
    let needRebuildGuide = false;
    for (const id in guides) {
      if (guides[id]) {
        if (guides[id].updateProps || this.isTypedGuideChanged(guides[id])) {
          needRebuildGuide = true;
          break;
        }
      }
    }
    if (needRebuildGuide) {
      iMerge.mergeGuide(guide, true);
      chart.guide().clear();
      g2Creator.guide(chart, guide);
    }
  },
  updateView(chart, viewInfo) {
    if (!viewInfo || !viewInfo.props || !viewInfo.updateProps || viewInfo.parentInfo.name === "Facet") {
      return;
    }
    const view = viewInfo.g2Instance;
    const props = viewInfo.props;
    const nextProps = viewInfo.updateProps;
    const { scale, data, animate, axis, filter } = props;
    const {
      scale: nextScale,
      animate: nextAnimate,
      data: nextData,
      axis: nextAxis,
      filter: nextFilter
    } = nextProps;
    if (animate !== nextAnimate) {
      view.animate(nextAnimate);
    }
    if (data !== nextData) {
      view.changeData(nextData);
    }
    if (!undefined(scale, nextScale)) {
      view.scale(nextScale);
    }
    if (!undefined(filter, nextFilter)) {
      nextFilter.forEach((filterArg) => {
        view.filter(filterArg[0], filterArg[1]);
      });
    }
    if (axis !== nextAxis) {
      view.axis(nextAxis);
    }
    this.updateCoord(view, viewInfo);
    this.updateAxises(view, viewInfo.axises);
    this.updateGeoms(view, viewInfo.geoms);
    this.updateGuide(view, viewInfo.guide);
  },
  updateViews(chart, config) {
    const views = config.views;
    if (!views)
      return;
    for (const id in views) {
      const curView = views[id];
      if (curView && (curView.needReExecute || this.needReExecute(curView))) {
        g2Creator.synchronizeG2View(curView.g2Instance, curView);
        views[id].needReExecute = false;
      } else {
        this.updateView(chart, curView);
      }
    }
  },
  updateFacet(chart, config) {
    const facetConfig = config.facet;
    if (!facetConfig)
      return;
    const props = facetConfig.props;
    const nextProps = facetConfig.updateProps;
    if (props == null || nextProps == null)
      return;
    const _a = props, { type } = _a, others = __objRest$1(_a, ["type"]);
    const _b = nextProps, { type: nextType } = _b, nextOthers = __objRest$1(_b, ["type"]);
    if (type !== nextType || !undefined(others, nextOthers)) {
      facetConfig.props = nextProps;
      g2Creator.facet(chart, config);
    }
  }
};

const deleteFuncMap = {
  Chart: "deleteChart",
  Coord: "deleteCoord",
  Geom: "deleteGeom",
  Axis: "deleteAxis",
  Tooltip: "deleteTooltip",
  Legend: "deleteLegend",
  Label: "deleteLabel",
  View: "deleteView",
  Guide: "deleteGuide",
  GuideLine: "deleteTypedGuide",
  GuideImage: "deleteTypedGuide",
  GuideText: "deleteTypedGuide",
  GuideRegion: "deleteTypedGuide",
  GuideHtml: "deleteTypedGuide",
  GuideArc: "deleteTypedGuide",
  Facet: "deleteFacet"
};
const reExecuteDeleteElements = {
  Geom: true,
  Label: true,
  Facet: true
};
const iDelete = {
  deleteAxis(chart, config, id) {
    const axisConfig = config.axises[id].props;
    chart.axis(axisConfig.name, false);
  },
  deleteTooltip(chart) {
    chart.tooltip(false);
  },
  deleteCoord(chart) {
    chart.coord("rect", {});
  },
  deleteLegend(chart, config, id) {
    const legendConfig = config.legends[id].props;
    chart.legend(...legendConfig.name ? [legendConfig.name, false] : [false]);
  },
  deleteGuide(chart) {
    chart.guide().clear();
  },
  deleteView(chart, config, id) {
    if (!config.views[id].g2Instance)
      return;
    chart.removeView(config.views[id].g2Instance);
    delete config.views[id].g2Instance;
  },
  deleteViewElement(chart, config, deleteInfos, elementInfos) {
    Object.keys(deleteInfos).forEach((id) => {
      const elementInfo = elementInfos[id];
      const viewId = elementInfo.viewId;
      if (viewId) {
        if (reExecuteDeleteElements[elementInfo.name]) {
          config.views[viewId].needReExecute = true;
        } else {
          if (config.views[viewId].g2Instance && this[deleteFuncMap[elementInfo.name]]) {
            this[deleteFuncMap[elementInfo.name]](
              config.views[viewId].g2Instance,
              config.views[viewId],
              elementInfo.id
            );
          }
        }
      }
    });
  },
  needReExecute(deleteInfos, elementInfos) {
    for (const id in deleteInfos) {
      if (reExecuteDeleteElements[elementInfos[id].name] && !elementInfos[id].viewId) {
        return true;
      }
    }
    return false;
  },
  synchronizeG2Delete(chart, config, deleteInfos, elementInfos) {
    Object.keys(deleteInfos).forEach((id) => {
      const funName = deleteFuncMap[elementInfos[id].name];
      if (this[funName] && !elementInfos[id].viewId) {
        this[funName](chart, config, id);
      }
    });
    this.deleteViewElement(chart, config, deleteInfos, elementInfos);
  }
};

var __defProp$6 = Object.defineProperty;
var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2.call(b, prop))
      __defNormalProp$6(a, prop, b[prop]);
  if (__getOwnPropSymbols$2)
    for (var prop of __getOwnPropSymbols$2(b)) {
      if (__propIsEnum$2.call(b, prop))
        __defNormalProp$6(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2)
    for (var prop of __getOwnPropSymbols$2(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
class Processor {
  constructor() {
    this.config = {};
    this.elementInfos = {};
    this.added = false;
    this.initedG2 = false;
    this.updated = false;
    this.deleted = false;
    this.deleteInfos = {};
  }
  calUpdateFlag(name, id) {
    const _a = this.elementInfos[id].props, props = __objRest(_a, ["children"]);
    const _b = this.elementInfos[id].updateProps, nextProps = __objRest(_b, ["children"]);
    if (name === "Chart" || name === "View") {
      const _c = props, { data } = _c, otherProps = __objRest(_c, ["data"]);
      const _d = nextProps, { data: nextData } = _d, nextOtherProps = __objRest(_d, ["data"]);
      if (data !== nextData || !undefined(otherProps, nextOtherProps)) {
        this.updated = true;
      }
    } else {
      if (!undefined(props, nextProps)) {
        this.updated = true;
      }
    }
  }
  addElement(name, id, props, parentInfo, viewId) {
    if (!this.chart && this.initedG2)
      return;
    this.added = true;
    this.elementInfos[id] = {
      id,
      viewId,
      parentInfo,
      name,
      props: __spreadValues$2({}, props)
    };
    if (parentInfo && !this.elementInfos[parentInfo.id]) {
      this.elementInfos[parentInfo.id] = {
        id: parentInfo.id,
        name: parentInfo.name
      };
    }
    iAdd.addElement(name, this.config, this.elementInfos[id]);
  }
  updateElement(name, id, props) {
    this.elementInfos[id].updateProps = __spreadValues$2({}, props);
    this.calUpdateFlag(name, id);
  }
  deleteElement(name, id) {
    if (!this.chart)
      return;
    this.deleteInfos[id] = id;
    this.deleted = true;
  }
  createG2Instance() {
    const config = this.config;
    const chart = g2Creator.createChart(config, this.elementInfos);
    g2Creator.executeChartConfig(chart, config, this.elementInfos);
    g2Creator.synchronizeG2Add(chart, config, this.elementInfos);
    chart.render();
    this.chart = chart;
    this.initedG2 = true;
    this.resetStates();
    return chart;
  }
  destory() {
    this.chart.destroy();
    this.chart = null;
  }
  resetStates() {
    const elems = this.elementInfos;
    for (const id in elems) {
      if (elems[id].updateProps)
        delete elems[id].updateProps;
      if (this.deleteInfos[id]) {
        delete elems[id];
      }
    }
    this.added = false;
    this.updated = false;
    this.deleteInfos = {};
  }
  reExecuteChart() {
    this.chart.clear();
    iMerge.merge(this.config, this.deleteInfos, this.elementInfos, true);
    g2Creator.executeChartConfig(this.chart, this.config, this.elementInfos);
    g2Creator.synchronizeG2Add(this.chart, this.config, this.elementInfos);
    this.chart.repaint();
    this.resetStates();
    return this.chart;
  }
  batchedUpdate() {
    if (this.chart == null)
      return null;
    if (this.config.chart.props.forceUpdate || iUpdate.needRebuildChart(this.config)) {
      iMerge.merge(this.config, this.deleteInfos, this.elementInfos, true);
      this.chart.destroy();
      this.chart = "destroy";
      return this.createG2Instance();
    }
    if (iDelete.needReExecute(this.deleteInfos, this.elementInfos) || iUpdate.needReExecute(this.config)) {
      this.reExecuteChart();
      return this.chart;
    }
    if (this.deleted) {
      iDelete.synchronizeG2Delete(this.chart, this.config, this.deleteInfos, this.elementInfos);
      iMerge.mergeDelete(this.config, this.deleteInfos, this.elementInfos);
    }
    if (this.added) {
      g2Creator.synchronizeG2Add(this.chart, this.config);
    }
    if (this.updated) {
      iUpdate.synchronizeG2Update(this.chart, this.config);
    }
    if (this.added || this.deleted || this.updated) {
      this.chart.repaint();
    }
    iMerge.mergeUpdate(this.config, false);
    this.resetStates();
    return this.chart;
  }
}

var __defProp$5 = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1.call(b, prop))
      __defNormalProp$5(a, prop, b[prop]);
  if (__getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(b)) {
      if (__propIsEnum$1.call(b, prop))
        __defNormalProp$5(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __publicField$5 = (obj, key, value) => {
  __defNormalProp$5(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class PureChart extends Component {
  constructor(props) {
    super(props);
    __publicField$5(this, "getViewId", () => {
    });
    __publicField$5(this, "getParentInfo", () => {
      return {
        id: this.id,
        name: this.name
      };
    });
    __publicField$5(this, "createId", () => {
      this.gId += 1;
      return this.gId;
    });
    __publicField$5(this, "addElement", (name, id, props, parentInfo, viewId) => {
      return this.g2Processor.addElement(name, id, props, parentInfo, viewId);
    });
    __publicField$5(this, "updateElement", (name, id, props, parentInfo, viewId) => {
      this.g2Processor.updateElement(name, id, props, parentInfo, viewId);
    });
    __publicField$5(this, "deleteElement", (name, id, parentInfo) => {
      this.g2Processor.deleteElement(name, id, parentInfo);
    });
    __publicField$5(this, "refHandle", (cw) => {
      if (!this.containerWrap) {
        this.containerWrap = cw;
      }
    });
    this.name = "Chart";
    this.gId = 0;
    this.id = this.createId();
    this.g2Processor = new Processor();
  }
  getChildContext() {
    return {
      addElement: this.addElement,
      updateElement: this.updateElement,
      deleteElement: this.deleteElement,
      createId: this.createId,
      getParentInfo: this.getParentInfo,
      getViewId: this.getViewId
    };
  }
  componentDidMount() {
    this.addElement(
      this.name,
      this.id,
      __spreadProps(__spreadValues$1({}, this.props), {
        container: this.containerWrap
      })
    );
    this.chart = this.g2Processor.createG2Instance();
    this.notifyG2Instance();
  }
  componentDidUpdate() {
    this.updateElement(
      this.name,
      this.id,
      __spreadProps(__spreadValues$1({}, this.props), {
        container: this.containerWrap
      })
    );
    const newChart = this.g2Processor.batchedUpdate();
    if (this.chart !== newChart) {
      this.chart = newChart;
      this.notifyG2Instance();
    }
  }
  componentWillUnmount() {
    this.g2Processor.destory();
    this.chart = null;
    this.containerWrap = null;
  }
  getG2Instance() {
    return this.chart;
  }
  notifyG2Instance() {
    if (this.props.onGetG2Instance) {
      this.props.onGetG2Instance(this.chart);
    }
  }
  render() {
    return /* @__PURE__ */ React.createElement("div", { ref: this.refHandle }, this.props.children);
  }
}
__publicField$5(PureChart, "propTypes", {
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.object
  ]),
  scale: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  animate: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number.isRequired,
  onGetG2Instance: PropTypes.func
});
__publicField$5(PureChart, "childContextTypes", {
  addElement: PropTypes.func,
  updateElement: PropTypes.func,
  deleteElement: PropTypes.func,
  createId: PropTypes.func,
  getParentInfo: PropTypes.func,
  getViewId: PropTypes.func
});

var __defProp$4 = Object.defineProperty;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$4 = (obj, key, value) => {
  __defNormalProp$4(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
warning(React.PureComponent, "`React.PureComponent` needs React >=15.3.0");
class Empty extends (React.PureComponent || React.Component) {
  render() {
    const { width, height, placeholder } = this.props;
    return /* @__PURE__ */ React.createElement("div", { style: { width, height } }, placeholder);
  }
}
__publicField$4(Empty, "propTypes", {
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  placeholder: PropTypes.node
});
__publicField$4(Empty, "defaultProps", {
  width: "100%",
  placeholder: /* @__PURE__ */ React.createElement("div", { style: { position: "relative", top: "48%", textAlign: "center" } }, "\u6682\u65E0\u6570\u636E")
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }
  unstable_handleError(error, info) {
    this.setState({ hasError: true });
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ React.createElement("h1", null, "bizcharts error.");
    }
    return this.props.children;
  }
}

var __defProp$3 = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp$3(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp$3(a, prop, b[prop]);
    }
  return a;
};
var __publicField$3 = (obj, key, value) => {
  __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function hasSource(source) {
  let flag = true;
  if (source == null || source.length === 0) {
    flag = false;
  }
  return !!flag;
}
class Chart extends (React.PureComponent || React.Component) {
  constructor() {
    super(...arguments);
    __publicField$3(this, "_refCallback", (c) => {
      if (c) {
        this.chart = c.getG2Instance();
      }
    });
    __publicField$3(this, "hasViewSource", () => {
      let hasViewSource = false;
      React.Children.map(this.props.children, (child) => {
        if (!hasViewSource && typeof child.type === "function" && child.type.name === "View" && child.props.data && hasSource(child.props.data)) {
          hasViewSource = true;
        }
      });
      return hasViewSource;
    });
  }
  getG2Instance() {
    return this.chart;
  }
  render() {
    const { data, width, height, placeholder, className, style } = this.props;
    return /* @__PURE__ */ React.createElement("div", { className, style }, hasSource(data) || this.hasViewSource() || !placeholder ? /* @__PURE__ */ React.createElement(PureChart, __spreadValues({ ref: this._refCallback }, this.props)) : /* @__PURE__ */ React.createElement(
      Empty,
      {
        width,
        height,
        placeholder: placeholder === true ? void 0 : placeholder
      }
    ));
  }
}
class BChart extends React.Component {
  render() {
    return /* @__PURE__ */ React.createElement(ErrorBoundary, null, /* @__PURE__ */ React.createElement(Chart, __spreadValues({}, this.props)));
  }
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
  __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class BaseComponent extends Component {
  constructor(props, name) {
    super(props);
    __publicField$2(this, "getParentInfo", () => {
      return {
        id: this.id,
        name: this.name
      };
    });
    this.name = name;
  }
  getChildContext() {
    return {
      addElement: this.context.addElement,
      updateElement: this.context.updateElement,
      deleteElement: this.context.deleteElement,
      createId: this.context.createId,
      getParentInfo: this.getParentInfo,
      getViewId: this.context.getViewId
    };
  }
  componentWillMount() {
    const context = this.context;
    this.id = context.createId();
    context.addElement(
      this.name,
      this.id,
      this.props,
      context.getParentInfo(),
      context.getViewId()
    );
  }
  componentWillReceiveProps(nextProps) {
    this.context.updateElement(
      this.name,
      this.id,
      nextProps,
      this.context.getParentInfo(),
      this.context.getViewId()
    );
  }
  componentWillUnmount() {
    this.context.deleteElement(this.name, this.id);
  }
  render() {
    let children = this.props.children;
    if (children) {
      if (children.length) {
        children = /* @__PURE__ */ React.createElement("div", null, children);
      }
    } else {
      children = null;
    }
    return children;
  }
}
__publicField$2(BaseComponent, "contextTypes", {
  addElement: PropTypes.func,
  updateElement: PropTypes.func,
  deleteElement: PropTypes.func,
  createId: PropTypes.func,
  getParentInfo: PropTypes.func,
  getViewId: PropTypes.func
});
__publicField$2(BaseComponent, "childContextTypes", {
  addElement: PropTypes.func,
  updateElement: PropTypes.func,
  deleteElement: PropTypes.func,
  createId: PropTypes.func,
  getParentInfo: PropTypes.func,
  getViewId: PropTypes.func
});
function generateBaseTypedComponent(name) {
  class TypedComponent extends BaseComponent {
    constructor(props) {
      super(props, name);
    }
    getChildContext() {
      return {
        addElement: this.context.addElement,
        updateElement: this.context.updateElement,
        deleteElement: this.context.deleteElement,
        createId: this.context.createId,
        getParentInfo: this.getParentInfo,
        getViewId: this.context.getViewId
      };
    }
  }
  __publicField$2(TypedComponent, "contextTypes", {
    addElement: PropTypes.func,
    updateElement: PropTypes.func,
    deleteElement: PropTypes.func,
    createId: PropTypes.func,
    getParentInfo: PropTypes.func,
    getViewId: PropTypes.func
  });
  __publicField$2(TypedComponent, "childContextTypes", {
    addElement: PropTypes.func,
    updateElement: PropTypes.func,
    deleteElement: PropTypes.func,
    createId: PropTypes.func,
    getParentInfo: PropTypes.func,
    getViewId: PropTypes.func
  });
  return TypedComponent;
}
BaseComponent.generateBaseTypedComponent = generateBaseTypedComponent;

var index$4 = BaseComponent.generateBaseTypedComponent("Coord");

var index$3 = BaseComponent.generateBaseTypedComponent("Axis");

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Legend extends BaseComponent {
  constructor(props) {
    super(props, "Legend");
  }
}
__publicField$1(Legend, "contextTypes", {
  addElement: PropTypes.func,
  updateElement: PropTypes.func,
  deleteElement: PropTypes.func,
  createId: PropTypes.func,
  getParentInfo: PropTypes.func,
  getViewId: PropTypes.func
});
__publicField$1(Legend, "childContextTypes", {
  addElement: PropTypes.func,
  updateElement: PropTypes.func,
  deleteElement: PropTypes.func,
  createId: PropTypes.func,
  getParentInfo: PropTypes.func,
  getViewId: PropTypes.func
});
__publicField$1(Legend, "defaultProps", {
  visible: true
});

var index$2 = BaseComponent.generateBaseTypedComponent("Tooltip");

var index$1 = BaseComponent.generateBaseTypedComponent("Geom");

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class View extends BaseComponent {
  constructor(props) {
    super(props, "View");
    __publicField(this, "getViewId", () => {
      return this.id;
    });
  }
  getChildContext() {
    return {
      addElement: this.context.addElement,
      updateElement: this.context.updateElement,
      deleteElement: this.context.deleteElement,
      createId: this.context.createId,
      getParentInfo: this.getParentInfo,
      getViewId: this.getViewId
    };
  }
}
__publicField(View, "contextTypes", {
  addElement: PropTypes.func,
  updateElement: PropTypes.func,
  deleteElement: PropTypes.func,
  createId: PropTypes.func,
  getParentInfo: PropTypes.func,
  getViewId: PropTypes.func
});
__publicField(View, "childContextTypes", {
  addElement: PropTypes.func,
  updateElement: PropTypes.func,
  deleteElement: PropTypes.func,
  createId: PropTypes.func,
  getParentInfo: PropTypes.func,
  getViewId: PropTypes.func
});

const Guide = BaseComponent.generateBaseTypedComponent("Guide");
Guide.Line = BaseComponent.generateBaseTypedComponent("GuideLine");
Guide.Image = BaseComponent.generateBaseTypedComponent("GuideImage");
Guide.Text = BaseComponent.generateBaseTypedComponent("GuideText");
Guide.Region = BaseComponent.generateBaseTypedComponent("GuideRegion");
Guide.Html = BaseComponent.generateBaseTypedComponent("GuideHtml");
Guide.Arc = BaseComponent.generateBaseTypedComponent("GuideArc");
Guide.RegionFilter = BaseComponent.generateBaseTypedComponent("GuideRegionFilter");
Guide.DataMarker = BaseComponent.generateBaseTypedComponent("GuideDataMarker");
Guide.DataRegion = BaseComponent.generateBaseTypedComponent("GuideDataRegion");

var index = BaseComponent.generateBaseTypedComponent("Facet");

var components = /*#__PURE__*/Object.create({
  __proto__: null,
  Axis: index$3,
  Chart: BChart,
  Coord: index$4,
  Facet: index,
  Geom: index$1,
  Guide: Guide,
  Legend: Legend,
  Tooltip: index$2,
  View: View
});

G2__default.Global.trackingInfo = { bizcharts: "3.2.2-beta.4" };
const BizCharts = Util.mix(components, {
  G2: G2__default,
  Util,
  Shape,
  Animate,
  PathUtil,
  track(enable = false) {
    G2__default.track(enable);
  },
  setTheme(theme) {
    let themeObj = theme;
    if (typeof theme === "string" && Themes[theme]) {
      themeObj = Themes[theme];
    }
    G2__default.Global.setTheme(themeObj);
  }
});
exports.default = BizCharts;
module.exports = BizCharts;
