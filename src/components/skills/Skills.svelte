<script>
  import { ProgressLinear } from "smelte";
  export let skillsData = {};
  const { TITLE, LISTS } = skillsData;
</script>

<div class="skills flex flex-wrap">
  <h1
    class="skills-title w-full my-2 text-2xl font-bold leading-tight text-center text-gray-800 capitalize dark:text-gray-100"
  >
    {TITLE}
  </h1>
  {#each LISTS as { cat_title, cat_items }, i}
  <div class="cat-box w-full md:w-1/3 p-6 flex flex-col flex-grow flex-shrink">
    <div class="cat-title w-full font-bold text-xl text-gray-800 px-6 capitalize mb-8 text-center dark:text-gray-100">
      {cat_title}
    </div>
    <ul class="cat_item-list">
      {#each cat_items as { name, level }, i}
      <li class="cat-item mb-6 flex items-center">
        <div class="cat-item-title capitalize w-4/12">
          {name} 
            <small>({level}%)</small>
        </div>
        <div class="bg-gray-transDark rounded-full cat-item-progressbar-{name} w-8/12 h-4">
          <ProgressLinear progress={level} />
        </div>
      </li>
      {/each}
    </ul>
  </div>
  {/each}
</div>
<style>
  
:global(div[class*="cat-item-progressbar"] div) {
    @apply rounded-full h-4 opacity-75;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  }
:global(.cat-item-progressbar-html div div:first-of-type) {
  @apply bg-orange-400;
  }
:global(.cat-item-progressbar-css div div:first-of-type) {
  @apply bg-blue-400;
  }
:global(.cat-item-progressbar-javascript div div:first-of-type) {
  @apply bg-yellow-400;
}
:global(.cat-item-progressbar-accessibility div div:first-of-type) {
  @apply bg-red-400;
}
:global(.cat-item-progressbar-sass div div:first-of-type) {
  @apply bg-purple-400;
}
:global(.cat-item-progressbar-less div div:first-of-type) {
  @apply bg-blue-700;
}
:global(.cat-item-progressbar-jquery div div:first-of-type) {
  @apply bg-blue-500;
}
:global(.cat-item-progressbar-vue div div:first-of-type) {
  @apply bg-green-400;
}
:global(.cat-item-progressbar-angular div div:first-of-type) {
  @apply bg-red-500;
}
:global(.cat-item-progressbar-react div div:first-of-type) {
  @apply bg-blue-200;
}
:global(.cat-item-progressbar-svelte div div:first-of-type) {
  @apply bg-orange-400;
}
</style>
