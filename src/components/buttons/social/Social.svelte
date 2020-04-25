<script>
  import Icon from "svelte-awesome";
  import { linkedinSquare, twitter } from "svelte-awesome/icons";

  export let socialData = {};
  const { LISTS } = socialData;
</script>

<div class="social">
  <ul class="social-list">
    {#each LISTS as { name, url, rel, target }, i}
    <li class="item">
      <a href="{url}" {rel} {target} data-name="{name}">
        {#if name === "twitter"}
        <Icon data="{twitter}" title="{name}" label="{name}"></Icon>
        {/if} {#if name === "linkedin"}
        <Icon data="{linkedinSquare}" title="{name}" label="{name}"></Icon>
        {/if}
      </a>
    </li>
    {/each}
  </ul>
</div>
