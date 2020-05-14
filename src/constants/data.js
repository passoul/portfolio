const THEMESWITCH_DATA = {
  TEXTDARK: "go dark",
  TEXTLIGHT: "go light",
};
const NAVBAR_DATA = [
  { id: 1, url: "#skills", label: "skills", icon: "bar-chart" },
  { id: 2, url: "#tools", label: "tools", icon: "wrench" },
  { id: 3, url: "#trust", label: "trust", icon: "handshake-o" },
  { id: 4, url: "#cv", label: "cv", icon: "file-pdf-o" },
];
const PROFIL_DATA = {
  AVATAR: {
    alt: "ceci est ma photo",
    src: "<@MEDIA@>/avatar/avatar.png",
  },
  PROFESSION: "front end developer",
  FIRSTNAME: "pascal",
  LASTNAME: "soulier",
};
const SKILLS_DATA = {
  TITLE: "skills",
  LISTS: [
    {
      cat_title: "programming languages",
      cat_items: [
        {
          name: "html",
          level: 80,
        },
        {
          name: "css",
          level: 75,
        },
        {
          name: "javascript",
          level: 65,
        },
        {
          name: "accessibility",
          level: 60,
        },
      ],
    },
    {
      cat_title: "frameworks and library",
      cat_items: [
        {
          name: "sass",
          level: 70,
        },
        {
          name: "less",
          level: 65,
        },
        {
          name: "jquery",
          level: 75,
        },
        {
          name: "vue",
          level: 50,
        },
        {
          name: "angular",
          level: 55,
        },
        {
          name: "react",
          level: 45,
        },
        {
          name: "svelte",
          level: 65,
        },
      ],
    },
  ],
};
const TOOLS_DATA = {
  TITLE: "tools",
  LISTS: [
    "git",
    "grunt",
    "brunch",
    "bower",
    "gulp",
    "webpack",
    "middleman",
    "photoshop",
    "fireworks",
    "illustrator",
    "indesign",
    "dreamweaver",
    "figma",
    "prestashop",
    "wordpress",
    "drupal",
    "sublime text",
    "notepad++",
    "coda",
    "visual studio code",
  ],
};
const TRUST_DATA = {
  TITLE: "they trusted me",
  COMPANIES: [
    {
      name: "lwm",
      logo: "path",
      svg:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 125 46" width="200px" height="50px"><path class="filled" d="M0 46h125V0H0v46zm38.8-35l5.4 16.9L49.9 11h5.2l5.5 17 5.6-17h5.3l-7.9 24h-6l-5.3-16.3L46.9 35h-6L33 11h5.8zm68.8 24l-5.4-16.9L96.4 35h-5.2l-5.5-17-5.6 17h-5.3l7.9-24h6L94 27.3 99.5 11h6l7.9 24h-5.8zM12 11h6v19h12v5H12V11z"></path></svg>',
    },
    {
      name: "pmu",
      logo: "path",
      svg:
        '<svg id="PMU_DISPATCH" viewBox="0 0 283.6 181.5" width="200px" height="50px"><rect x="56.7" y="0" fill="#FFFFFF" width="226.8" height="124.7"></rect><g fill="#B9001E"><path d="M253.1,60.6c0,7.2-2,14-5.4,19.7c-7,13.2-21.9,21.7-38.6,21.7h6.5c10.7,0,22-4.9,30-13.5 c6.4-6.9,10.7-15.9,10.7-26.3c0-18.9-13-33.3-28.9-37.6C241.7,30.2,253.1,44.3,253.1,60.6z"></path><path d="M87.1,64.2c0-7.2,2-14,5.4-19.7c7-13.2,21.9-21.7,38.6-21.7h-6.5c-10.7,0-22,4.9-30,13.5 c-6.4,6.9-10.7,15.9-10.7,26.3c0,18.9,13,33.3,28.9,37.6C98.5,94.6,87.1,80.5,87.1,64.2z"></path></g><path fill="#00692D" d="M133,102.1c-23,0-44.6-18.5-44.6-40.8c0-22.3,19.7-38.6,42.8-38.6h76.1c23,0,44.6,18.5,44.6,40.8 c0,22.3-19.7,38.6-42.8,38.6H133z"></path><path fill="#B9001E" d="M232.3,82.5c-0.2-0.2-1.6-1.3-1.6-1.3c0-0.3-0.2-0.4-0.3-0.4c-0.1-0.1-0.8-0.3-1-0.5 c-1.2-1.5-2-1.6-2-1.6l-0.1-0.2c-0.6-0.7-1.7-1.2-1.7-1.2c-0.1-0.5-1.8-1.6-2.4-2.1c-0.7-0.5-0.8-0.6-1.2-1 c-0.4-0.4-1.4-1.7-2.7-2.9c-0.4-0.4-1-0.6-1-0.6s-0.4-0.3-0.9-0.9c-0.5-0.6-4.5-5.7-4.5-5.7c0.5-1.2-0.4-2.2-0.5-2.3  c0.4-1.7-0.6-3.8-0.6-3.8c0-1,1.5-2.5,3-4.3c1.5-1.9,2.7-3.8,2.9-4c0.3-0.4,1.4-0.5,1.4-0.5c0.7,0.7,1.4,1,1.8,1.1 c0.4,0.1,1.6,0.2,1.6,0.2s0.4,0.4,0.7,0.6l0.3,0.2l-5.3-0.3l-0.4,0.7l1.9,0c0,0,3.8,0.2,4,0.2c0.2,0,0.8,0.1,0.8,0.1  c0.2,0.2,0.7,0.4,0.7,0.4c-0.1,0.2-0.1,0.6,0.2,0.8c0.3,0.2,0.6,0.2,0.7,0.1c0.1,0,0.1,0,0.2,0.2c0.1,0.2,0.3,0.2,0.4,0.2 c0.1,0,0.1-0.2,0.1-0.3c0-0.2-0.3-0.8-0.3-0.9c-0.3-0.6,0.1-0.9,0.4-0.2c0.1,0.3,0.5,0.6,0.5,0.9c0,0.2,0,0.3,0.3,0.4 c0.3,0.1,0.4-0.1,0.5-0.1c0.1,0,0.2-0.2,0.3-0.3c0.1-0.1,0.3-0.1,0.3-0.3c0-0.3,0.5-0.7,0.4-0.9c-0.1-0.2,0-0.7,0-0.9 c0-0.2,0.1-0.4,0-0.7c-0.2-0.3-0.6-0.6-0.6-0.6s-0.4-0.8-0.9-1.4c-0.5-0.6-0.7-1.1-1-1.7c-0.3-0.6-0.9-1.2-1.5-2 c-0.6-0.8-0.5-1-0.5-1.5c0-0.3-0.2-0.5-0.3-0.6c-0.6-0.5-1.3-1.2-1.3-1.2c-0.4-0.4-0.7-0.9-1.6-1.5 c-0.3-1-1.3-1.7-1.3-1.7c-0.1-0.6-0.3-0.6-0.3-0.6c-0.1,0.4,0.2,1.6,0.2,1.6l-0.9-0.9c-0.3-1.3-0.4-1.2-0.4-1.2l-0.1,0.1 c-0.1,0.1-0.1,0.3-0.1,0.3s0,0.6-0.1,1c0,0.4,0.4,1.3,0.4,1.3L218,40c-1.1-0.7-1.5,0.3-1.5,0.3l-0.4,0.2 c-0.8-0.3-1.1,0.6-1.1,0.6s-0.3-0.1-0.7,0c-0.3,0.1-0.4,0.4-0.4,0.4l-1,0c1.7,1.2,3.4,2.8,3.8,2.8c0.7,0.1,0.8,0.4,0.6,1  c-0.2,0.6,0.3,1.2,0.2,1.4c-0.3,0.5-0.5,0.8-0.7,1.1c-0.2,0.2-0.2,0.4-0.5,0.3c0.1,0.2,0,0.8-0.5,0.7 c-0.5-0.1-0.7,0.1-0.7,0.1c-0.7,0.3-1.1,0-1.2-0.3c-0.2-0.3-0.5-0.8-1.1-0.9c-0.6,0-1.6-0.2-3.5-0.7 c-2.2,0.6-4.9-0.6-4.9-0.6l-6.8,6.5c0.3,1.3,0.2,2.3-1,4.3c0.8,2-0.2,2.7-0.2,2.7s2.2,1,3,1.5c0.7,0.5,3.8,1.2,4.3,1.6 c0.4,0.4,1.2,1.2,1.2,2.1c0.1,0.9-0.2,1.2-0.6,1.8c-0.3,0.7-0.7,0.8-0.7,0.8s-2.1,3.4-2.3,4.6c-0.1,0.4-0.2,0.6-0.3,0.8 c0,0.5,0,0.9,0,1.3c0.1,1,0.3,1.9,0.2,2.2c-0.3,0.7-0.5,0.8-0.5,0.8l-3.4,0.5c-0.1-0.1-0.7-0.3-1.1-0.2 c-0.4,0-0.6,0.5-0.8,0.6c-0.2,0.1-0.6-0.2-0.7-0.3c-0.1-0.1-0.4-0.2-0.4-0.2s-0.2-0.7-0.3-0.9c0-0.2-0.2-0.1-0.2-0.1 s-0.2,0.1-0.3,0.1c-0.1,0.1-1.2,0.4-1.3,0.4c-0.2,0-0.8,0.3-1.1,0.4c-0.3,0.1-0.2,0.2-0.2,0.2L191,78  c0.1,0.1,1.4,0.8,1.4,0.8c0,0.5,0.5,0.5,0.6,0.5c0.1,0,0.5-0.1,0.5-0.1c0.5,0.5,1.7,0.7,1.7,0.7s0.3,0.3,0.5,0.3 c0.2,0,0.6-0.1,0.7-0.2c0.1-0.1,0.6-0.2,0.6-0.2s4.7-0.8,5.2-0.8c0.3,0,0.5,0,0.5,0s0.9-1.6,0.9-2.1c0-0.6,0-1,0-1.5  c0.1-0.8,1.2-3.4,1.5-5.5c0.1-1.1,1-2.9,1.5-3.8c0.4,0.1,0.7,0.2,1,0.3c0.9,0.9,2.2,1.1,2.2,1.1s0.9,0.5,1.2,0.9 c0.3,0.4,1.3,1,1.8,1.3c0.3,0.2,2.1,1.3,2.8,1.7c0.5,0.2,0.5,0.3,0.6,0.4c0.6,0.6,2.5,2,2.6,2.1c0.1,0.1,0.6,0.3,0.9,0.3 c0.3,0,0.6,0.3,1.3,0.8c0.7,0.5,2.6,2.3,3,2.7c0.4,0.4,0.8,1,0.9,1.2c0.1,0.2,0.1,0.6,0.4,0.9c0.4,0.4,0.7,0.2,0.9,0.2 c0.1,0,0.4-0.1,0.9,0.1c0.4,0.2,0.8,0.6,0.9,0.8c0.1,0.2,0.3,1,0.5,1.3c0.2,0.3,0.3,0.4,0.5,0.3c0.2,0,0.2,0.1,0.2,0.1 s0.1,0.5,0.1,0.7c0,0.2,0.1,0.1,0.1,0.1s0.2,0,0.2,0c0,0,2.8-0.8,2.9-0.8c0.1,0,0.2,0,0.2-0.1 C232.4,82.6,232.3,82.5,232.3,82.5z"></path><g fill="#FFFFFF"><path d="M217.4,45.2c0.2-0.6,0-0.8-0.6-1c-0.7-0.1-4.6-3.8-6.4-4.4c-0.2-0.1,0.2-0.6-1.3-0.9 c-0.9-0.2-1-0.5-1.5-0.9c-0.5-0.3-1.2-0.8-1.9-0.7c-0.4-0.6-1-0.9-1.5-1.3c-0.5-0.4-1-0.9-1-1.1c-0.2,0.1,0.2,1.8,0.2,1.8 s-0.9-0.8-1.6-1.1c-0.6-0.3-0.6-1-0.8-1.1c-0.2,0.1,0.5,2.5,0.5,2.5s0.8,0.3,0.8,0.6c-0.6,0.1-1.9,0.7-1.9,0.7 c-0.1,0-0.1,0-0.1,0.1c0,0-0.7,0-0.7,0c-1.4,0-1-0.5-3.6-0.3c-1.3,0.1-2.8-0.1-2.8-0.1s1.8,1.6,3.5,1.6 c0,0-1.3,0.3-3.3,0.1c-4.4-0.4-5.5,1.6-5.5,1.6s1.8-0.4,2.8-0.2c1.8,0.4,1.7,0.7,1.8,0.8c0,0-1.4-0.5-2.7-0.1 c-4,1-4.5,1.2-5.5,1.7c-1.9,0.9-2.3,1.5-2.2,1.7c1.8-0.4,3.8,0.2,4.2,0.8c-0.1,0.3-0.3,0.2-0.3,0.5 c0.3,0.4,0.4,1.2,0.5,1.5c-0.1,0.2-0.2,0.4-0.1,0.6c0.3,0.2,0.7,0.7,1,1c0,0.1,0,0.2-0.1,0.3c-0.1,0.1-0.4,0.1-0.4,0.2 c0,0.1,0.1,0.3,0.2,0.4c0,0.1,0,0.2,0,0.2c-0.2,0.1-0.5,0.2-0.7,0.3c0,0.5,0.6,0.4,0.6,0.5c0.1,0.1,0.1,0.3,0,0.4 c0,0-0.2,0-0.2,0.1c-0.1,0.2,0.2,0.6,0,0.9c-0.1,0.1-0.9,0.1-1.2,0.1c-0.3,0.2-0.7,0.6-0.9,1c0.2,0.1,0.7,0.6,0.8,0.8 c0.1,0.1,0.1,0.3,0.2,0.5c1.2,1.1,1.9,1.3,2.5,1.5c0.6,0.3,1,0.6,1.4,0.8c0.1-0.1,0.3-0.4,0.6-0.5c0.2-0.1,2.9-2.6,3-2.8 c0.1,0,0.2,0.1,0.2,0.1s0.3-0.4,0.3-0.5c0.1-0.8,0.1-1.3,0.2-1.6c0.1-0.2,0.5-0.8,0.8-1.3c0.1-0.1,0.1-0.1,0.2-0.2 c0.2-0.5,0.8-2,0.8-2.2c0.3,0,1.9-0.2,2.2-0.4c-0.1,0.2-0.9,2.2-1.3,2.5c0,0-0.1,0.1-0.1,0.3c0.1,0.1,0.1,0.3,0.1,0.3 c0,0.2-0.2,0.4-0.4,0.6c0,0,0.2,0.1,0.2,0.2c0,0.1,0,0.5,0,0.6c0,0-0.1,0.1-0.1,0.2c0,0,0.1,0.1,0.1,0.2 c0,0.2,0,0.4,0,0.4c0,0-0.1,0.2-0.1,0.3c0,0.2,0,0.5-0.1,0.6c-0.1,0.3-0.9,1-1.3,1.1c-0.1,0.1-0.5,0.6-0.5,0.6 s0.3,0.7,0.1,0.8c-1.1,1.8-3.4,3.9-4.3,4.6c-0.5,0.4-3.2-0.7-5.5-1c-1.4,1.4-3.4,2.5-5.9,3.3c0,0,0,0-0.1,0  c0,0,1.1,0.1,2.8-0.2l3.4,4.1c0.6,1.1,2.8,4.2,2.8,4.2s-0.5,1-0.5,1.2c-0.9,0.4-3.8,2.5-3.8,2.5s-1-0.2-1.7,0.6 c-0.4,0.4-0.8,0-0.8,0s-0.7-0.7-1.1-0.7c-0.4,0-0.7-0.2-0.7-0.2l-2.4,1.9c0,0-0.2,0.3,0.1,0.3c0.4,0.1,1.9,0.5,1.9,0.5  s0.6,0.3,1.1,0c0.6,0.1,2.4,0,3.2-0.3c0.8-0.3,4.9-2.9,4.9-2.9l0.6-0.1c0,0,1.8-1.2,1.9-1.7c0.2-0.4-0.1-1.2-0.1-1.2 s-1.4-2.5-1.6-3.3c-0.2-0.8-1.4-5.1-1.4-5.1l1.5,0.4c0,0,1.3,2,3.7,1.1c0.9,0.1,2.3,0.4,4,0.7c2.6,0.4,5.1,0.7,5.2,0.7 c0.2,0.4,0.3,0.6,0.3,0.6l-2.2,3.8c0,0-1,0.6-0.9,2.1c0,0.1-0.7,0.7-0.7,0.7s-0.3-0.1-0.5-0.1c-0.3,0-0.5,0.3-0.5,0.3 l-0.9-0.3l-2,2c0,0-0.1,0.1,0.1,0.2c0.2,0,1.7,0.2,2,0.3c0.4,0.1,0.6-0.2,0.7-0.3c0.1-0.1,0.5,0,0.8-0.2 c0.3-0.1,1.4-1,1.6-1.1c0.2-0.1,1.2-0.5,1.4-1.7c0.2-1.2,2.3-4.6,2.3-4.6s0.4-0.2,0.7-0.8c0.3-0.7,0.6-1,0.6-1.8 c0-0.9-0.8-1.6-1.2-2.1c-0.4-0.4-3.5-1.2-4.3-1.6c-0.7-0.5-3-1.5-3-1.5s1-0.7,0.2-2.7c1.2-2,1.2-3,1-4.3l6.8-6.5 c0,0,2.8,1.2,4.9,0.6c1.9,0.6,2.9,0.7,3.5,0.7c0.6,0,0.9,0.6,1.1,0.9c0.2,0.3,0.5,0.7,1.2,0.3c0,0,0.3-0.2,0.7-0.1 c0.4,0.1,0.5-0.5,0.5-0.7c0.3,0.1,0.3-0.1,0.5-0.3c0.2-0.2,0.5-0.6,0.7-1.1C217.8,46.5,217.3,45.9,217.4,45.2"></path> <path d="M124.1,53c-0.3,0-19.2,0-19.2,0c-0.1,0.8,0.1,1.4,1.6,1.8c1.2,0.3,3.5,0.9,3.6,0.9 c-4.5,16.6-5.4,20.2-5.8,21.3c0,0,0.2,0,1.4,0c2.7,0,4.2-1.3,4.6-3.1c0.4-1.6,1.5-5.6,1.5-5.6h8.1 c4.9,0,8.3-5.3,8.3-10.3C128.5,53.6,126.3,53,124.1,53 M121.2,64c-0.4,0.4-1,0.4-1,0.4H113l1.9-7.2h7.1c0,0,0.8,0,1,1  C123.3,60.2,122.7,62.5,121.2,64z"></path><path d="M132.7,53c0,0,0.1,0,1.1,0c1.9,0,3,0.7,3.5,2.2 c0.4,1.2,3.9,13.1,3.9,13.1s10.7-13.3,11.2-13.9c0.8-1,2.4-1.4,4.6-1.4h1.4c-0.6,2.4-5.6,20.6-5.7,21 c-0.5,1.8-1.6,3-4.4,3c-0.8,0-1.5,0-1.5,0c0.2-0.6,3.7-13.7,3.7-13.7s-7.6,9.6-8.5,10.6c-0.5,0.6-1,0.8-1.9,0.8 c-0.3,0-0.8,0-1.3,0c-0.8,0-1.1-0.1-1.4-1c-0.3-1-3-10.4-3-10.4s-0.3,1.6-0.8,3.2c-1,3.6-1.6,6-2,7.3 c-0.5,1.8-1.7,3.1-4.3,3.1c-1.2,0-1.4,0-1.4,0L132.7,53z"></path><path d="M179.7,53h1.3c-1,3.9-2.8,10.4-4.8,17.5 c-1.2,4.3-5.1,6.6-11.6,6.6c-5.9,0-8.7-3.4-7.7-7c0.9-3.2,3.4-12.7,3.8-14c0.5-1.8,1.9-3,4.6-3h1.5L162,70.5 c0,0.1-0.3,0.9,0.5,1.4c0.7,0.4,1.8,0.9,3.4,0.9c2.2,0,3.7-0.6,4.4-1c0.5-0.3,0.7-0.9,0.8-1.1c0.8-2.9,3.7-13.2,4.1-14.6 C175.6,54.2,177,53,179.7,53z"></path></g><polygon fill="#00A01E" points="283.5,124.8 56.7,124.8 56.7,0 0,56.7 0,181.5 226.8,181.5"></polygon></svg>',
    },
    {
      name: "société générale",
      logo: "path",
      svg:
        '<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="50" viewBox="0 0 340 70"><g fill="none" fill-rule="evenodd" transform="translate(-15 -1)"><path fill="#000" d="M15.106 24.88c0-5.948 4.551-10.164 10.751-10.164 3.602 0 6.506 1.312 8.405 3.685l-3.518 3.184c-1.229-1.48-2.737-2.29-4.608-2.29-3.212 0-5.445 2.234-5.445 5.585s2.233 5.585 5.445 5.585c1.871 0 3.38-.81 4.608-2.29l3.518 3.183c-1.899 2.374-4.803 3.686-8.405 3.686-6.2 0-10.75-4.216-10.75-10.164M41.748 16.81c0 .782-.112 1.396-.894 3.212l-1.787 4.076h-3.323l1.313-4.551c-1.006-.475-1.648-1.424-1.648-2.737 0-1.9 1.34-3.127 3.183-3.127 1.815 0 3.156 1.228 3.156 3.127M60.04 30.381v4.273H44.345V15.106h15.33v4.274h-9.858v3.294h8.686v4.134h-8.685v3.573zM61.604 32.895l1.815-4.077c1.731 1.144 4.188 1.926 6.45 1.926 2.29 0 3.184-.642 3.184-1.591 0-3.1-11.114-.838-11.114-8.098 0-3.491 2.848-6.34 8.656-6.34 2.541 0 5.166.587 7.093 1.704l-1.703 4.105c-1.87-1.005-3.714-1.507-5.418-1.507-2.318 0-3.155.78-3.155 1.759 0 2.987 11.086.753 11.086 7.958 0 3.407-2.848 6.31-8.657 6.31-3.21 0-6.394-.865-8.237-2.15M85.62 19.49h-6.003v-4.384h17.508v4.385H91.15v15.163h-5.53zM126.308 15.106l-8.379 19.547h-5.445l-8.35-19.547h5.977l5.306 12.734 5.416-12.734zM141.64 24.88c0-3.379-2.318-5.585-5.28-5.585-2.958 0-5.276 2.206-5.276 5.585s2.318 5.585 5.277 5.585c2.96 0 5.279-2.206 5.279-5.585m-16.141 0c0-5.864 4.608-10.164 10.862-10.164 6.256 0 10.864 4.3 10.864 10.164s-4.608 10.164-10.864 10.164c-6.254 0-10.862-4.3-10.862-10.164M150.382 25.942V15.107h5.53v10.666c0 3.352 1.396 4.692 3.713 4.692 2.29 0 3.687-1.34 3.687-4.692V15.107h5.445v10.835c0 5.835-3.407 9.102-9.188 9.102-5.78 0-9.187-3.266-9.187-9.102M170.991 32.895l1.815-4.077c1.731 1.144 4.19 1.926 6.451 1.926 2.29 0 3.183-.642 3.183-1.591 0-3.1-11.114-.838-11.114-8.098 0-3.491 2.848-6.34 8.657-6.34 2.541 0 5.166.587 7.094 1.704l-1.704 4.105c-1.872-1.005-3.715-1.507-5.419-1.507-2.317 0-3.155.78-3.155 1.759 0 2.987 11.087.753 11.087 7.958 0 3.407-2.849 6.31-8.658 6.31-3.21 0-6.394-.865-8.237-2.15M58.002 39.648h5.529V54.81h9.326v4.385H58.002zM78.136 41.352c0 .781-.112 1.396-.894 3.211l-1.787 4.077h-3.323l1.312-4.552c-1.005-.475-1.647-1.424-1.647-2.736 0-1.9 1.34-3.128 3.183-3.128 1.815 0 3.156 1.228 3.156 3.128M90.59 51.32l-2.512-6.255-2.513 6.255h5.026zm1.62 4.077h-8.265l-1.536 3.8h-5.641l8.629-19.55h5.445l8.657 19.55h-5.752l-1.537-3.8zM117.455 39.648l-8.377 19.548h-5.445l-8.35-19.548h5.976l5.306 12.734 5.417-12.734zM135.133 54.923v4.273H119.44V39.648h15.331v4.273h-9.858v3.295h8.685v4.133h-8.685v3.574zM156.665 39.648v19.548h-4.553l-8.629-10.417v10.417h-5.416V39.648h4.551l8.63 10.416V39.648z"></path><path fill="#000" d="M160.436 59.196h5.528V39.648h-5.528zM178.363 44.004h-3.072v5.725h3.072c2.29 0 3.435-1.061 3.435-2.849 0-1.815-1.145-2.876-3.435-2.876zm-.055 9.997h-3.017v5.195h-5.529V39.648h8.936c5.333 0 8.686 2.765 8.686 7.232 0 2.876-1.398 4.998-3.827 6.171l4.218 6.145h-5.922l-3.545-5.195zM249.497 25.422c-1.623-.688-3.361-1.138-4.91-1.138-2.257 0-3.387.486-3.387 1.358 0 2.498 10.082.493 10.082 5.821 0 2.206-2.071 3.911-6.219 3.911-2.462 0-4.385-.509-6.595-1.705l.912-1.986c1.937 1.076 3.743 1.553 5.697 1.553 2.46 0 3.778-.71 3.778-1.773 0-2.731-10.084-.692-10.084-5.687 0-2.153 2.054-3.636 5.771-3.636 2.223 0 4.093.489 5.879 1.384l-.924 1.898zM260.738 35.441c-4.028 0-7.367-2.682-7.367-6.692 0-3.962 3.34-6.695 7.367-6.695 4.05 0 7.336 2.733 7.336 6.695 0 4.01-3.287 6.692-7.336 6.692m0-11.229c-2.935 0-4.937 1.987-4.937 4.537 0 2.611 1.916 4.554 4.937 4.554 3 0 4.907-1.962 4.907-4.554 0-2.55-1.908-4.537-4.907-4.537M277.694 35.426c-4.23 0-7.419-2.68-7.419-6.695 0-3.945 3.238-6.677 7.42-6.677 2.494 0 4.28.707 5.883 1.887l-1.247 1.857c-1.166-.897-2.625-1.551-4.569-1.551-3.088 0-5.006 1.952-5.006 4.484 0 2.61 1.937 4.504 5.038 4.504 1.941 0 3.476-.628 4.635-1.521l1.253 1.856c-1.607 1.18-3.493 1.856-5.988 1.856M286.238 35.086h2.349V22.441h-2.349zM292.057 22.44v12.646h11.918v-2.09H294.4V29.69h7.127v-2.088H294.4V24.53h9.168v-2.09zM305.224 22.44v2.077h5.156v10.569h2.34V24.517h5.151v-2.076zM319.758 22.44v12.646h11.919v-2.09h-9.571V29.69h7.13v-2.088h-7.13V24.53h9.168v-2.09zM245.698 50.05c1.287 0 2.61-.29 3.607-.761v-3.677h2.282v4.909c-1.605 1.079-3.81 1.736-5.989 1.736-4.227 0-7.416-2.676-7.416-6.692 0-3.944 3.238-6.672 7.416-6.672 2.447 0 4.284.688 5.888 1.868l-1.245 1.855c-1.17-.893-2.635-1.502-4.578-1.502-3.084-.067-5 1.922-5 4.45 0 2.617 1.94 4.487 5.035 4.487M254.673 39.278v12.639h11.919V49.83h-9.578v-3.307h7.136v-2.087h-7.136v-3.072h9.177v-2.086zM271.19 51.918h-2.294V39.277h2.393l8.245 9.527.056-.016a101.83 101.83 0 0 1-.157-6.208v-3.303h2.291v12.64h-2.374l-8.213-9.522-.037.019c.09 1.87.09 5.139.09 6.205v3.299zM285.024 39.278v12.639h11.921V49.83h-9.58v-3.307h7.133v-2.087h-7.133v-3.072h9.173v-2.086zM305.544 47.268h-3.777v4.65h-2.345v-12.64h8.125c2.695 0 4.366 1.655 4.366 4.029 0 2.258-1.64 3.605-3.624 3.894l3.764 4.717h-2.94l-3.57-4.65zm1.752-2.107c1.467 0 2.296-.758 2.296-1.854 0-1.2-.73-1.943-2.045-1.943h-5.78v3.797h5.529zM319.03 39.278l-6.16 12.639h2.536l1.451-3.068h6.82l1.454 3.068h2.527l-6.164-12.64h-2.464zm1.245 2.393l2.426 5.126h-4.869l2.443-5.126zM329.384 39.278v12.639h10.783V49.83h-8.443V39.278zM341.75 39.278v12.639h11.922V49.83h-9.575v-3.307h7.132v-2.087h-7.132v-3.072h9.175v-2.086z"></path><path fill="#ED0210" d="M199.175 37.453h30.212V22.042h-30.212z"></path><path fill="#000" d="M199.175 52.255h30.212V37.151h-30.212z"></path><path fill="#FFF" d="M204.454 38.069h19.655v-1.838h-19.655z"></path></g></svg>',
    },
    {
      name: "emagine",
      logo: "path",
      svg:
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200px" height="50px" viewBox="0 0 278 65" version="1.1"><title>logo@3x</title><desc>Created with Sketch.</desc><defs/><g id="Elements" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M194.373688,14.9409591 L180.742638,14.9409591 L180.742638,20.7374674 L183.407389,20.8759055 C184.853248,20.8759055 185.309983,21.3646769 185.309983,22.900681 L185.309983,42.3093306 C185.309983,43.9856563 184.472169,44.4047378 183.099164,44.5441176 L180.589459,44.7522457 L180.589459,50.0590409 L198.714066,50.0590409 L198.714066,44.4734859 L194.373688,44.2634744 L194.373688,14.9409591 Z M124.859444,38.9585627 C124.859444,41.9599391 121.967726,45.032889 117.241598,45.032889 C110.841711,45.032889 109.320197,39.5160823 109.320197,33.719574 C109.320197,26.1817589 111.760784,19.9661692 118.996617,19.9661692 C121.355011,19.9661692 123.718075,20.3852507 124.859444,20.8759055 L124.859444,38.9585627 Z M133.696182,42.3093306 L133.696182,16.3366416 C128.211632,14.4503043 122.651427,13.8927847 120.137052,13.8927847 C106.424743,13.8927847 100.029526,21.7140684 100.029526,34.0002173 C100.029526,43.9847146 104.521215,50.9678354 115.262415,50.9678354 C119.450549,50.9678354 123.336061,49.0805564 125.696323,45.9398001 L125.92796,46.00949 L125.92796,50.0590409 L138.036561,50.0590409 L138.036561,44.4734859 L135.600644,44.3341061 C134.151049,44.2634744 133.696182,43.8462764 133.696182,42.3093306 L133.696182,42.3093306 Z M165.373382,35.8178064 C165.373382,40.0745436 161.871751,42.6596639 157.601423,42.6596639 C150.521571,42.6596639 149.680956,36.3734425 149.680956,31.6269922 C149.680956,24.5760649 152.956555,19.9689945 159.280786,19.9689945 C161.41128,19.9689945 163.619297,20.2468125 165.373382,20.8052738 L165.373382,35.8178064 Z M174.209186,16.4769632 C169.715629,14.7309476 163.77341,13.8927847 160.114864,13.8927847 C148.614308,13.8927847 140.312761,19.8277311 140.312761,32.465155 C140.312761,40.4258186 144.124486,48.8008548 155.243029,48.8008548 C158.975363,48.8008548 162.783352,47.6867575 165.373382,44.8944509 L165.373382,48.7349319 C165.373382,54.5983048 163.544576,58.9963054 156.537577,58.9963054 C154.252971,58.9963054 152.575476,58.7872356 151.129617,58.2984642 C149.759413,57.8096928 149.375532,57.1137351 149.375532,55.7858592 L149.375532,52.4332078 L142.14437,52.9935526 L142.14437,62.6964648 C145.338709,64.1637207 151.661073,65 156.462856,65 C167.886823,65 173.144406,60.2544915 174.057875,49.9902927 C174.289512,47.4767459 174.209186,44.8219357 174.209186,42.3809041 L174.209186,16.4769632 Z M239.996701,26.0414373 C239.996701,17.8048392 235.505945,13.89561 227.887165,13.89561 C222.861218,13.89561 218.217283,15.9891336 215.548796,19.4783396 L215.548796,14.9381339 L202.675234,14.9381339 L202.675234,20.5265141 L205.876112,20.7365256 C207.245381,20.8062156 207.780573,21.3656187 207.780573,22.8997392 L207.780573,42.2386989 C207.780573,43.9847146 207.018415,44.403796 205.570688,44.5412924 L203.057247,44.751304 L203.057247,50.0580991 L221.184657,50.0580991 L221.184657,44.4744277 L216.841476,44.2644161 L216.841476,27.3683715 C216.841476,23.7379021 219.663142,20.3174442 224.690958,20.3174442 C229.870084,20.3174442 230.932996,23.2491307 230.932996,27.8571429 L230.932996,42.2386989 C230.932996,43.9847146 230.17364,44.403796 228.726847,44.5412924 L226.210604,44.751304 L226.210604,50.0580991 L244.340816,50.0580991 L244.340816,44.4744277 L239.996701,44.2644161 L239.996701,26.0414373 Z M264.899472,20.3353376 C267.638011,20.3353376 269.467751,21.6632136 269.467751,24.2455085 C269.467751,29.6219936 261.470694,30.809548 255.832031,30.8792379 C256.0618,25.7118227 258.805943,20.3353376 264.899472,20.3353376 L264.899472,20.3353376 Z M275.104546,41.9100261 C273.274806,43.0956969 270.002009,44.9820342 265.505649,44.9820342 C259.031041,44.9820342 256.441011,41.2818748 256.139323,36.7454361 C265.127372,36.6738626 277.847755,34.8590988 277.847755,24.1051869 C277.847755,17.8933642 272.894661,14.4022747 265.432796,14.4022747 C252.937512,14.4022747 246.617016,23.4779774 246.617016,33.8118661 C246.617016,44.2154448 251.644831,51.4763837 264.594983,51.4763837 C271.753292,51.4763837 276.778305,48.5418719 278,47.5652709 L275.104546,41.9100261 Z M93.1803762,26.0414373 C93.1803762,17.8029557 88.9156529,13.8937265 81.7592117,13.8937265 C76.72766,13.8937265 72.8449498,15.9881918 70.1792641,19.4792814 C68.4289156,15.7084903 64.9216803,13.8937265 60.0470436,13.8937265 C55.020162,13.8937265 51.1374517,15.9881918 48.4689641,19.4792814 L48.4689641,14.9409591 L35.5982045,14.9409591 L35.5982045,20.596204 L38.7990821,20.8052738 C40.2412049,20.8759055 40.7007415,21.4334251 40.7007415,22.9684874 L40.7007415,42.2386989 L40.6250861,42.2386989 C40.6250861,43.9856563 39.8647959,44.4047378 38.418003,44.5441176 L35.9036282,44.7522457 L35.9036282,50.0590409 L53.8778587,50.0590409 L53.8778587,44.4734859 L49.7625782,44.2634744 L49.7625782,27.3693132 C49.7625782,23.7369603 51.8220865,20.3155607 57.1515897,20.3155607 C62.0271604,20.3155607 62.4091735,23.5975804 62.4091735,27.8562011 L62.4091735,42.2386989 C62.4091735,43.9856563 61.6460813,44.4047378 60.1983544,44.5441176 L57.6849136,44.7522457 L57.6849136,50.0590409 L75.6610122,50.0590409 L75.6610122,44.4734859 L71.4700762,44.2634744 L71.4700762,27.5086931 C71.4700762,23.3875688 73.7593528,20.3155607 78.8590877,20.3155607 C83.7346584,20.3155607 84.1166715,23.5975804 84.1166715,27.8562011 L84.1166715,42.3093306 C84.0410161,43.9856563 83.280726,44.4047378 81.9086544,44.5441176 L79.3933456,44.7522457 L79.3933456,50.0590409 L97.5254251,50.0590409 L97.5254251,44.4734859 L93.1803762,44.2634744 L93.1803762,26.0414373 Z M188.967595,10.332947 C192.393571,10.332947 194.83229,8.16690814 194.83229,5.23616343 C194.83229,2.30447696 192.393571,-2.13162821e-14 189.042316,-2.13162821e-14 C185.46503,-2.13162821e-14 183.177621,2.30447696 183.177621,5.23616343 C183.177621,8.16690814 185.46503,10.332947 188.967595,10.332947 L188.967595,10.332947 Z M18.2805882,19.8267893 C21.0209952,19.8267893 22.8516693,21.1537236 22.8516693,23.7369603 C22.8516693,29.1153289 14.8508764,30.300058 9.21314747,30.3725732 C9.44291575,25.2032744 12.1861248,19.8267893 18.2805882,19.8267893 L18.2805882,19.8267893 Z M18.8905016,44.4744277 C12.4158931,44.4744277 9.82399484,40.7723848 9.52137321,36.2359461 C18.5094225,36.1662562 31.2288712,34.3496088 31.2288712,23.5985222 C31.2288712,17.3857578 26.275777,13.8937265 18.8129781,13.8937265 C6.32142965,13.8937265 0,22.9694292 0,33.3014344 C0,43.7059548 5.02688156,50.9668937 17.9760986,50.9668937 C25.1344078,50.9668937 30.1622234,48.0333237 31.380182,47.0557809 L28.4856622,41.4014778 C26.6587242,42.5871487 23.3840592,44.4744277 18.8905016,44.4744277 L18.8905016,44.4744277 Z" id="logo@3x" fill="#FF6800"/></g></svg>',
    },
    {
      name: "louis vuitton",
      logo: "path",
      svg:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 45" width="200" height="50" preserveAspectRatio="xMinYMid"><path d="M428.858.793h-5.451l-.793.892V27.85L394.764 0l-.794.793v42.222l.793.793h5.452l.892-.793V16.453l27.355 27.355h1.288V1.685zm-137.568.892v6.343h7.136v35.78h7.137V8.027h6.343l.892-.892V.793h-20.715zm26.265 0v6.343h7.136v35.78h7.136V8.027h6.343l.793-.892V.793h-20.615zM7.136.793H.793L0 1.685v42.123h21.507v-7.136H7.137zm40.636 0A21.507 21.507 0 1069.28 22.3 21.507 21.507 0 0047.772.793zm0 35.78A14.371 14.371 0 1162.044 22.3a14.272 14.272 0 01-14.272 14.272zM365.327.792A21.507 21.507 0 10386.735 22.3 21.507 21.507 0 00365.327.793zm0 35.78A14.371 14.371 0 11379.599 22.3a14.272 14.272 0 01-14.272 14.272zM101.094.792l-.793.793v27.85a7.136 7.136 0 01-7.136 7.136 7.235 7.235 0 01-7.235-7.136V1.586l-.793-.793h-5.55l-.793.793v27.85a14.371 14.371 0 1028.644 0V1.586l-.793-.793zm20.616.892v42.123h6.343l.892-.793V.793h-6.343zM251.547.793l-.893.793v27.85a7.136 7.136 0 01-14.272 0V1.586l-.892-.793h-5.45l-.794.793v27.85a14.371 14.371 0 1028.644 0V1.586l-.892-.793zm20.615.892v42.123h6.343l.793-.793V.793h-6.343zM155.804 19.03a54.016 54.016 0 01-4.757-2.875c-1.586-1.09-2.478-2.28-2.379-4.162a4.956 4.956 0 014.857-4.659 5.451 5.451 0 014.856 2.974h1.289l4.162-4.163A12.786 12.786 0 00153.525.793a12.488 12.488 0 00-8.623 3.072 12.19 12.19 0 00-3.965 8.822c0 4.559 2.478 8.325 4.857 9.613l7.631 4.361a5.253 5.253 0 013.073 5.947 5.55 5.55 0 01-6.343 4.163c-1.784-.198-3.568-1.586-4.46-2.18l-1.883-1.587-5.352 5.55a15.065 15.065 0 008.523 5.254 22.498 22.498 0 004.163.396 13.876 13.876 0 0013.677-13.776c0-7.236-6.442-10.01-9.019-11.398zm47.574 8.028L192.575.793h-7.83l17.84 43.015.793.792.892-.792L222.011.793h-7.73z" fill="#181716"></path></svg>',
    },
  ],
};
const CV_DATA = {
  TITLE: "my cv",
  BTNTEXT: "download",
  URL: "<@DOWNLOAD@>/Pascal-Soulier-Front-End.pdf",
};
const SOCIAL_DATA = {
  LISTS: [
    {
      name: "linkedin",
      url: "https://www.linkedin.com/in/pascal-soulier-a52bb983/",
      rel: "external",
      target: "_target",
    },
    {
      name: "twitter",
      url: "https://twitter.com/Sp_Devfront",
      rel: "external",
      target: "_target",
    },
  ],
};
const COPYRIGHT_DATA = {
  TEXT: "copyright © pascal Soulier 2020",
};
const MOCK_DATA = {
  THEMESWITCH_DATA,
  NAVBAR_DATA,
  PROFIL_DATA,
  SKILLS_DATA,
  TOOLS_DATA,
  TRUST_DATA,
  CV_DATA,
  SOCIAL_DATA,
  COPYRIGHT_DATA,
};

export default MOCK_DATA;
