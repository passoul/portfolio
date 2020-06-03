<script>
  import { fly } from "svelte/transition";
  import { Tooltip, Button } from "smelte";
  import Icon from "svelte-awesome";
  import { arrowUp } from "svelte-awesome/icons";
  import {
    BACKTOTOPANIMY,
    BACKTOTOPDURATION,
    BACKTOTOPDELAY,
  } from "../../../store/constant";
  import {
    SHOWBACKTOTOP,
    TRIGGERPOINT,
    HEADERINTROEND,
    MENUISACTIVE,
    MENUBTNPRESSED,
  } from "../../../store/states";

  let y;

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
  }

  $: y > $TRIGGERPOINT && $HEADERINTROEND
    ? SHOWBACKTOTOP.set(true)
    : SHOWBACKTOTOP.set(false);
</script>

<svelte:window bind:scrollY="{y}" />

{#if $SHOWBACKTOTOP}
<div
  class="backToTop-wrapper h-12 w-12 fixed top-0 transition lg:relative"
  transition:fly="{{delay: BACKTOTOPDELAY, duration: BACKTOTOPDURATION, y: BACKTOTOPANIMY}}"
>
  <Tooltip class="capitalize bg-dark-200 bg-opacity-75 hidden lg:block">
    <div slot="activator">
      <Button
        on:click="{scrollUp}"
        class="px-4 text-sm hover:bg-primary-400 p-4 pt-1 pb-1 pl-2 pr-2 text-xs h-12 w-12 rounded-full lg:relative text-black flex justify-center bg-primary-500 hover:bg-primary-400 items-center"
      >
        <Icon data="{arrowUp}" scale="1.5" label="Back to top"></Icon>
      </Button>
    </div>
    Back to top
  </Tooltip>
</div>
{/if}
<style>
  :global(.backToTop-wrapper) {
    left: -48px;
    -webkit-transition: -webkit-transform ease-out 200ms;
    transition: -webkit-transform ease-out 200ms;
    transition: transform ease-out 200ms;
    transition: transform ease-out 200ms, -webkit-transform ease-out 200ms;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  :global(.navbar-active .backToTop-wrapper) {
    -webkit-transform: translate3d(-48px, 0, 0);
    transform: translate3d(-48px, 0, 0);
  }
  @screen lg {
    .backToTop-wrapper {
      left: initial;
    }
    :global(.backToTop-wrapper) {
      @apply bg-transparent !important;
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
    :global(.mode-dark .backToTop-wrapper button:hover) {
      @apply bg-white bg-opacity-25;
    }
  }
</style>
