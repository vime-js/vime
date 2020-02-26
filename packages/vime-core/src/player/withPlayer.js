import VimePlayer from './Player.svelte';

export default function (Provider) {
  function Player (options) {
    if (!options.props) options.props = {};
    options.props.Provider = Provider.default;
    return new VimePlayer(options);
  }
  Player.canPlay = Provider.canPlay;
  return Player;
}
