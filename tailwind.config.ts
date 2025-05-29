
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px) scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0) scale(1)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px) translateX(0px) rotate(0deg)'
					},
					'25%': {
						transform: 'translateY(-15px) translateX(10px) rotate(2deg)'
					},
					'50%': {
						transform: 'translateY(-30px) translateX(-5px) rotate(-1deg)'
					},
					'75%': {
						transform: 'translateY(-15px) translateX(-10px) rotate(1deg)'
					}
				},
				'rotate-y': {
					'0%': { transform: 'rotateY(0deg)' },
					'100%': { transform: 'rotateY(360deg)' }
				},
				'glow': {
					'0%, 100%': { 
						opacity: '1',
						filter: 'brightness(1) drop-shadow(0 0 8px currentColor)'
					},
					'50%': { 
						opacity: '0.8',
						filter: 'brightness(1.2) drop-shadow(0 0 25px currentColor)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(40px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'pulse': {
					'0%, 100%': {
						opacity: '1',
						transform: 'scale(1)'
					},
					'50%': {
						opacity: '0.8',
						transform: 'scale(1.05)'
					}
				},
				'bounce-gentle': {
					'0%, 100%': {
						transform: 'translateY(0) scale(1)'
					},
					'50%': {
						transform: 'translateY(-15px) scale(1.03)'
					}
				},
				'mesh-1': {
					'0%, 100%': { transform: 'translate(0%, 0%) rotate(0deg)' },
					'33%': { transform: 'translate(20%, -20%) rotate(90deg)' },
					'66%': { transform: 'translate(-10%, 10%) rotate(180deg)' }
				},
				'mesh-2': {
					'0%, 100%': { transform: 'translate(0%, 0%) rotate(0deg)' },
					'33%': { transform: 'translate(-20%, 20%) rotate(-90deg)' },
					'66%': { transform: 'translate(10%, -10%) rotate(-180deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.3s ease-out',
				'accordion-up': 'accordion-up 0.3s ease-out',
				'fade-in': 'fade-in 0.7s ease-out',
				'scale-in': 'scale-in 0.5s ease-out',
				'float': 'float 12s ease-in-out infinite',
				'rotate-y': 'rotate-y 15s linear infinite',
				'glow': 'glow 3s ease-in-out infinite',
				'slide-up': 'slide-up 0.8s ease-out',
				'pulse': 'pulse 4s ease-in-out infinite',
				'bounce-gentle': 'bounce-gentle 4s ease-in-out infinite',
				'mesh-1': 'mesh-1 30s ease-in-out infinite',
				'mesh-2': 'mesh-2 35s ease-in-out infinite'
			},
			// Modern 3D perspective utilities
			perspective: {
				'none': 'none',
				'500': '500px',
				'1000': '1000px',
				'2000': '2000px',
				'3000': '3000px'
			},
			transformStyle: {
				'flat': 'flat',
				'3d': 'preserve-3d'
			},
			backfaceVisibility: {
				'visible': 'visible',
				'hidden': 'hidden'
			},
			// Enhanced glassmorphism utilities
			backdropBlur: {
				'xs': '2px',
				'sm': '4px',
				'DEFAULT': '8px',
				'md': '12px',
				'lg': '16px',
				'xl': '24px',
				'2xl': '32px',
				'3xl': '48px',
				'4xl': '64px'
			},
			backdropSaturate: {
				'0': '0',
				'50': '.5',
				'100': '1',
				'150': '1.5',
				'175': '1.75',
				'200': '2',
				'DEFAULT': '1.8'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }: any) {
			const newUtilities = {
				'.transform-style-flat': {
					'transform-style': 'flat',
				},
				'.transform-style-3d': {
					'transform-style': 'preserve-3d',
				},
				'.backface-visible': {
					'backface-visibility': 'visible',
				},
				'.backface-hidden': {
					'backface-visibility': 'hidden',
				},
				'.perspective-none': {
					'perspective': 'none',
				},
				'.perspective-500': {
					'perspective': '500px',
				},
				'.perspective-1000': {
					'perspective': '1000px',
				},
				'.perspective-2000': {
					'perspective': '2000px',
				},
				'.perspective-3000': {
					'perspective': '3000px',
				},
			}
			addUtilities(newUtilities)
		},
	],
} satisfies Config;
