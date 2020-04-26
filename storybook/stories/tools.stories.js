import "../css/utils.css";
import { withKnobs, text } from "@storybook/addon-knobs";
import Tools from "../../src/components/tools/Tools.svelte";

export default {
  title: "Portfolio/Tools",
  component: Tools,
  decorators: [withKnobs],
};

export const Default = () => ({
  Component: Tools,
  props: {
    toolsData: {
      TITLE: text("Title", "tools"),
      LISTS: [
        "git",
        "grunt",
        "brunch",
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
    },
  },
});
