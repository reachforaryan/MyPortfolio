/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        retro: {
          gray: '#c0c0c0',
          'gray-light': '#dfdfdf',
          'gray-dark': '#808080',
          blue: '#000080',
          teal: '#008080',
          white: '#ffffff',
          black: '#000000',
        },
        neon: {
          pink: '#ff00ff',
          cyan: '#00ffff',
          purple: '#bc13fe',
          green: '#00ff00',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        'retro': 'inset 1px 1px #dfdfdf, inset -1px -1px #000000, inset 2px 2px #ffffff, inset -2px -2px #808080',
        'retro-in': 'inset 1px 1px #808080, inset -1px -1px #ffffff, inset 2px 2px #000000, inset -2px -2px #dfdfdf',
        'retro-out': 'inset 1px 1px #ffffff, inset -1px -1px #808080, inset 2px 2px #dfdfdf, inset -2px -2px #000000',
        'retro-out': 'inset 1px 1px #ffffff, inset -1px -1px #808080, inset 2px 2px #dfdfdf, inset -2px -2px #000000',
        'neon-blue': '0 0 5px theme("colors.neon.cyan"), 0 0 20px theme("colors.neon.cyan")',
        'neon-pink': '0 0 5px theme("colors.neon.pink"), 0 0 20px theme("colors.neon.pink")',
      },
      keyframes: {
        'crt-flicker': {
          '0%': { opacity: '0.97' },
          '5%': { opacity: '0.95' },
          '10%': { opacity: '0.9' },
          '15%': { opacity: '0.95' },
          '20%': { opacity: '0.99' },
          '50%': { opacity: '0.9' },
          '100%': { opacity: '0.97' },
        },
        'text-glow': {
          '0%, 100%': { textShadow: '0 0 4px theme("colors.neon.cyan")' },
          '50%': { textShadow: '0 0 20px theme("colors.neon.cyan"), 0 0 10px theme("colors.neon.purple")' },
        }
      },
      animation: {
        'crt-flicker': 'crt-flicker 0.15s infinite',
        'text-glow': 'text-glow 2s ease-in-out infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}

