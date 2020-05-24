<script>
  import Icon from "svelte-awesome";
  import { linkedinSquare, twitter } from "svelte-awesome/icons";

  export let socialData = {};
  export let socialClass;
  const { LISTS } = socialData;
</script>

<div class="social {socialClass} text-center w-full">
  <ul class="social-list list-reset">
    {#each LISTS as { name, url, rel, target }, i}
    <li class="item inline-block mr-3">
      <a href="{url}" {rel} {target} data-name="{name}">
        {#if name === "twitter"}
        <Icon data="{twitter}" title="{name}" label="{name}" scale="1.2"></Icon>
        {/if} {#if name === "linkedin"}
        <Icon
          data="{linkedinSquare}"
          title="{name}"
          label="{name}"
          scale="1.2"
        ></Icon>
        {/if}
      </a>
    </li>
    {/each}
  </ul>
</div>
<style>
  :global(.item a svg) {
    @apply opacity-50;
    @apply transition-all duration-200 ease-in-out;
  }
  :global(.item a:hover svg) {
    @apply opacity-100;
  }
</style>
