<script>
  import { Switch, Tooltip } from "smelte";
  import ENV_CONST from "../../constants/constants";
  // Toggle theme btn
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
  // Props
  export let navlists = [];
  export let switchBtn = {};
  const { TEXTDARK, TEXTLIGHT } = switchBtn;

  let active = false;
  function onClickMenu() {
    active = !active;
  }
</script>
<nav class="navbar {active ? 'navbar-active': ''}">
  <button
    class="navbar-toggler lg:hidden"
    type="button"
    data-toggle="collapse"
    data-target="#navbarNav"
    aria-controls="navbarNav"
    aria-expanded="false"
    aria-label="Toggle navigation"
    on:click="{onClickMenu}"
  >
    <span class="navbar-toggler-bar"></span>
  </button>
  <div
    class="navbar-content w-full flex-grow lg:flex lg:items-center lg:w-auto lg:block mt-2 lg:mt-0 lg:bg-transparent p-4 lg:p-0 lg:h-16 z-20 hidden"
    id="navbarNav"
  >
    <ul
      class="nav list-reset lg:flex justify-end flex-1 items-center capitalize"
    >
      {#each navlists as list}
      <li class="nav-item mr-3">
        <a
          class="nav-link inline-block py-2 px-4 font-bold no-underline hover:bg-white-transLight rounded"
          href="{list.url}"
          >{list.label}</a
        >
      </li>
      {/each}
    </ul>
    <!-- <div class="togglebutton mx-auto lg:mx-0 mt-4 lg:mt-0 py-5 px-8 opacity-75 lg:flex" on:click="{toggleThemeChange}"> -->
    <Tooltip class="capitalize">
      <div slot="activator" on:click="{toggleThemeChange}" class="tooltip">
        <Switch bind:value={darkMode} label={darkMode ? TEXTLIGHT : TEXTDARK} />
      </div>
      {darkMode ? TEXTLIGHT : TEXTDARK}
    </Tooltip>
    <!-- </div> -->
  </div>
</nav>

<style type="text/scss">
  :global(.tooltip > div) {
    margin-bottom: 0;
  }
  :global(.tooltip label) {
    @apply sr-only;
  }
  /* .navbar {
    position: fixed;
    right: 5px;
    bottom: 20px;
    button {
      z-index: 100;
      width: 41px;
      height: 41px;
      background-color: #fff;
      border-radius: 50% 50% 50% 50%;
      -webkit-transition: 0.5s ease-in-out;
      transition: 0.5s ease-in-out;
      box-shadow: 0 0 0 0 #fff, 0 0 0 0 #fff;
      border: none;
      &:hover {
        box-shadow: 0 14px 26px -12px rgba(153, 153, 153, 0.42),
          0 4px 23px 0px rgba(0, 0, 0, 0.12),
          0 8px 10px -5px rgba(153, 153, 153, 0.2);
      }
    }
    & &-toggler-bar {
      position: absolute;
      top: calc((41px - 2px) / 2);
      left: calc((41px - 22px) / 2);
      width: 22px;
      height: 2px;
      background: #999999;
      display: block;
      -webkit-transform-origin: center;
      transform-origin: center;
      -webkit-transition: 0.5s ease-in-out;
      transition: 0.5s ease-in-out;
      &:after,
      &:before {
        -webkit-transition: 0.5s ease-in-out;
        transition: 0.5s ease-in-out;
        content: "";
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
        background: #999999;
      }
      &:before {
        top: -6px;
      }
      &:after {
        bottom: -6px;
      }
    }
    &-content {
      z-index: 200;
      position: absolute;
      top: 30%;
      right: 10%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      opacity: 0;
      -webkit-transition: 0.25s 0s ease-in-out;
      transition: 0.25s 0s ease-in-out;
    }
    a {
      margin-bottom: 1em;
      display: block;
      color: #000;
      text-decoration: none;
    }
    &-active {
      button {
        &,
        &:hover {
          box-shadow: 0 0 0 25vw #fff, 0 0 0 50vh #fff;
          border-radius: 25%;
        }
      }
      .navbar-toggler-bar {
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        &:after {
          -webkit-transform: rotate(90deg);
          transform: rotate(90deg);
          bottom: 0;
        }
        &:before {
          -webkit-transform: rotate(90deg);
          transform: rotate(90deg);
          top: 0;
        }
      }
      .navbar-content {
        opacity: 1;
      }
    }
  } */
</style>
