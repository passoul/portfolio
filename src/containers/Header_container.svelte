<script>
  	import RouterLink from '@spaceavocado/svelte-router/component/link';
	import Avatar from "../components/avatar/Avatar.svelte";
	import Navbar from "../components/navbar/Navbar.svelte";

	export let avatar;
	export let navlists;
	export let switchBtn;
</script>

<div class="w-full container mx-auto flex flex-wrap items-center justify-between mt-0">
	<div class="pl-4 lg:flex hidden">
		<a href="<@HOME@>" class="px-2 md:px-8 flex items-center">
			<Avatar avatar={avatar} avatarClass="hidden lg:block w-10 h-10"/>
		</a>
	</div>
	<Navbar {navlists} {switchBtn} on:BurgerBtnAction/>
</div>

<style>
	header{
		@apply transition ease-in duration-100;
	}
	:global(.mode-dark header) {
		@apply bg-opacity-75 !important;
	}
</style>