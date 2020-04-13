<script>
    export let trustData ={};
    const { TITLE, COMPANIES } = trustData;
</script>

<div className="trust">
    <div className="trust_title">
        {TITLE}
    </div>
    <ul className="companies-list">
        {#each COMPANIES as { name, logo }, i}
            <li className="item">
                <div className="logo">
                    <img src={logo} alt={name}/>
                </div>
            </li>
        {/each}
    </ul>
</div>