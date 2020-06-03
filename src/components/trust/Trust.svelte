<script>
  import { TRUST_DATA } from "../../store/data";

  const { NAME, TITLE, COMPANIES } = $TRUST_DATA;
</script>

<div class="trust-content flex flex-wrap pb-12">
  <div
    class="w-full my-2 text-2xl font-bold leading-tight text-center text-gray-800 dark:text-gray-100 capitalize"
  >
    {TITLE}
  </div>
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
