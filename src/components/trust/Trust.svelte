<script>
  export let trustData = {};
  const { TITLE, COMPANIES } = trustData;
</script>

<div class="trust container mx-auto flex flex-wrap pt-4 pb-12">
  <div
    class="trust_title w-full my-2 text-2xl font-bold leading-tight text-center text-gray-800 dark:text-gray-100 capitalize"
  >
    {TITLE}
  </div>
  <ul class="companies-list p-6">
    {#each COMPANIES as { name, logo }, i}
    <li class="item">
      <div class="logo">
        <img src="{logo}" alt="{name}" />
      </div>
    </li>
    {/each}
  </ul>
</div>
