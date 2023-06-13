import G2, { Shape, PathUtil, Animate } from '@antv/g2/src/core';
import Util from './shared/util';
import Themes from './themes';

import Chart from './components/Chart';
import Coord from './components/Coord';
import Axis from './components/Axis';
import Legend from './components/Legend';
import Tooltip from './components/Tooltip';
import Geom from './components/Geom';
import View from './components/View';
import Guide from './components/Guide';
import Label from './components/Label'
import Facet from './components/Facet';
export {
  Chart,
  Coord,
  Axis,
  Legend,
  Tooltip,
  Geom,
  View,
  Guide,
  Label,
  Facet
}


G2.Global.trackingInfo = { bizcharts: '3.2.2-beta.4' };

G2.Global.animate = false;

// const BizCharts = Util({}, {
//   G2,
//   Util,
//   Shape,
//   Animate,
//   PathUtil,
//   track(enable = false) {
//     // for srs
//     G2.track(enable);
//   },
//   setTheme(theme) {
//     let themeObj = theme;
//     if (typeof theme === 'string' && Themes[theme]) {
//       themeObj = Themes[theme];
//     }

//     G2.Global.setTheme(themeObj);
//   },
// });

function track(enable = false) {
  // for srs
  G2.track(enable);
}

function setTheme(theme) {
  let themeObj = theme;
  if (typeof theme === 'string' && Themes[theme]) {
    themeObj = Themes[theme];
  }

  G2.Global.setTheme(themeObj);
}

export {
  G2,
  Util,
  Shape,
  Animate,
  PathUtil,
  track,
  setTheme
}

// exports.default = BizCharts;
// module.exports = BizCharts;
// export default BizCharts
