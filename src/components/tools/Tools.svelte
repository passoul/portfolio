<script>
    export let toolsData = {};
    const { TITLE, LISTS } = toolsData;
</script>

<section class="tools">
    <div class="tools-title">
        {TITLE}
    </div>
    <ul class="tools-items-list">
        {#each LISTS as list, i}
            <li class="tools-item">
                {list}
            </li>
        {/each}
    </ul>
</section>