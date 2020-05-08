<script>
  import { Switch, Tooltip, Button } from "smelte";
  import Icon from "svelte-awesome";
  import {
    bars,
    times,
    adjust,
    barChart,
    handshakeO,
    filePdfO,
    wrench,
  } from "svelte-awesome/icons";
  import { fly } from "svelte/transition";
  import ENV_CONST from "../../constants/constants";
  import { createEventDispatcher } from 'svelte';
  // Toggle theme btn
  const { DARKMODECLASSNAME, LOCALSTORAGEITEM } = ENV_CONST;
  // IconTab
  const iconTab = [barChart, handshakeO, filePdfO, wrench];

  const dispatch = createEventDispatcher();
  const currentTheme = localStorage.getItem(LOCALSTORAGEITEM);
  let darkMode = currentTheme === DARKMODECLASSNAME ? true : false;

  currentTheme === DARKMODECLASSNAME
    ? window.document.body.classList.add(DARKMODECLASSNAME)
    : window.document.body.classList.remove(DARKMODECLASSNAME);

  function toggleThemeChange() {
    if (darkMode === true) {
      // Update localstorage
      localStorage.setItem(LOCALSTORAGEITEM, DARKMODECLASSNAME);
      window.document.body.classList.add(DARKMODECLASSNAME);
    } else {
      // Update localstorage
      localStorage.removeItem(LOCALSTORAGEITEM);
      window.document.body.classList.remove(DARKMODECLASSNAME);
    }
  }
  // Props
  export let navlists = [];
  export let switchBtn = {};
  const { TEXTDARK, TEXTLIGHT } = switchBtn;

  let active = false;

  function handleMenu() {
    dispatch('message', {
      toggleMenuBtnClick: active
    });
  }
</script>
<nav
  class="navbar {active ? 'navbar-active': 'w-12 h-12 '} lg:w-auto lg:h-auto lg:relative fixed right-0 bottom-0 mr-2 mb-2"
>
  <div
    class="navbar-content w-12 h-12 lg:w-auto lg:w-full flex-grow lg:flex lg:items-center lg:w-auto lg:block lg:mt-2 lg:mt-0 lg:bg-transparent p-4 lg:p-0 z-20"
    id="navbarNav"
  >
    <Button
      remove="rounded py-2 px-4 {active ? 'hover:elevation-5' : ''} relative bg-primary-500 hover:bg-primary-400"
      add="rounded-full lg:hidden w-12 h-12 absolute bottom-0 right-0 z-10 bg-custom hover:bg-white-transLight text-black"
      on:click="{() => {active = !active; handleMenu()}}"
      data-toggle="collapse"
      data-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
      id="btnMenu"
    >
      <div
        class="bars ease-in-out duration-300 delay-75 transition-all absolute"
      >
        <Icon data="{bars}" scale="1.5"></Icon>
      </div>
      <div
        class="cross ease-in-out duration-300 delay-75 transition-all absolute"
      >
        <Icon data="{times}" scale="1.5"></Icon>
      </div>
    </Button>
    <ul
      class="nav list-reset lg:flex justify-end flex-1 items-center capitalize"
    >
      {#each navlists as list, i}
      <li class="nav-item mr-3 absolute lg:relative bg-custom rounded-full w-12 h-12 top-0 left-0">
        <a
          class="nav-link inline-block font-bold no-underline rounded-full w-12 h-12 flex items-center text-center justify-center text-black"
          href="{list.url}"
        >
          <Tooltip class="capitalize bg-dark-200 bg-opacity-75 hidden lg:block lg:mt-5">
            <div slot="activator">
              {#each iconTab as icon, i} {#each Object.entries(icon) as object}
              {#if object[0] === list.icon}
              <Icon data="{icon}" scale="1.5"></Icon>{/if} {/each} {/each}
            </div>
            {list.label}
          </Tooltip>
        </a>
      </li>
      {/each}
    </ul>

    <div class="switch-theme absolute lg:relative items-center text-center justify-center bg-custom rounded-full w-12 h-12 top-0 left-0">
      <Tooltip class="capitalize bg-dark-200 bg-opacity-75">
        <div slot="activator" on:click="{toggleThemeChange}">
          <Button class="px-4 text-sm hover:bg-transparent p-4 pt-1 pb-1 pl-2 pr-2 text-xs h-12 w-12 rounded-full relative text-black" bind:value={darkMode} flat>
            <Icon data="{adjust}" scale="1.5" label={darkMode ? TEXTLIGHT : TEXTDARK}></Icon>
          </Button>
        </div>
        {darkMode ? TEXTLIGHT : TEXTDARK}
      </Tooltip>
    </div>

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
  nav.navbar-active .bars {
    transform: rotate(90deg) scale(0);
    opacity: 0;
  }
  nav:not(.navbar-active) .cross {
    transform: rotate(-90deg) scale(0);
    opacity: 0;
  }
  :global(.switch-theme label) {
    @apply sr-only;
  }
  .switch-theme{
    @apply cursor-pointer;
  }
  .nav-item,
  .switch-theme {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    -webkit-transition: -webkit-transform ease-out 200ms;
    transition: -webkit-transform ease-out 200ms;
    transition: transform ease-out 200ms;
    transition: transform ease-out 200ms, -webkit-transform ease-out 200ms;
  }
  :global(.navbar-active button) {
    -webkit-transition-timing-function: linear;
    transition-timing-function: linear;
    -webkit-transition-duration: 200ms;
    transition-duration: 200ms;
    -webkit-transform: scale(0.8, 0.8) translate3d(0, 0, 0);
    transform: scale(0.8, 0.8) translate3d(0, 0, 0);
  }
  .navbar-active .nav-item:nth-child(1) {
    -webkit-transition-duration: 170ms;
    transition-duration: 170ms;
    -webkit-transform: translate3d(80px, 0, 0);
    transform: translate3d(0, -48px, 0);
  }
  .navbar-active .nav-item:nth-child(2) {
    -webkit-transition-duration: 250ms;
    transition-duration: 250ms;
    -webkit-transform: translate3d(160px, 0, 0);
    transform: translate3d(0, -96px, 0);
  }
  .navbar-active .nav-item:nth-child(3) {
    -webkit-transition-duration: 330ms;
    transition-duration: 330ms;
    -webkit-transform: translate3d(240px, 0, 0);
    transform: translate3d(0, -144px, 0);
  }
  .navbar-active .nav-item:nth-child(4) {
    -webkit-transition-duration: 410ms;
    transition-duration: 410ms;
    -webkit-transform: translate3d(320px, 0, 0);
    transform: translate3d(0, -192px, 0);
  }
  .navbar-active .switch-theme {
    -webkit-transition-duration: 410ms;
    transition-duration: 410ms;
    -webkit-transform: translate3d(320px, 0, 0);
    transform: translate3d(-48px, 0, 0);
  }
  .navbar{
    -webkit-filter: url(#shadowed-goo);
    filter: url(#shadowed-goo);
  }
  @screen lg {
    :global(.switch-theme button, .nav-item a){
      @apply text-black;
    }
    :global(.mode-dark .switch-theme button, .mode-dark .nav-item a){
      @apply text-white
    }
    .nav-item, .switch-theme {
      @apply bg-transparent;
    }
    .nav-item a:hover, .switch-theme:hover {
      @apply bg-black bg-opacity-25;
    }
    .mode-dark .nav-item a:hover, .mode-dark .switch-theme:hover {      
      @apply bg-white bg-opacity-25;
    }
    .navbar{
      -webkit-filter: none;
      filter: none;
    }
  }
</style>
