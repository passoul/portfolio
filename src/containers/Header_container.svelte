<script>
	import Navbar from "../components/navbar/Navbar.svelte";
	import Toggle from "../components/buttons/toggle/Toggle.svelte";

	export let navlists;

</script>

<header>
	<Navbar navlists={navlists}/>
	<Toggle/>
</header>
<style>
	@media screen and (min-width: 1024px) {
		header {
			background-image: url("/static/media/passoul.png");
			background-repeat: no-repeat;
			background-position: right;
			background-attachment: scroll;
			height: 478px;
		}
	}
</style>