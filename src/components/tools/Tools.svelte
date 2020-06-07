<script>
  import { Chip } from "smelte";
  import { TOOLS_DATA } from "../../store/data";
  import SectionTitle from "../heading/SectionTitle.svelte";

  const { NAME, TITLE, LISTS } = $TOOLS_DATA;
</script>

<div class="tools-content">
  <SectionTitle sectionTitle="{TITLE}" />
  <ul
    class="tools-items-list list-reset mb-6 p-6 flex flex-wrap justify-center"
  >
    {#each LISTS as list, i}
    <li class="tools-item mt-2 mr-2">
      <Chip selectable="{false}" add="transition">{list}</Chip>
    </li>
    {/each}
  </ul>
</div>
