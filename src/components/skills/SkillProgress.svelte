<script>
    import { ProgressLinear } from "smelte";
    import { tweened } from 'svelte/motion';
	import { linear } from 'svelte/easing';
    import { SKILLSANIMEND } from "../../store/states";
    import { SKILLSPROGRESSDURATION } from "../../store/constant";

    export let value;
    export let name;
    
    let init = 0;
    let progressNumber = init;

    const progress = tweened(0, {
		duration: SKILLSPROGRESSDURATION,
		easing: linear
    });
    
    progress.set(init);

    $: (() => {
        if($SKILLSANIMEND){
            progress.set(value);
            progressNumber = Math.round($progress);
        }
    })()
</script>
<div class="cat-item-title capitalize w-4/12">
    {name}
    <small>({progressNumber}%)</small>
</div>
<div
class="bg-gray-transDark rounded-full cat-item-progressbar-{name} w-8/12 h-4"
>
    <ProgressLinear progress={$progress} />
</div>

<style>
    :global(div[class*="cat-item-progressbar"] div) {
      @apply rounded-full h-4 opacity-75;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    }
    :global(div[class*="cat-item-progressbar"] div > div) {
      animation: none !important;
      transition: unset;
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