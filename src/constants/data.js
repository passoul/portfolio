const THEMESWITCH_DATA = {
  TEXTDARK: "go dark",
  TEXTLIGHT: "go light",
};
const NAVBAR_DATA = [
  { id: 1, url: "#skills", label: "skills" },
  { id: 2, url: "#tools", label: "tools" },
  { id: 3, url: "#trust", label: "trust" },
  { id: 4, url: "#download", label: "download" },
];
const PROFIL_DATA = {
  AVATAR: {
    alt: "ceci est ma photo",
    src: "./static/media/avatar/avatar.png",
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
  TITLE: " they trusted me",
  COMPANIES: [
    {
      name: "lwm",
      logo: "path",
    },
    {
      name: "pmu",
      logo: "path",
    },
    {
      name: "société générale",
      logo: "path",
    },
    {
      name: "imagine",
      logo: "path",
    },
    {
      name: "louis vuitton",
      logo: "path",
    },
  ],
};
const CV_DATA = {
  TITLE: "download my cv",
  BTNTEXT: "download",
  URL: "/assets/Pascal-Soulier-Front-End.pdf",
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
