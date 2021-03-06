import "../css/utils.css";
import { withKnobs } from "@storybook/addon-knobs";
import Social from "../../src/components/buttons/social/Social.svelte";

export default {
  title: "Portfolio/Buttons",
  component: Social,
  decorators: [withKnobs],
};

export const SocialMedia = () => ({
  Component: Social,
  props: {
    socialData: {
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
    },
  },
});
