import { withKnobs, text } from '@storybook/addon-knobs';
import Social from '../src/components/buttons/social/Social.svelte';

export default {
    title: 'Portfolio/Buttons',
    component: Social,
    decorators: [withKnobs],
  };

  export const Default = () => ({
    Component: Social,
    props: { 
        socialData: {
            "LISTS": [{
                "name": "linkedin",
                "url": "https://www.linkedin.com/in/pascal-soulier-a52bb983/",
                "rel": "external",
                "target": "_target",
            },
            {
                "name": "tweeter",
                "url": "https://twitter.com/Sp_Devfront",
                "rel": "external",
                "target": "_target",
            }]
        }
    }
});