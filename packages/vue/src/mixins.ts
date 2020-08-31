import { createDispatcher, PlayerProp, usePlayerContext } from '@vime/core';

const findPlayer = (component: any): HTMLVimePlayerElement | null => {
  while (!(/^VIME-PLAYER$/.test(component.$el?.nodeName))) {
    // eslint-disable-next-line no-param-reassign
    component = component.$parent;
  }

  return component.$el;
};

export const VimeMixin = (props: PlayerProp[]) => ({
  data() {
    return {
      player: null,
      playerDispatch: () => {},
      unbindPlayerContext: () => {},
      ...(props.reduce((prev, prop) => ({ ...prev, [prop]: undefined }), {})),
    };
  },

  watch: props.reduce((prev, prop) => ({
    ...prev,
    [prop](value) {
      this.playerDispatch(prop, value);
    },
  }), {}),

  mounted() {
    this.player = findPlayer(this);
    if (this.player === null) return;
    this.playerDispatch = createDispatcher(this.$el);
    this.unbindPlayerContext = usePlayerContext(
      this.$el,
      props,
      ((prop, value) => { this[prop] = value; }),
      this.player,
    );
  },

  beforeDestroy() {
    this.unbindPlayerContext();
  },
});
