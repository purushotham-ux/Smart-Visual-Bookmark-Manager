/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        secondary: {
          DEFAULT: '#36D6BD',
          50: '#E8F9F7',
          100: '#C5F1EA',
          200: '#9AE9DE',
          300: '#6FE0D1',
          400: '#44DBC5',
          500: '#36D6BD',
          600: '#24AD98',
          700: '#1A7E6F',
          800: '#104F46',
          900: '#06201C',
        },
        success: {
          DEFAULT: '#23C16B',
          50: '#E6F7EE',
          100: '#C3ECD7',
          200: '#9FE1BF',
          300: '#7CD6A7',
          400: '#50CB8E',
          500: '#23C16B',
          600: '#1C9B56',
          700: '#156E3D',
          800: '#0E4525',
          900: '#06200F',
        },
        warning: {
          DEFAULT: '#FFC043',
          50: '#FFF7E8',
          100: '#FEEAC5',
          200: '#FEDDA1',
          300: '#FECF7D',
          400: '#FDC25A',
          500: '#FFC043',
          600: '#FFA90A',
          700: '#D18800',
          800: '#9E6600',
          900: '#6A4500',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
        poppins: ['Poppins', 'sans-serif'],
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
        '64': '64px',
      },
      fontSize: {
        'display': ['32px', { lineHeight: '1.2' }],
        'h1': ['28px', { lineHeight: '1.3' }],
        'h2': ['24px', { lineHeight: '1.35' }],
        'h3': ['20px', { lineHeight: '1.4' }],
        'h4': ['18px', { lineHeight: '1.45' }],
        'body': ['16px', { lineHeight: '1.6' }],
        'small': ['14px', { lineHeight: '1.6' }],
        'micro': ['12px', { lineHeight: '1.5' }],
      },
      borderRadius: {
        'DEFAULT': '12px',
        'sm': '8px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'light': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'heavy': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'colored': '0 4px 14px 0 rgba(99, 102, 241, 0.2)',
      },
      transitionDuration: {
        'DEFAULT': '300ms',
        '150': '150ms',
        '200': '200ms',
        '400': '400ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'DEFAULT': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'in': 'cubic-bezier(0.4, 0, 1, 1)',
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blob': 'blob 7s infinite',
        'floating': 'floating 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        floating: {
          '0%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
          '100%': {
            transform: 'translateY(0px)',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      svgSize: {
        'xs': '16px',
        'sm': '20px',
        'md': '24px',
        'lg': '32px',
        'xl': '40px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '80px',
      },
    },
  },
  plugins: [
    function({ addUtilities, theme }) {
      const newUtilities = {};
      
      Object.entries(theme('svgSize')).forEach(([key, value]) => {
        newUtilities[`.svg-${key}`] = {
          'width': value,
          'height': value,
          'min-width': value,
          'min-height': value,
        };
      });
      
      newUtilities['.backdrop-blur-xs'] = {
        'backdrop-filter': 'blur(2px)',
      };
      newUtilities['.backdrop-blur-sm'] = {
        'backdrop-filter': 'blur(4px)',
      };
      newUtilities['.backdrop-blur-md'] = {
        'backdrop-filter': 'blur(8px)',
      };
      newUtilities['.backdrop-blur-lg'] = {
        'backdrop-filter': 'blur(12px)',
      };
      newUtilities['.backdrop-blur-xl'] = {
        'backdrop-filter': 'blur(16px)',
      };
      
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
} 