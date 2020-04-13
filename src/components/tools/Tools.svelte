<script>
    export let toolsData = {};
    const { TITLE, LISTS } = toolsData;
</script>

<div className="tools">
    <div className="tools-title">
        {TITLE}
    </div>
    <ul className="tools-items-list">
        {#each LISTS as list, i}
            <li className="tools-item">
                {list}
            </li>
        {/each}
    </ul>
</div>