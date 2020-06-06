<script>
  import Icon from "svelte-awesome";
  import { linkedinSquare, twitter } from "svelte-awesome/icons";
  import { SOCIAL_DATA } from "../../../store/data";

  export let socialClass;

  const { LISTS } = $SOCIAL_DATA;
</script>

<div class="social {socialClass} text-center w-full">
  <ul class="social-list list-reset">
    {#each LISTS as { name, url, rel, target }, i}
    <li class="item inline-block mr-3">
      <a href="{url}" {rel} {target} data-name="{name}">
        <Icon
          data="{name === 'twitter'? twitter : linkedinSquare}"
          label="{name}"
          scale="1.2"
        ></Icon>
      </a>
    </li>
    {/each}
  </ul>
</div>
<style>
  :global(.item a svg) {
    @apply opacity-50;
    @apply transition-all duration-200 ease-in-out;
    fill: black;
    opacity: 0.5;
  }
  :global(.item a:hover svg) {
    @apply opacity-100;
    opacity: 1;
  }
  :global(.mode-dark .item a svg) {
    fill: white;
  }
</style>
