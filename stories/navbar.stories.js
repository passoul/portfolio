import { withKnobs, text } from '@storybook/addon-knobs';

import Navbar from '../src/components/navbar/Navbar.svelte';

export default {
  title: 'Portfolio/Navbar',
  component: Navbar,
  decorators: [withKnobs],
};

export const Default = () => ({
    Component: Navbar,
    props: {
        "navlists": [      
        { id: 1, url: "/", label: text("Nav1", "Home") },
        { id: 2, url: "#skills&tools", label: text("Nav2", "Skills & Tools")},
        { id: 3, url: "#trust", label: text("Nav3", "Trust") },
        { id: 4, url: "#download", label: text("Nav4", "Download") }
    ]}
});