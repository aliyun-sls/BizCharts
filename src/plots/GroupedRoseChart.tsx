import 'react';
import warn from 'warning';
import get from '@antv/util/lib/get';
import set from '@antv/util/lib/set';
import { Rose, RoseOptions as options } from '@antv/g2plot/lib/plots/rose';
import createPlot, { BasePlotOptions } from '../createPlot';
import { polyfillOptions } from './core/polyfill';
import { replaceApi, replaceLegend } from './core/replaceApi';
import { LengendAPIOptions, TooltipAPIOptions, LabelAPIOptions } from './core/interface';

const REPLACEAPILIST = [{
  sourceKey: 'groupField',
  targetKey: 'seriesField',
  notice: '请使用seriesField替代',
}, {
  sourceKey: 'categoryField',
  targetKey: 'xField',
  notice: '请使用xField替代',
}, {
  sourceKey: 'radiusField',
  targetKey: 'yField',
  notice: '请使用yFeild替代',
}];

interface GroupedRoseOptions extends options, BasePlotOptions {
  /** 请使用seriesField替代 */
  groupField?: string;
  /** 请使用xField替代 */
  categoryField?: string;
  /** 请使用yFeild替代 */
  radiusField?: string;
  legend?: LengendAPIOptions;
  tooltip?: TooltipAPIOptions;
  label?: LabelAPIOptions;
}

const polyfill = (opt: GroupedRoseOptions): GroupedRoseOptions => {
  warn(true, '<GroupedRose /> 即将在4.2.0后废弃，请使用<Rose />。文档查看：')

  const options = polyfillOptions(opt);
  replaceApi(REPLACEAPILIST, options);

  replaceLegend(options);

  if (get(options, 'tooltip.visible') === false) {
    set(options, 'tooltip', false);
  }

  if (get(options, 'label.visible') === false) {
    set(options, 'label', false);
  }

  return { ...options, isGroup: true };
}

export { GroupedRoseOptions };

export default createPlot<GroupedRoseOptions>(Rose, 'GroupedRoseChart', polyfill);
