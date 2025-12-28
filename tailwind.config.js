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
        vapor: {
          purple: '#d6d6f5', // Lavender
          pink: '#f4b8e4',   // Soft Pink
          mint: '#81ec9d',   // Mint
          blue: '#89dceb',   // Soft Cyan
          yellow: '#fae3b0', // Pale Cream
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
        'vapor-glow': '0 0 10px theme("colors.vapor.purple"), 0 0 20px theme("colors.vapor.blue")',
      },
      backgroundImage: {
        'vapor-gradient': 'linear-gradient(to right bottom, theme("colors.vapor.purple"), theme("colors.vapor.pink"), theme("colors.vapor.blue"))',
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
          '0%, 100%': { textShadow: '0 0 4px theme("colors.vapor.blue")' },
          '50%': { textShadow: '0 0 15px theme("colors.vapor.pink"), 0 0 10px theme("colors.vapor.purple")' },
        },
        'vapor-drift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'border-pulse': {
          '0%, 100%': { borderColor: 'theme("colors.vapor.purple")' },
          '50%': { borderColor: 'theme("colors.vapor.blue")' },
        }
      },
      animation: {
        'crt-flicker': 'crt-flicker 0.15s infinite',
        'text-glow': 'text-glow 3s ease-in-out infinite',
        'vapor-drift': 'vapor-drift 10s linear infinite',
        'border-pulse': 'border-pulse 4s ease infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}

