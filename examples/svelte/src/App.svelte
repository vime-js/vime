<script lang="ts">
	let currentTime = 0;

	const onTimeUpdate = (event: CustomEvent<number>) => {
		currentTime = event.detail;
	}

	const onSeekBackward = () => {
		currentTime -= 5;
	};

	const onSeekForward = () => {
		currentTime += 5;
	};

	$: console.log(currentTime);
</script>

<div id="container">
	<vime-player 
		current-time={currentTime} 
		on:vCurrentTimeChange={onTimeUpdate}
	>
		<vime-video cross-origin="true" poster="http://localhost:3335/poster.png">
			<source data-src="http://localhost:3335/720p.mp4" type="video/mp4">
		</vime-video>

		<vime-default-ui></vime-default-ui>
	</vime-player>

	<div id="buttons">
		<button on:click={onSeekBackward}>-5s</button>
		<button on:click={onSeekForward}>+5s</button>
	</div>
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

	#buttons {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		margin-top: 16px;
	}

	#buttons > button {
		margin-left: 8px;
	}
	
	#buttons > button:first-child {
		margin-left: 0px;
	}
</style>