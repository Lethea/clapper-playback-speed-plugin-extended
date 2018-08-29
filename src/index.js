import { Events, Styler, UICorePlugin, template } from 'clappr';
import Mousetrap from 'mousetrap';
import pluginHtml from './public/template.html';
import pluginStyle from './public/style.scss';

let DEFAULT_PLAYBACK_SPEEDS = [
  { value: 0.25, label: '0.25x' },
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1.0, label: 'Normal' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 1.75, label: '1.75x' },
  { value: 2.0, label: '2x' },
  { value: 3.0, label: '3x' },
];
const DEFAULT_PLAYBACK_SPEED = 1.0;
const DEFAULT_SHORTCUTS = {
  speedUp: '=',
  speedDown: '-',
};

class PlaybackSpeed extends Array {
  constructor({ current, onChange }, ...items) {
    const res = items.length ? items : DEFAULT_PLAYBACK_SPEEDS;
    super(...res);
    this._values = this.map(item => item.value);
    const speedIndex = this._values.indexOf(current || DEFAULT_PLAYBACK_SPEED);
    this.onChange = onChange || (() => {});

    this.goto(speedIndex);
  }

  get current() {
    return this[this.index];
  }

  setCurrent = val => {
    val = parseFloat(val);
    const index = this._values.indexOf(val);
    return this.goto(index);
  };

  goto = index => {
    this.index = index;
    this.current = this[index];
    this.onChange(this[index], index, this);
    return this[index];
  };

  next = () => {
    const next = this.index + 1;
    if (next >= this.length) {
      return this[this.index];
    }
    this.goto(next);
  };

  prev = () => {
    const prev = this.index - 1;
    if (prev < 0) {
      return this[0];
    }
    this.goto(prev);
  };
}

export default class PlaybackSpeedPlugin extends UICorePlugin {
  static type = 'core';
  static MEDIACONTROL_PLAYBACKSPEED = 'playbackSpeed';

  constructor(core) {
    super(core);

    const { options } = core;
    this.playbackSpeed = new PlaybackSpeed({
      onChange: this.handlePlaybackChange,
    });
  }

  get name() {
    return 'playback-speed';
  }

  get template() {
    return template(pluginHtml);
  }

  get attributes() {
    return {
      'data-clappr-playback-speed': '',
      class: this.name,
    };
  }

  get events() {
    return {
      'click [data-playback-speed-decrease]': 'handleSpeedDecrease',
      'click [data-playback-speed-increase]': 'handleSpeedIncrease',
      'click [data-playback-speed-value]': 'handleSpeedChange',
      'click [data-playback-speed-menu]': 'handleMenuToggle',
    };
  }

  get shouldRender() {
    return !!this.core.getCurrentContainer();
  }

  handleMenuToggle(ev) {
    this.$('.playback-speed__menu').toggle();
  }

  handleSpeedDecrease(ev) {
    this.playbackSpeed.prev();
  }

  handleSpeedIncrease(ev) {
    this.playbackSpeed.next();
  }

  handleSpeedChange(ev) {
    ev.preventDefault();
    const speed = ev.target.dataset.playbackSpeedValue;
    this.playbackSpeed.setCurrent(speed);
    this.handleMenuToggle();
  }

  handlePlaybackChange = ({ value, label }) => {
    if (!this.shouldRender) {
      return;
    }

    this.$('.playback-speed__current').text(label);
    this.core.$el.find('video, audio').get(0).playbackRate = value;
  };

  bindEvents() {
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this.reload);
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_RENDERED, this.render);
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_HIDE, this.handleMenuHide);
    Mousetrap.bind(DEFAULT_SHORTCUTS.speedUp, this.handleSpeedIncrease.bind(this));
    Mousetrap.bind(DEFAULT_SHORTCUTS.speedDown, this.handleSpeedDecrease.bind(this));
  }

  unBindEvents() {
    Mousetrap.unbind(DEFAULT_SHORTCUTS.speedUp, DEFAULT_SHORTCUTS.speedDown);
    this.stopListening(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED);
    this.stopListening(this.core.mediaControl, Events.MEDIACONTROL_RENDERED);
    this.stopListening(this.core.mediaControl, Events.MEDIACONTROL_HIDE);
  }

  reload() {
    this.unBindEvents();
    this.bindEvents();
  }

  render() {
    DEFAULT_PLAYBACK_SPEEDS = this.core.options.playbackSpeedPluginConfig === undefined ? DEFAULT_PLAYBACK_SPEEDS :  this.core.options.playbackSpeedPluginConfig.playbackSpeeds;

    if (!this.shouldRender) {
      return this;
    }

    const html = template(pluginHtml, {
      speeds: DEFAULT_PLAYBACK_SPEEDS,
      currentSpeed: this.playbackSpeed.current.label,
    });
    const css = Styler.getStyleFor(pluginStyle, {
      baseUrl: this.core.options.baseUrl,
    });

    this.$el.html(html);
    this.$el.append(css);

    this.core.mediaControl.$('.media-control-right-panel').append(this.el);
    return this;
  }
}
