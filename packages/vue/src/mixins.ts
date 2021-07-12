import {
  createDispatcher,
  PlayerProp,
  usePlayerContext,
  findPlayer,
} from '@vime/core';

export const Mixin = (props: PlayerProp[]) => ({
  data() {
    return {
      player: null,
      playerDispatch: () => {},
      unbindPlayerContext: undefined,
      ...props.reduce((prev, prop) => ({ ...prev, [prop]: undefined }), {}),
    };
  },

  watch: props.reduce(
    (prev, prop) => ({
      ...prev,
      [prop](value) {
        (this as any).playerDispatch(prop, value);
      },
    }),
    {},
  ),

  async mounted(this: any) {
    this.playerDispatch = () => {};
    this.unbindPlayerContext = undefined;
    this.player = await findPlayer(this);
    if (this.player === null) return;
    this.playerDispatch = createDispatcher(this.$el);
    this.unbindPlayerContext = await usePlayerContext(
      this.$el,
      props,
      (prop, value) => {
        this[prop] = value;
      },
      this.player,
    );
  },

  beforeDestroy(this: any) {
    this.unbindPlayerContext?.();
  },
});
