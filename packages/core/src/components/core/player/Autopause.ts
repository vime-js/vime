let players: HTMLVimePlayerElement[] = [];

export class Autopause {
  constructor(private readonly player: HTMLVimePlayerElement) {
    players.push(player);
  }

  willPlay() {
    players.forEach((p) => {
      try {
        // eslint-disable-next-line no-param-reassign
        if (p !== this.player && p.autopause) p.paused = true;
      } catch (e) {
        // Might throw when testing because `disconnectCallback` isn't called.
      }
    });
  }

  destroy() {
    players = players.filter((p) => p !== this.player);
  }
}
