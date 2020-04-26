import "../css/utils.css";
import { withKnobs, text } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";

import DownloadBtn from "../../src/components/buttons/download/Download.svelte";

export default {
  title: "Portfolio/Buttons",
  component: DownloadBtn,
  decorators: [withKnobs],
};

export const DownloadCv = () => ({
  Component: DownloadBtn,
  props: {
    cvData: {
      TITLE: text("Title", "donwload my cv"),
      URL: "/assets/Pascal-Soulier-Front-End.pdf",
    },
  },
});
