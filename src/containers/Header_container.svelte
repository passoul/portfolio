<script>
  	import RouterLink from '@spaceavocado/svelte-router/component/link';
	import Avatar from "../components/avatar/Avatar.svelte";
	import Navbar from "../components/navbar/Navbar.svelte";

</script>

<div class="w-full container mx-auto flex flex-wrap items-center justify-between mt-0">
	<div class="pl-4 lg:flex hidden">
		<RouterLink to='<@HOME@>'>
		<Avatar avatarClass="hidden lg:block" position="header"/>
		</RouterLink>
	</div>
	<Navbar />
</div>