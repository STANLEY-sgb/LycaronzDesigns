module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '360px',
      },
      colors: {
        primary: {
          DEFAULT: '#1E3A8A', // Couture Royal Navy
          dark: '#0A0D1F',    // Haute Obsidian
          light: '#2563EB',   // Sapphire Blue
          subtle: '#F0F5FF',  // Muted tint
        },
        secondary: {
          DEFAULT: '#D4AF37', // Metallic Warm Gold
          light: '#F7E7B4',
          dark: '#AA8222',
        },
        gold: {
          50: '#FDFBF7',
          100: '#FAF4E5',
          200: '#F3E5C2',
          300: '#EBD194',
          400: '#E0BA62',
          500: '#D4AF37',
          600: '#B8902A',
          700: '#8F6E1C',
          800: '#6B5014',
          900: '#47340B',
        },
        obsidian: {
          950: '#060810',
          900: '#0A0D1F',
          850: '#0F1326',
          800: '#161B33',
          700: '#22284C',
        },
        success: '#10B981',
        danger: '#EF4444',
        'neutral-light': '#FAF8F5',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
    },
  },
  plugins: [],
};
