import "../css/utils.css";
import { withKnobs, text } from "@storybook/addon-knobs";

import Avatar from "../../src/components/avatar/Avatar.svelte";

export default {
  title: "Portfolio/Avatar",
  component: Avatar,
  decorators: [withKnobs],
};

export const Default = () => ({
  Component: Avatar,
  props: {
    avatar: {
      src: "/static/media/avatar/avatar.png",
      alt: "ceci est ma photo",
      rounded: true,
    },
  },
});
