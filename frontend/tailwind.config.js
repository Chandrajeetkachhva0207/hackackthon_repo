/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fintech: {
          primary: '#101B35',     // Deep Navy
          secondary: '#365CF5',   // Royal Blue
          accent: '#13B8A6',      // Teal
          bg: '#F7F9FC',          // Off White
          card: '#FFFFFF',        // Pure White
          text: '#17243A',        // Dark Navy Text
          muted: '#718096',       // Muted Text
          success: '#16A34A',     // Green
          warning: '#F59E0B',     // Amber
          border: '#E2E8F0',
          darkBg: '#090E1A',
          darkCard: '#101B35',
          darkBorder: '#1E2D4A',
          darkMuted: '#94A3B8',
        },
        navy: {
          950: '#090E1A',
          900: '#101B35',
          800: '#17243A',
          700: '#233352',
          600: '#3D5070',
        },
        brand: {
          blue: '#365CF5',
          'blue-hover': '#2449D8',
          'blue-light': '#EEF2FF',
          teal: '#13B8A6',
          'teal-light': '#F0FDFA',
          cyan: '#06B6D4',
          emerald: '#16A34A',
          amber: '#F59E0B',
          rose: '#EF4444',
        },
        surface: {
          bg: '#F7F9FC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          subtle: '#F1F5F9',
          darkBg: '#090E1A',
          darkCard: '#101B35',
          darkBorder: '#1E2D4A',
          darkSubtle: '#15223E',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 4px 0 rgba(16, 27, 53, 0.04), 0 1px 2px 0 rgba(16, 27, 53, 0.02)',
        'card-hover': '0 16px 32px -8px rgba(16, 27, 53, 0.08), 0 4px 12px -2px rgba(16, 27, 53, 0.04)',
        'elevated': '0 20px 40px -15px rgba(16, 27, 53, 0.12)',
        'glow-blue': '0 0 30px -4px rgba(54, 92, 245, 0.35)',
        'glow-teal': '0 0 30px -4px rgba(19, 184, 166, 0.35)',
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
