<script>
    import DATA  from "./constants/data";
	import Header_container from "./containers/Header_container.svelte";
	import Home_container from "./containers/Home_container.svelte";
	import Footer_container from "./containers/Footer_container.svelte";

	import ENV_CONST from "./constants/constants";

	// import "smelte/src/tailwind.css";

	let menuIsActive;

	let handleMenuBtnAction = (event) => {
		menuIsActive = event.detail.toggleMenuBtnClick;
	}
</script>
<header class="fixed w-full z-30 top-0 dark:bg-black bg-white bg-opacity-75" id="header">
	<Header_container navlists={DATA.NAVBAR_DATA} switchBtn={DATA.THEMESWITCH_DATA} avatar={DATA.PROFIL_DATA.AVATAR} on:message={handleMenuBtnAction} />
</header>
<main class="lg:pt-16" class:blur-block="{menuIsActive}">
	<Home_container 
	headingProfilData={DATA.PROFIL_DATA}
	socialData={DATA.SOCIAL_DATA}
	skillsData={DATA.SKILLS_DATA}
	toolsData={DATA.TOOLS_DATA}
	trustData={DATA.TRUST_DATA}
	cvData={DATA.CV_DATA}
	/>
</main>
<footer class="bg-dark-transLight" class:blur-block="{menuIsActive}">
	<Footer_container copyrightData={DATA.COPYRIGHT_DATA} socialData={DATA.SOCIAL_DATA}/>
</footer>
<style>
	@font-face{
		font-family: 'Open Sans';
  		src: url('<@FONTS@>/OpenSans-Regular.ttf') format('woff2');		
	}	
	@font-face{
		font-family: 'Open Sans';
		  src: url('<@FONTS@>/OpenSans-SemiBold.ttf') format('woff2');		
		  font-weight: SemiBold;
	}	
	@font-face{
		font-family: 'Montserrat';
  		src: url('<@FONTS@>/Montserrat-Regular.ttf') format('woff2');		
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
		background: #232526;  /* fallback for old browsers */
		background: -webkit-linear-gradient(to right, #434343, #232526);  /* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(to right, #434343, #232526); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	}
	.blur-block{
		filter: blur(8px);
		-webkit-filter: blur(8px);
	}
</style>