<script>
	import Copyright from "../components/copyright/Copyright.svelte";
	import Social from "../components/buttons/social/Social.svelte";

    export let copyrightData;
    export let socialData;

</script>

<div class="container mx-auto px-8 w-full flex flex-col py-5">
    <Social {socialData} socialClass="flex-1 flex-none"/>
    <Copyright {copyrightData} copyrightClass="flex-1 text-xs flex-shrink" />
</div>