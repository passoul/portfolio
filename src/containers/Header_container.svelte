<script>
	import Avatar from "../components/avatar/Avatar.svelte";
	import Navbar from "../components/navbar/Navbar.svelte";
	let y;

	export let avatar;
	export let navlists;
	export let switchBtn;

	$: (() => {
		let scrollpos = window.scrollY;
		let header = document.getElementById("header");
		
		if(y > 10){
			header.classList.add("shadow");
		}
		if(y < 10){
			header.classList.remove("shadow");
		}
	})();

</script>
<svelte:window  bind:scrollY={y}/>

<header class="fixed w-full z-30 top-0 dark:bg-black bg-white bg-opacity-75" id="header">
	<div class="w-full container mx-auto flex flex-wrap items-center justify-between mt-0">
		<div class="pl-4 lg:flex items-center">
			<a href="/" class="px-2 md:px-8 flex items-center">
			<Avatar avatar={avatar} avatarClass="hidden lg:block w-10 h-10" widthHeight="40"/>
			</a>
		</div>
		<Navbar {navlists} {switchBtn}/>
	</div>
</header>

<style>
	header{
		@apply transition ease-in duration-100;
	}
	:global(.mode-dark header) {
		@apply bg-opacity-75 !important;
	}
</style>