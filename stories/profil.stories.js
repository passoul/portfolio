import { withKnobs, text } from '@storybook/addon-knobs';

import Profil from '../src/components/heading/Profil.svelte';

export default {
  title: 'Portfolio/Heading',
  component: Profil,
  decorators: [withKnobs],
};

export const Default = () => ({
    Component: Profil,
    props: { 
      profession: text("Profession", "front end developer"),
      firstname: text("FirstName", "pascal"),
      lastname: text("Lastname", "Soulier"),
    },
});