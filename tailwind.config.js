export default {
  content: ['./index.html', './**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#15803d',
          deep: '#0f3d24',
          soft: '#eef6f0',
        },
        accent: {
          DEFAULT: '#b45309',
          soft: '#fdf5e9',
        },
        canvas: '#fdfbf7',
        surface: '#ffffff',
        ink: {
          DEFAULT: '#1c1917',
          muted: '#57534e',
        },
        line: '#e7e5e4',
        danger: {
          DEFAULT: '#b91c1c',
          soft: '#fdf1f1',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        md: '0.625rem',
        lg: '0.75rem',
        xl: '0.875rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(28, 25, 23, 0.04), 0 1px 3px rgba(28, 25, 23, 0.06)',
      },
      maxWidth: {
        content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [],
}
