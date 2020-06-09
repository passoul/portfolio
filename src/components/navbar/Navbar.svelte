<script>
  import RouterLink from '@spaceavocado/svelte-router/component/link';
  import { onMount, getContext } from 'svelte';
  import { Switch, Tooltip, Button } from "smelte";
  import Icon from "svelte-awesome";
  import { elasticOut } from "svelte/easing";
  import {
    bars,
    times,
    adjust,
    barChart,
    handshakeO,
    filePdfO,
    wrench,
  } from "svelte-awesome/icons";
  import { DARKMODECLASSNAME, LOCALSTORAGEITEM, SLIDETOP, MENUITEMANIMDURATION, MENUITEMANIMDELAY, SCREENLG, MENUITEMACTIVECLASS, MENUITEMCLASS } from "../../store/constant";
  import { NAVBAR_DATA, THEMESWITCH_DATA	} from "../../store/data";
  import { MENUISACTIVE, MENUBTNPRESSED, DARKMODE, HEADERINTROEND, SHOWMENUEITEM, TRIGGERBACKTOTOPPOINT, SHOWBACKTOTOP	} from "../../store/states";
  import BackToTop from '../buttons/backtotop/BackToTop.svelte';

  // IconTab
  const iconTab = [barChart, handshakeO, filePdfO, wrench];

  const currentTheme = localStorage.getItem(LOCALSTORAGEITEM);
  
  const { TEXTDARK, TEXTLIGHT } = $THEMESWITCH_DATA;
  
  let last_id = window.location.hash.slice(1);
  
  const menuItemLenght = $NAVBAR_DATA.length;

  let MenuMobileActive;

  DARKMODE.set(currentTheme === DARKMODECLASSNAME ? true : false);

  // Handle theme mode fonction
  currentTheme === DARKMODECLASSNAME
    ? window.document.body.classList.add(DARKMODECLASSNAME)
    : window.document.body.classList.remove(DARKMODECLASSNAME);

  let toggleThemeChange = () => {
    if ($DARKMODE) {
      // Update localstorage
      localStorage.setItem(LOCALSTORAGEITEM, DARKMODECLASSNAME);
      window.document.body.classList.add(DARKMODECLASSNAME);
      // DARKMODE.set(true);
    } else {
      // Update localstorage
      localStorage.removeItem(LOCALSTORAGEITEM);
      window.document.body.classList.remove(DARKMODECLASSNAME);
      // DARKMODE.set(false);
    }
  }

  let handleMenuBtnAction = () => {
    MENUISACTIVE.set(!$MENUISACTIVE);  
    MENUBTNPRESSED.set(!$MENUBTNPRESSED);
  };

  onMount( async () => {
	
    await fetch('<@HOME@>').then(() => {      
      setTimeout(function(){ handleOnCompleted(last_id, 'load') }, 800);   
    })

  });

  let sectionsArray = getContext('sections');

  // Scroll to section  
  const handleOnCompleted = (hash, event) => {
    let top; 

    if(hash){

      if (sectionsArray.length > 0) {
        for (let i = 0; i < sectionsArray.length; i++) {
          var id = sectionsArray[i].el.getAttribute('id');

          if(!sectionsArray[i].isVisible){
            sectionsArray[i].isVisible = !sectionsArray[i].isVisible;
            sectionsArray[i].el.classList.add(SLIDETOP);
          }
          
          if (hash === id){
            if( SCREENLG ){
              top = sectionsArray[i].elTop - 64;          
            }else{
              top = sectionsArray[i].elTop;
            }
            break;
          }
        }
      }
    }else{
      top = 0;
    }
    
    window.scrollTo({
      top, // scroll so that the element is at the top of the view
      behavior: 'smooth' // smooth scroll
    });      

    if(event === 'click' && $MENUBTNPRESSED){ 
      handleMenuBtnAction() 
    }
    if(event === 'load'){
      let el = document.querySelector('.' + MENUITEMCLASS + ' [href="/#' + hash + '"]'); 
      if(el != undefined){
        el.classList = MENUITEMACTIVECLASS;
      }
    }
  }
  $: (() => {
    MenuMobileActive = $MENUISACTIVE && !SCREENLG;
    if($HEADERINTROEND){
      SHOWMENUEITEM.set(true);
    }
  })();

  const spin = () => {
    return {
        delay: MENUITEMANIMDELAY,
        duration: MENUITEMANIMDURATION,
        css: t => {
          const eased = elasticOut(t);
          return `transform: scale(${eased}) rotate(${eased * 360}deg);`
        }
      };
  };

</script>
<nav
  class="navbar {$MENUISACTIVE ? 'navbar-active': 'w-12 h-12'} lg:w-auto lg:h-auto lg:relative fixed right-0 bottom-0 mr-2 mb-2"
>
  <div
    class="navbar-content w-12 h-12 lg:w-auto lg:w-full flex-grow lg:flex lg:items-center lg:w-auto lg:block lg:mt-2 lg:mt-0 lg:bg-transparent p-4 lg:p-0 z-20"
    id="navbarNav"
  >
  <!-- Device toggle menu button -->
    <Button
      remove="rounded py-2 px-4 {$MENUISACTIVE ? 'hover:elevation-5' : ''} relative"
      add="rounded-full lg:hidden w-12 h-12 absolute bottom-0 right-0 z-10 hover:bg-white-transLight text-black {MenuMobileActive ? 'ease-linear duration-200 scale-75 translate-x-0' : ''}"
      on:click="{handleMenuBtnAction}"
      data-toggle="collapse"
      data-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
      id="btnMenu"
    >
      <div
        class="bars ease-in-out duration-300 delay-75 transition-all absolute {$MENUISACTIVE ? 'transform rotate-90 scale-0':''}"
      >
        <Icon data="{bars}" scale="1.5"></Icon>
      </div>
      <div
        class="cross ease-in-out duration-300 delay-75 transition-all absolute {!$MENUISACTIVE ? 'transform -rotate-90 scale-0':''}"
      >
        <Icon data="{times}" scale="1.5"></Icon>
      </div>
    </Button>
    <!-- Nav link -->
    <ul
      class="nav list-reset lg:flex justify-end flex-1 items-center capitalize"
    >
      {#each $NAVBAR_DATA as list, i}
      {#if $SHOWMENUEITEM}
        <li class="nav-item mr-3 absolute lg:relative bg-primary-500 hover:bg-primary-400 rounded-full w-12 h-12 top-0 left-0 text-black transition flex items-center justify-center {!SCREENLG ? i == 0 ? 'duration-400 -translate-y-48' : i == 1 ? 'duration-300 -translate-y-36' : i == 2 ? 'duration-200 -translate-y-24' : i == 3 ? 'duration-100 -translate-y-12' : '' : ''}" in:spin
        class:ease-out={!SCREENLG}
        class:transform={MenuMobileActive}>
            <RouterLink to={{name: 'HOME', hash: list.label}} on:completed={handleOnCompleted(list.label, 'click')}>
            <Tooltip class="capitalize bg-dark-200 bg-opacity-75 hidden lg:block lg:mt-5">
              <div slot="activator">
                {#each iconTab as icon, i} {#each Object.entries(icon) as object}
                {#if object[0] === list.icon}
                <Icon data="{icon}" scale="1.5"></Icon>{/if} {/each} {/each}
              </div>
              {list.label}
            </Tooltip>
          </RouterLink>
        </li>
      {/if}
      {/each}
    </ul>
    <!-- Switch theme button -->
    {#if $SHOWMENUEITEM}
    <div class="switch-theme absolute lg:relative bg-primary-500 hover:bg-primary-400 rounded-full w-12 h-12 top-0 left-0 transition cursor-pointer flex justify-center items-center" in:spin
    class:transform={MenuMobileActive}
    class:-translate-x-12={MenuMobileActive}
    class:duration-500={MenuMobileActive}>
      <Tooltip class="capitalize bg-dark-200 bg-opacity-75 hidden lg:block absolute">
        <div slot="activator" on:click="{toggleThemeChange}">
          <Button class="px-4 text-sm hover:bg-transparent p-4 pt-1 pb-1 pl-2 pr-2 text-xs h-12 w-12 rounded-full lg:relative text-black flex justify-center items-center"  bind:value={$DARKMODE} flat>
            <Icon data="{adjust}" scale="1.5" label={$DARKMODE ? TEXTLIGHT : TEXTDARK}></Icon>
          </Button>
        </div>
        {$DARKMODE ? TEXTLIGHT : TEXTDARK}
      </Tooltip>
    </div>
    {/if}
    <!-- Back to top button -->
    <BackToTop/>

    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="lg:hidden">
      <defs>
        <filter id="shadowed-goo">
            
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo"></feColorMatrix>
            <feGaussianBlur in="goo" stdDeviation="3" result="shadow"></feGaussianBlur>
            <feColorMatrix in="shadow" mode="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.2" result="shadow"></feColorMatrix>
            <feOffset in="shadow" dx="1" dy="1" result="shadow"></feOffset>
            <feComposite in2="shadow" in="goo" result="goo"></feComposite>
            <feComposite in2="goo" in="SourceGraphic" result="mix"></feComposite>
        </filter>
        <filter id="goo">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo"></feColorMatrix>
            <feComposite in2="goo" in="SourceGraphic" result="mix"></feComposite>
        </filter>
      </defs>
    </svg>

  </div>
</nav>

<style type="text/scss">
  nav .bars {
    top: 27%;
    left: 29%;
  }
  nav .cross {
    top: 25%;
    left: 31%;
  }
  .switch-theme label {
    @apply sr-only;
  }
  :global(.navbar-active .nav-item, .navbar-active .switch-theme){
    will-change: transform;
  }
  :global(.nav-item a){
    @apply inline-block font-bold no-underline rounded-full w-12 h-12 flex items-center text-center justify-center transition-all duration-200 ease-in-out;
  }
  .-translate-y-36 {
    --transform-translate-y: -9rem;
  }
  .duration-400{
    transition-duration: 400ms;
  }
  .navbar{
    -webkit-filter: url(#shadowed-goo);
    filter: url(#shadowed-goo);
  }
  @screen lg {
    :global(.switch-theme button svg, .nav-item svg){
      fill: black;
    }
    :global(.mode-dark .switch-theme button svg, .mode-dark .nav-item svg){
      fill: white;
    }
    .nav-item, :global(.switch-theme) {
      @apply bg-transparent;
    }
    :global(.nav-item a, .switch-theme button){
      @apply w-10 h-10;
    }
    :global(.nav-item a, .switch-theme) {
      @apply transition duration-200 ease-in-out;
    }
    :global(.switch-theme:hover){
      @apply bg-opacity-0;
    }
    :global(.nav-item a:hover, .nav-item a.active, .switch-theme button:hover) {
      @apply bg-black bg-opacity-25;
    }
    :global(.nav-item a:after, .switch-theme:after) {
      @apply pointer-events-none absolute box-content rounded-full opacity-0;
      width: 84%;
      height: 84%;
      content:'';
      top: 0.09rem;
      left: 0.09rem;
      padding: 0.15rem;
      box-shadow: 0 0 0 2px black;
      -webkit-transition: -webkit-transform 0.2s, opacity 0.2s;
      transition: transform 0.2s, opacity 0.2s;
      -webkit-transform: scale(.8);
      transform: scale(.8);
    }
    :global(.mode-dark .nav-item a:after, .mode-dark .switch-theme:after){
      box-shadow: 0 0 0 2px white;
    }
    :global(.nav-item a:hover:after, .switch-theme:hover:after) {
        @apply opacity-100 scale-100 transform;
    }
    :global(.mode-dark .nav-item a:hover, .mode-dark .nav-item a.active, .mode-dark .switch-theme button:hover) {      
      @apply bg-white bg-opacity-25;
    }
    .navbar{
      -webkit-filter: none;
      filter: none;
    }
  }
</style>
