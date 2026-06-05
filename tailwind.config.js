export default {
  theme: {
    extend: {
      colors: {
        bg: '#f5f2ec',
        surface: '#fff',
        ink: '#1a1714',
        muted: '#6b6560',
        rule: '#dedad3',
        jh: '#1e7e4e',
        fda: '#2a5c8f',
        bav: '#c0392b',
        'jh-light': '#e6f4ec',
        'fda-light': '#e8eef5',
        'bav-light': '#fdf0ee',
        active: '#1578e8',
        complete: '#8a42e8',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
        mono: ['DM Mono', 'monospace'],
      },
      screens: {
        xs: '420px',
      },
      boxShadow: {
        app: '0 4px 24px rgba(0,0,0,.09)',
        'app-lg': '0 8px 48px rgba(0,0,0,.15)',
      },
    },
  },
  plugins: [
    ({ addBase, addComponents }) => {
      addBase({
        '*, *::before, *::after': {
          boxSizing: 'border-box',
          margin: '0',
          padding: '0',
        },
        body: {
          minHeight: '100vh',
          overflowX: 'hidden',
          background: '#f5f2ec',
          color: '#1a1714',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '14px',
          lineHeight: '1.6',
        },
        'button, input, select, textarea': {
          font: 'inherit',
        },
        button: {
          cursor: 'pointer',
        },
        'button:disabled': {
          cursor: 'not-allowed',
          opacity: '.35',
        },
      });
      addComponents({
        '.app-icon': {
          width: '1.15em',
          height: '1.15em',
          flexShrink: '0',
          fill: 'currentColor',
          display: 'inline-block',
          verticalAlign: '-0.18em',
        },
      });
    },
  ],
};
