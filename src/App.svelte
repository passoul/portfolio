<script>
    import DATA  from "./constants/data";
	import Header_container from "./containers/Header_container.svelte";
	import Home_container from "./containers/Home_container.svelte";
	import Footer_container from "./containers/Footer_container.svelte";
  import Tailwindcss from './components/tailwindcss/Tailwindcss.svelte';

</script>
<Header_container navlists={DATA.NAVBAR_DATA}/>
<main>
	<Home_container 
	headingProfilData={DATA.PROFIL_DATA}
	socialData={DATA.SOCIAL_DATA}
	skillsData={DATA.SKILLS_DATA}
	toolsData={DATA.TOOLS_DATA}
	trustData={DATA.TRUST_DATA}
	cvData={DATA.CV_DATA}
	/>
</main>
<Footer_container copyrightData={DATA.COPYRIGHT_DATA} socialData={DATA.SOCIAL_DATA}/>
<style>
	:global(body) {
		font-family: OpenSans, Arial, Helvetica, sans-serif;
		transition: background-color 0.3s;
	}
</style>