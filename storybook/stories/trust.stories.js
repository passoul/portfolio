import "../css/utils.css";
import { withKnobs, text } from "@storybook/addon-knobs";
import Trust from "../../src/components/trust/Trust.svelte";

export default {
  title: "Portfolio/Trust",
  component: Trust,
  decorators: [withKnobs],
};

export const Default = () => ({
  Component: Trust,
  props: {
    trustData: {
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
    },
  },
});
