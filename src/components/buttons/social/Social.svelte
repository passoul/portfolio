<script>
    
    export let socialData = {};
    const { LISTS } = socialData;
</script>

<div className="social">
    <ul className="social-list">
        {#each LISTS as { name, url, rel, target }, i}
            <li className="item">
                <a href={url} {rel} {target} data-name={name}>{name}</a>
            </li>
        {/each}
    </ul>
</div>