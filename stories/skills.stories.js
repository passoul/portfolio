import { withKnobs, object, text } from '@storybook/addon-knobs';
import Skills from '../src/components/skills/Skills.svelte';

export default {
    title: 'Portfolio/Skills',
    component: Skills,
    decorators: [withKnobs],
  };
  
  export const Default = () => ({
      Component: Skills,
      props: { 
        skillsData: {
            "TITLE": text("Title", "skills"),
            "LISTS": object("Lists", [{
                "cat_title": "programming languages",
                "cat_items":[{
                    "name": "html",
                    "level": 80,
                },
                {
                    "name": "css",
                    "level": 75,
                },
                {
                    "name": "javascript",
                    "level": 65,
                },
                {
                    "name": "accessibility",
                    "level": 60,
                },]
            },
            {
                "cat_title": "frameworks",
                "cat_items": [{
                    "name": "sass",
                    "level": 70,
                },
                {
                    "name": "less",
                    "level": 65,
                },
                {
                    "name": "jquery",
                    "level": 75,
                },
                {
                    "name": "vue",
                    "level": 50,
                },
                {
                    "name": "angular",
                    "level": 55,
                },
                {
                    "name": "react",
                    "level": 45,
                },]
            },]),
        }
    },
  });