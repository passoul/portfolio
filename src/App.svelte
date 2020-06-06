<script>
    import { onMount, setContext } from "svelte";
	import { fade } from "svelte/transition";
	import { HEADERID, SHADOWCLASSES } from "./store/constant";
	import { SHOWHEADER, HEADERINTROEND, MENUISACTIVE, DARKMODE } from "./store/states";
	import createRouter from '@spaceavocado/svelte-router';
	import RouterView from '@spaceavocado/svelte-router/component/view';
	import Header_container from "./containers/Header_container.svelte";
	import Home_container from "./containers/Home_container.svelte";
	import Footer_container from "./containers/Footer_container.svelte";

	import "smelte/src/tailwind.css";

	let y;
    let sections;
    let sectionsArray = [];

	createRouter({
		routes: [{ 
			path: '/',
			name: 'HOME',
			component: Home_container
			}],
	});

	onMount( async () => {
	
		await fetch('<@HOME@>').then(() => {

			sections = document.querySelectorAll('section[class*="-section"]');

			setTimeout(() => {
				sections.forEach(function(section, index){
					sectionsArray.push({
						el: section,
						elTop: section.offsetTop,
						isVisible: false                
					});         
				})
				}, 1000);
				
				
			})
			
	});
	setContext('sections', sectionsArray);

	$: (() => {
		// If header visible
		if($HEADERINTROEND){
			const header = document.getElementById(HEADERID);
			
			if(y > 10){
				header.classList.add(SHADOWCLASSES);
			}else{
				header.classList.remove(SHADOWCLASSES);
			}
		}
	})();
	// Show header
	setTimeout(() => { SHOWHEADER.set(true) }, 1000);
</script>
<svelte:window bind:scrollY={y}/>
{#if $SHOWHEADER}
<header class="fixed w-full z-30 top-0 dark:bg-black bg-white bg-opacity-75 transition ease-in duration-100" id="header" transition:fade on:introend="{() => HEADERINTROEND.set(true)}">
	<Header_container />
</header>
{/if}
<main class:blur-block="{$MENUISACTIVE}">
	<Home_container	/>
</main>
<footer class="bg-dark-transLight" class:blur-block="{$MENUISACTIVE}">
	<Footer_container />
</footer>
<style>
	@font-face{
		font-family: 'Open Sans';
  		src: url('<@FONTSDIR@>/OpenSans-Regular.ttf') format('woff2');		
	}	
	@font-face{
		font-family: 'Open Sans';
		  src: url('<@FONTSDIR@>/OpenSans-SemiBold.ttf') format('woff2');		
		  font-weight: SemiBold;
	}	
	@font-face{
		font-family: 'Montserrat';
  		src: url('<@FONTSDIR@>/Montserrat-Regular.ttf') format('woff2');		
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
		filter: blur(2px);
		-webkit-filter: blur(2px);
	}
</style>