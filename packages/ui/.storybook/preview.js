import { withThemeByClassName } from '@storybook/addon-themes';
import { withThemeProvider } from './decorators';
import '../src/styles/globals.css';
const preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        backgrounds: {
            default: 'light',
            values: [
                { name: 'light', value: '#ffffff' },
                { name: 'dark', value: '#020817' },
            ],
        },
    },
    decorators: [
        withThemeProvider,
        withThemeByClassName({
            themes: {
                light: 'light',
                dark: 'dark',
            },
            defaultTheme: 'light',
        }),
    ],
};
export default preview;
//# sourceMappingURL=preview.js.map