<script>
  import { onMount } from "svelte";
  import { Chip } from "smelte";

  export let toolsData = {};
  const { NAME, TITLE, LISTS } = toolsData;

  let y = 0;
  let show = false;
  let element;
  let elementTop;
  let elementContent;

  onMount(() => {
    element = document.querySelector("#" + NAME);
  });

  $: (() => {
    if (element != undefined) {
      elementTop = element.offsetTop;
      let elementHeight = element.offsetHeight;
      let viewPortHeight = window.innerHeight;

      if (elementTop + y / 4 < viewPortHeight + y && !show) {
        show = !show;
        element.classList.add("slide-top");
      }
    }
  })();
</script>
<svelte:window bind:scrollY="{y}" />

<div class="tools-content">
  <h1
    class="tools-title w-full my-2 text-2xl font-bold leading-tight text-center text-gray-800 dark:text-gray-100 capitalize"
  >
    {TITLE}
  </h1>
  <ul
    class="tools-items-list list-reset mb-6 p-6 flex flex-wrap justify-between"
  >
    {#each LISTS as list, i}
    <li class="tools-item mt-2 mr-2">
      <Chip selectable="{false}">{list}</Chip>
    </li>
    {/each}
  </ul>
</div>
