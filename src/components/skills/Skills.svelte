<script>
  import { ProgressLinear } from "smelte";
  import { onMount } from "svelte";
  import { SKILLS_DATA } from "../../store/data";
  import { SKILLSANIMEND } from "../../store/states";
  import SkillProgress from "./SkillProgress.svelte";

  const { NAME, TITLE, LISTS } = $SKILLS_DATA;

  const whichAnimationEvent = () => {
      var t,
          el = document.createElement("fakeelement");

      var animations = {
          "animation"      : "animationend",
          "OAnimation"     : "oAnimationEnd",
          "MozAnimation"   : "animationend",
          "WebkitAnimation": "webkitAnimationEnd"
      }

      for (t in animations){
          if (el.style[t] !== undefined){
          return animations[t];
          }
      }
  }

  let visible = false;
  onMount( async () => {
    
    await fetch('<@HOME@>').then(() => {
      let animationEvent = whichAnimationEvent();
      let element = document.getElementById(NAME);
      
      element.addEventListener(animationEvent, (event) => {
        SKILLSANIMEND.set(true);          
      });
                          
    })          
  });
</script>

<div class="skills-content flex flex-wrap">
  <h1
    class="skills-title w-full my-2 text-2xl font-bold leading-tight text-center text-gray-800 capitalize dark:text-gray-100">
    {TITLE}
  </h1>
  {#each LISTS as { cat_title, cat_items }, index}
  <div class="cat-box w-full md:w-1/3 p-6 flex flex-col flex-grow flex-shrink">
    <div
      class="cat-title w-full font-bold text-xl text-gray-800 px-6 capitalize mb-8 text-center dark:text-gray-100"
    >
      {cat_title}
    </div>
    <ul class="cat_item-list">
      {#each cat_items as { name, initial, level }, i}
      <li class="cat-item mb-6 flex items-center">
        <SkillProgress value={level} name={name}/>
      </li>
      {/each}
    </ul>
  </div>
  {/each}
</div>
