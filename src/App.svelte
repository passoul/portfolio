<script>
    import DATA  from "./constants/data";
	import Header_container from "./containers/Header_container.svelte";
	import Home_container from "./containers/Home_container.svelte";
	import Footer_container from "./containers/Footer_container.svelte";
	
</script>

<main>
	<Header_container 
	headingProfilData={DATA.PROFIL_DATA}
	socialData={DATA.SOCIAL_DATA}
	/>
	<Home_container 
	skillsData={DATA.SKILLS_DATA}
	toolsData={DATA.TOOLS_DATA}
	trustData={DATA.TRUST_DATA}
	cvData={DATA.CV_DATA}
	/>
	<Footer_container copyrightData={DATA.COPYRIGHT_DATA} socialData={DATA.SOCIAL_DATA}/>
</main>

<style>
	:global(body) {
		transition: background-color 0.3s
	}
	:global(body.dark) {
		background-color: #363537;
		color: #FAFAFA;
	}
</style>