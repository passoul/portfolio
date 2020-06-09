<script>
	import Copyright from "../components/copyright/Copyright.svelte";
	import Social from "../components/buttons/social/Social.svelte";

</script>

<div class="container mx-auto px-8 w-full flex flex-col py-5 lg:flex-row lg:items-center lg:justify-between">
    <Social socialClass="lg:w-auto"/>
    <Copyright copyrightClass="text-xs flex-shrink" />
</div>