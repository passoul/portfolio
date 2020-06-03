<script>
    import { ProgressLinear } from "smelte";
    import { tweened } from 'svelte/motion';
	import { linear } from 'svelte/easing';
    import { SKILLSANIMEND } from "../../store/states";

    export let value;
    let init = 0;

    const progress = tweened(0, {
		duration: 5000,
		easing: linear
    });
    progress.set(init);

    $: (() => {
        if($SKILLSANIMEND){
            progress.set(value);
        }
    })()
</script>

<ProgressLinear progress={$progress} />