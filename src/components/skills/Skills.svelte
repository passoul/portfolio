<script>
    export let skillsData = {};
    const { TITLE, LISTS } = skillsData;
</script>

<section class="skills">
    <div class="skills-title">
        {TITLE}
    </div>
    <div class="cat-box">
        {#each LISTS as { cat_title, cat_items }, i}
            <div class="cat-title">
                {cat_title}
            </div>
            <ul class="cat_item-list">
                {#each cat_items as { name, level }, i}
                    <li class="cat-item">
                        <div class="cat-item-title">{name}</div>
                        <div class="cat-item-level">{level}</div>
                    </li>
                {/each}
            </ul>
        {/each}
    </div>
</section>