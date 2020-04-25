<script>
    export let trustData ={};
    const { TITLE, COMPANIES } = trustData;
</script>

<section class="trust">
    <div class="trust_title">
        {TITLE}
    </div>
    <ul class="companies-list">
        {#each COMPANIES as { name, logo }, i}
            <li class="item">
                <div class="logo">
                    <img src={logo} alt={name}/>
                </div>
            </li>
        {/each}
    </ul>
</section>