<script>
  import { Switch } from "smelte";
  import ENV_CONST from "../../../constants/constants";

  const { DARKMODECLASSNAME, LOCALSTORAGEITEM } = ENV_CONST;

  const currentTheme = localStorage.getItem(LOCALSTORAGEITEM);
  let darkMode = currentTheme === DARKMODECLASSNAME ? true : false;

  currentTheme === DARKMODECLASSNAME
    ? window.document.body.classList.add(DARKMODECLASSNAME)
    : window.document.body.classList.remove(DARKMODECLASSNAME);

  function toggleThemeChange() {
    if (darkMode === true) {
      // Update localstorage
      localStorage.setItem(LOCALSTORAGEITEM, DARKMODECLASSNAME);
      window.document.body.classList.add(DARKMODECLASSNAME);
    } else {
      // Update localstorage
      localStorage.removeItem(LOCALSTORAGEITEM);
      window.document.body.classList.remove(DARKMODECLASSNAME);
    }
  }
</script>

<div class="togglebutton" on:click="{toggleThemeChange}">
  <Switch bind:value={darkMode} />
</div>
