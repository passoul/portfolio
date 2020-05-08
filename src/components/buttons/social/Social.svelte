<script>
  import Icon from "svelte-awesome";
  import { linkedinSquare, twitter } from "svelte-awesome/icons";

  export let socialData = {};
  export let socialClass;
  const { LISTS } = socialData;
</script>

<div class="social {socialClass}">
  <ul class="social-list list-reset">
    {#each LISTS as { name, url, rel, target }, i}
    <li class="item inline-block mr-3">
      <a
        href="{url}"
        {rel}
        {target}
        data-name="{name}"
        class="opacity-50 hover:opacity-100"
      >
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
  .item a svg {
    width: 5rem;
    height: 5rem;
  }
</style>
