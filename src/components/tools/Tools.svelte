<script>
  import { Chip } from "smelte";
  export let toolsData = {};
  const { TITLE, LISTS } = toolsData;
</script>

<div class="tools">
  <h1
    class="tools-title w-full my-2 text-2xl font-bold leading-tight text-center text-gray-800 dark:text-gray-100 capitalize"
  >
    {TITLE}
  </h1>
  <ul class="tools-items-list list-reset mb-6 p-6">
    {#each LISTS as list, i}
    <li class="tools-item mt-2 inline-block mr-2">
      <Chip selectable="{false}">{list}</Chip>
    </li>
    {/each}
  </ul>
</div>
