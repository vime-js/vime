import Vue from 'vue';
import { createDispatcher, PlayerProp, usePlayerContext } from '@vime/core';

const findPlayer = (component?: Vue): HTMLVimePlayerElement | null => {
  if (!component) return null;
  const players = Array.from(document.querySelectorAll('vime-player'));
  return players.find((player) => player.contains(component.$el)) ?? null;
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
      (this as any).playerDispatch(prop, value);
    },
  }), {}),

  mounted(this: any) {
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
    (this as any).unbindPlayerContext();
  },
});
