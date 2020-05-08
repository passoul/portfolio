<script>
    import DATA  from "./constants/data";
	import Header_container from "./containers/Header_container.svelte";
	import Home_container from "./containers/Home_container.svelte";
	import Footer_container from "./containers/Footer_container.svelte";
	import "smelte/src/tailwind.css";

	let menuIsActive;

	function handleMessage(event) {
		menuIsActive = event.detail.toggleMenuBtnClick;
	}
</script>
<Header_container navlists={DATA.NAVBAR_DATA} switchBtn={DATA.THEMESWITCH_DATA} avatar={DATA.PROFIL_DATA.AVATAR} on:message={handleMessage} />
<main class="lg:pt-16 {menuIsActive ? 'blur-block' : ''}">
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
	@font-face{
		font-family: 'Open Sans';
  		src: url('/static/fonts/OpenSans-Regular.ttf') format('woff2');		
	}	
	@font-face{
		font-family: 'Open Sans';
		  src: url('/static/fonts/OpenSans-SemiBold.ttf') format('woff2');		
		  font-weight: SemiBold;
	}	
	@font-face{
		font-family: 'Montserrat';
  		src: url('/static/fonts/Montserrat-Regular.ttf') format('woff2');		
	}
	:global(html) {
		font-family: "Open Sans", Arial, Helvetica, sans-serif;
	}
	:global(h1){
		font-family: "Montserrat", Arial, Helvetica, sans-serif;
	}
	:global(body) {
		background: #ECE9E6;  
	}
	/* Apply to wave-top svg */
	:global(body.mode-dark) {
		background: #000000;  /* fallback for old browsers */
		background: -webkit-linear-gradient(to right, #434343, #000000);  /* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(to right, #434343, #000000); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	}
	:root {
	--color-custom: #F5856D;
	--color-custom-400: #F7977E;
	}
	:global(.bg-custom){
		background-color: var(--color-custom); 
	}
	:global(.bg-custom:hover){
		background-color: var(--color-custom-400); 
	}
	.blur-block{
		filter: blur(8px);
		-webkit-filter: blur(8px);
	}
</style>