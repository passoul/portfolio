<script>
  import { fly } from "svelte/transition";
  import { Tooltip, Button } from "smelte";
  import Icon from "svelte-awesome";
  import { angleUp } from "svelte-awesome/icons";
  import {
    BACKTOTOPANIMY,
    BACKTOTOPDURATION,
    BACKTOTOPDELAY,
    MENUITEMACTIVECLASS,
    MENUITEMCLASS,
  } from "../../../store/constant";
  import {
    SHOWBACKTOTOP,
    TRIGGERBACKTOTOPPOINT,
    HEADERINTROEND,
    MENUISACTIVE,
    MENUBTNPRESSED,
  } from "../../../store/states";

  let y;
  let bttVisible = false;

  function scrollUp() {
    window.scrollTo({
      top: 0, // scroll so that the element is at the top of the view
      behavior: "smooth", // smooth scroll
    });
    // Close Menu if open
    if ($MENUISACTIVE && $MENUBTNPRESSED) {
      MENUISACTIVE.set(!$MENUISACTIVE);
      MENUBTNPRESSED.set(!$MENUBTNPRESSED);
    }
    history.replaceState(null, null, " ");
    // Remove active menu item
    let activeMenuItem = document.querySelector(
      "." + MENUITEMCLASS + " ." + MENUITEMACTIVECLASS
    );
    if (activeMenuItem != undefined) {
      activeMenuItem.classList.remove(MENUITEMACTIVECLASS);
    }
  }

  $: y > $TRIGGERBACKTOTOPPOINT && $HEADERINTROEND
    ? SHOWBACKTOTOP.set(true)
    : SHOWBACKTOTOP.set(false);
</script>

<svelte:window bind:scrollY="{y}" />

{#if $SHOWBACKTOTOP}
<div
  class="backToTop-wrapper h-12 w-12 fixed top-0 transition lg:relative transform ease-out delay-200 flex justify-center items-center lg:ml-6 {$MENUISACTIVE ? '-translate-x-12' : 'translate-x-0'}"
  transition:fly="{{delay: BACKTOTOPDELAY, duration: BACKTOTOPDURATION, y: BACKTOTOPANIMY}}"
  on:introend="{() => bttVisible = true}"
>
  <Tooltip class="capitalize bg-dark-200 bg-opacity-75 hidden lg:block">
    <div slot="activator">
      <Button
        on:click="{scrollUp}"
        class="px-4 text-sm hover:bg-primary-400 p-4 pt-1 pb-1 pl-2 pr-2 text-xs h-12 w-12 rounded-full lg:relative text-black flex justify-center bg-primary-500 hover:bg-primary-400 items-center flex-col"
      >
        <Icon
          data="{angleUp}"
          scale="1.5"
          label="first arrow"
          class="absolute transition delay-75 duration-75 ease-in transform scale-0 {bttVisible ? 'arrowAnimIn' : 'arrowAnimOut'}"
        ></Icon>
        <Icon
          data="{angleUp}"
          scale="1.5"
          label="second arrow"
          class="absolute transition delay-500 duration-500 ease-in transform scale-0 {bttVisible ? 'arrowAnimIn2' : 'arrowAnimOut2'}"
        ></Icon>
      </Button>
    </div>
    Back to top
  </Tooltip>
</div>
{/if}
<style>
  :global(.backToTop-wrapper) {
    left: -48px;
  }
  :global(.backToTop-wrapper button svg:first-of-type) {
    top: 10px;
    left: 16px;
  }
  :global(.backToTop-wrapper button svg:last-of-type) {
    top: 17px;
    left: 16px;
  }
  :global(.arrowAnimIn) {
    @apply opacity-100 translate-y-0 scale-100;
  }
  :global(.arrowAnimIn2) {
    @apply opacity-100 translate-y-0 scale-75;
  }
  :global(.arrowAnimOut) {
    @apply opacity-0 translate-y-1;
  }
  :global(.arrowAnimOut2) {
    @apply opacity-0 translate-y-8;
  }
  @screen lg {
    .backToTop-wrapper {
      left: initial;
    }
    :global(.backToTop-wrapper button) {
      @apply w-10 h-10;
    }
    :global(.backToTop-wrapper button svg) {
      fill: black;
    }
    :global(.backToTop-wrapper button) {
      @apply bg-transparent;
    }
    :global(.backToTop-wrapper button:hover) {
      @apply bg-black bg-opacity-25;
    }
    :global(.mode-dark .backToTop-wrapper button svg) {
      fill: white;
    }
    :global(.backToTop-wrapper button svg:first-of-type) {
      top: 5px;
      left: 12px;
    }
    :global(.backToTop-wrapper button svg:last-of-type) {
      top: 12px;
      left: 12px;
    }
    :global(.mode-dark .backToTop-wrapper button:hover) {
      @apply bg-white bg-opacity-25;
    }
    :global(.backToTop-wrapper:after) {
      @apply pointer-events-none absolute box-content p-1 rounded-full opacity-0;
      width: 84%;
      height: 84%;
      content: "";
      top: 0.09rem;
      left: 0.09rem;
      padding: 0.15rem;
      box-shadow: 0 0 0 2px black;
      -webkit-transition: -webkit-transform 0.2s, opacity 0.2s;
      transition: transform 0.2s, opacity 0.2s;
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
    }
    :global(.mode-dark .backToTop-wrapper:after) {
      box-shadow: 0 0 0 2px white;
    }
    :global(.backToTop-wrapper:hover:after) {
      @apply opacity-100 scale-100 transform;
    }
  }
</style>
