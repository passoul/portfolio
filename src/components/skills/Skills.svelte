<script>
    export let skillsData = {};
    const { TITLE, LISTS } = skillsData;
</script>

<div className="skills">
    <div className="skills-title">
        {TITLE}
    </div>
    <div className="cat-box">
        {#each LISTS as { cat_title, cat_items }, i}
            <div className="cat-title">
                {cat_title}
            </div>
            <ul className="cat_item-list">
                {#each cat_items as { name, level }, i}
                    <li className="cat-item">
                        <div className="cat-item-title">{name}</div>
                        <div className="cat-item-level">{level}</div>
                    </li>
                {/each}
            </ul>
        {/each}
    </div>
</div>
<!-- <div className="skills">
    <div className="skills-title">
        {skillsProp.title}
    </div>
    {skillsProp.items.map((cat, index) => (
        <div className="cat-box">
            <div className="cat-title">
                {cat.cat_title}
            </div>
            <ul className="cat_item-list">
                {cat.cat_items.map((item, i) => (
                    <li className="cat-item">
                        <div className="cat-item-title">{item.name}</div>
                        <div className="cat-item-level">{item.level}</div>
                    </li>
                ))}
            </ul>
        </div>
    ))}
</div> -->