import Player from './Player.svelte'

export default function (Provider) {
  return function withPlayer (options) {
    if (!options.props) options.props = {}
    options.props.Provider = Provider
    return new Player(options)
  }
}
