<script>
  import { Chip } from "smelte";
  import { TOOLS_DATA } from "../../store/data";

  const { NAME, TITLE, LISTS } = $TOOLS_DATA;
</script>

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
