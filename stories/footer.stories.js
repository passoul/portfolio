import { withKnobs, text } from '@storybook/addon-knobs';

import Copyright from '../src/components/copyright/Copyright.svelte';

export default {
  title: 'Portfolio/Footer',
  component: Copyright,
  decorators: [withKnobs],
};

export const Default = () => ({
    Component: Copyright,
    props: { 
        copyrightData:{            
            "TEXT": text("Profession", "copyright © pascal Soulier 2020"),
        }
    },
});