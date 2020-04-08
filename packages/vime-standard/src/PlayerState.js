// Treeshaking safe.
const PlayerState = function PlayerState() {};
PlayerState.IDLE = 1;
PlayerState.CUED = 2;
PlayerState.PLAYING = 3;
PlayerState.PAUSED = 4;
PlayerState.BUFFERING = 5;
PlayerState.ENDED = 6;
export default PlayerState;
