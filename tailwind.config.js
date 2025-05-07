/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4fe',
          100: '#dde6fd',
          200: '#c2d3fc',
          300: '#9ab8fa',
          400: '#7295f8',
          500: '#4c6ef5',
          600: '#3a4ded',
          700: '#2c36d9',
          800: '#2930b0',
          900: '#27318c',
          950: '#1a1e50',
        },
        secondary: {
          DEFAULT: '#14b8a6',
          50: '#ecfdf9',
          100: '#d1faf1',
          200: '#a7f3e3',
          300: '#6ee7d1',
          400: '#36cfb7',
          500: '#14b8a6',
          600: '#0d8f85',
          700: '#0f736c',
          800: '#115b56',
          900: '#134e47',
          950: '#042f2c',
        },
        success: {
          DEFAULT: '#10b981',
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        warning: {
          DEFAULT: '#f59e0b',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
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
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        accent: {
          purple: '#7c3aed',
          blue: '#3b82f6',
          teal: '#14b8a6',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
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
        'colored': '0 4px 14px 0 rgba(76, 110, 245, 0.2)',
        'blue-glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'purple-glow': '0 0 20px rgba(124, 58, 237, 0.5)',
        'teal-glow': '0 0 20px rgba(20, 184, 166, 0.5)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #4c6ef5, #14b8a6)',
        'gradient-secondary': 'linear-gradient(to right, #7c3aed, #3b82f6)',
        'gradient-success': 'linear-gradient(to right, #10b981, #14b8a6)',
        'gradient-warning': 'linear-gradient(to right, #f59e0b, #f43f5e)',
        'gradient-sidebar': 'linear-gradient(to bottom, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95))',
        'gradient-card': 'linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
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
        'gradient': 'gradient 8s ease infinite',
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
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
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
      
      newUtilities['.text-gradient-primary'] = {
        'background-image': 'linear-gradient(to right, #4c6ef5, #14b8a6)',
        '-webkit-background-clip': 'text',
        'color': 'transparent',
      };
      
      newUtilities['.text-gradient-secondary'] = {
        'background-image': 'linear-gradient(to right, #7c3aed, #3b82f6)',
        '-webkit-background-clip': 'text',
        'color': 'transparent',
      };
      
      newUtilities['.glass'] = {
        'background': 'rgba(255, 255, 255, 0.1)',
        'backdrop-filter': 'blur(10px)',
        '-webkit-backdrop-filter': 'blur(10px)',
        'border': '1px solid rgba(255, 255, 255, 0.2)',
      };
      
      newUtilities['.glass-dark'] = {
        'background': 'rgba(15, 23, 42, 0.7)',
        'backdrop-filter': 'blur(10px)',
        '-webkit-backdrop-filter': 'blur(10px)',
        'border': '1px solid rgba(30, 41, 59, 0.5)',
      };
      
      addUtilities(newUtilities);
    },
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
} 