<script>
	import Copyright from "../components/copyright/Copyright.svelte";
	import Social from "../components/buttons/social/Social.svelte";

    export let copyrightData;
    export let socialData;

</script>

<div class="container mx-auto px-8 w-full flex flex-col md:flex-row py-5">
    <Copyright {copyrightData} copyrightClass="flex-1 text-xs order-2 lg:order-1" />
    <Social {socialData} socialClass="flex-1 order-1 lg:order-2"/>
</div>