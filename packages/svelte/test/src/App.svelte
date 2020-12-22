<script lang="ts">
	import {
		Player,
		Video,
		Youtube,
		Vimeo,
		Dailymotion,
		Audio,
		Hls, 
		Dash,
		DefaultUi,
		usePlayerStore,
	} from '../../src/svelte';

	// Custom UI component.
	import TapSidesToSeek from './TapSidesToSeek.svelte';

	// Obtain a ref if you need to call any methods.
	let player: typeof Player;

	/**
	 * All player properties are available through the store. If you prefer, you could also pass 
	 * properties directly to the player and listen for events.
	 */
	const { paused } = usePlayerStore(() => player);

	const onPlaybackReady = () => {
		// ...
	};

	$: console.log($paused);
</script>

<div id="container">
	<Player on:vPlaybackReady={onPlaybackReady} bind:this={player}>
		<!-- YOUTUBE -->
		<!-- <Youtube videoId="DyTCOwB0DVw" /> -->

		<!-- VIMEO -->
		<!-- <Vimeo videoId="411652396" /> -->

		<!-- DAILYMOTION -->
		<!-- <Dailymotion videoId="k3b11PemcuTrmWvYe0q" /> -->

		<!-- VIDEO -->
		<!-- <Video crossOrigin="anonymous" poster="https://media.vimejs.com/poster.png">
			<source data-src="https://media.vimejs.com/720p.mp4" type="video/mp4" />
			<track default kind="subtitles" src="https://media.vimejs.com/subs/english.vtt" srcLang="en" label="English" />
			<track kind="subtitles" src="https://media.vimejs.com/subs/spanish.vtt" srcLang="es" label="Spanish" />
		</Video> -->

		<!-- AUDIO -->
		<!-- <Audio crossOrigin="anonymous">
			<source data-src="https://media.vimejs.com/audio.mp3" type="audio/mp3" />
		</Audio> -->

		<!-- HLS -->
		<!-- <Hls crossOrigin="anonymous" poster="https://media.vimejs.com/poster.png">
			<source data-src="https://media.vimejs.com/hls/index.m3u8" type="application/x-mpegURL" />
		</Hls> -->

		<!-- DASH -->
		<!-- <Dash
			cross-origin="anonymous"
			src="https://media.vimejs.com/mpd/manifest.mpd"
			poster="https://media.vimejs.com/poster.png"
		/> -->

		<DefaultUi>
			<!-- Custom UI Component. -->
			<TapSidesToSeek />
		</DefaultUi>
	</Player>
</div>

<style>
	:global(html),
	:global(body) {
		width: 100%;
		height: 100%;
	}

	:global(body) {
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	#container {
		width: 100%;
		max-width: 960px;
	}
</style>