<script>
	import "../app.css";
	import Parallax from "$lib/components/Parallax.svelte";

	let { children } = $props();
	let bgURLs = [
		"images/bg-layer0.png",
		"images/bg-layer1.png",
		"images/bg-layer2.png",
		"images/bg-layer3.png",
		"images/bg-layer4.png",
	];
	let bgSpeeds = [0.01, 0.03, 0.05, 0.08, 0.2];
</script>

<div class="background">
	<Parallax imageURLs={bgURLs} speeds={bgSpeeds} />
</div>

<div class="app">
	<main>
		{@render children()}
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
