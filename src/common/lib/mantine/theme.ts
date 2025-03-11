import { Button, Group, MantineProvider, createTheme } from '@mantine/core';

export const theme = createTheme({
    components: {
        Button: Button.extend({
            vars: (theme, props) => {
                if (props.size === 'md') {
                    return {
                        root: {
                            '--button-padding-x': '30px',
                            '--button-radius': '12px',
                        },
                    };
                }

                if (props.size === 'sm') {
                    return {
                        root: {
                            '--button-padding-x': '20px',
                            '--button-radius': '12px',
                        },
                    };
                }
                return { root: {} };
            },
        }),
    },
});
