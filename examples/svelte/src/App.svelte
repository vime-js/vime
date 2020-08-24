<script lang="ts">
	import { usePlayerStore } from '@vime/svelte';

	// Custom UI component.
	import TapSidesToSeek from './TapSidesToSeek.svelte';

	let player: HTMLVimePlayerElement;

	/**
	 * All player properties are available through the store.
	 */
	const { paused } = usePlayerStore(() => player);

	const onPlaybackReady = () => {
		// ...
	};

	$: console.log($paused);
</script>

<div id="container">
	<vime-player
		on:vPlaybackReady={onPlaybackReady}
		bind:this={player}
	>
		<vime-video cross-origin="true" poster="http://localhost:3335/poster.png">
			<source data-src="http://localhost:3335/720p.mp4" type="video/mp4">
		</vime-video>

		<vime-default-ui>
			<!-- Custom UI component. -->
			<TapSidesToSeek />
		</vime-default-ui>
	</vime-player>
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