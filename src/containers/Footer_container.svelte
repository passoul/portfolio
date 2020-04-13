<script>
	import Copyright from "../components/copyright/Copyright.svelte";
	import Social from "../components/buttons/social/Social.svelte";

    export let copyrightData;
    export let socialData;

</script>

<footer>
    <Copyright {copyrightData} />  
	<Social {socialData}/>
</footer>