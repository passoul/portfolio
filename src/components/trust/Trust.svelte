<script>
  import { TRUST_DATA } from "../../store/data";
  import SectionTitle from "../heading/SectionTitle.svelte";

  const { NAME, TITLE, COMPANIES } = $TRUST_DATA;
</script>

<div class="trust-content flex flex-wrap pb-12">
  <SectionTitle sectionTitle="{TITLE}" />
  <ul
    class="companies-list p-6 flex justify-around flex-col sm:flex-row flex-wrap w-full items-center rounded mt-4"
  >
    {#each COMPANIES as { name, logo, svg }, i}
    <li class="item my-6">
      <div class="logo">
        {@html svg}
      </div>
    </li>
    {/each}
  </ul>
</div>
