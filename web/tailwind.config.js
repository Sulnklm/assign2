/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Grotesque: ['"Darker Grotesque", sans-serif'],
      },
      fontSize: {
        h1: ["3.25rem"],
        "h1-md": ["3.5rem"],
        "h1-lg": ["4rem"],
        h3: ["1.6rem"],
        "h3-md": ["1.75rem"],
        "h3-lg": ["2rem"],
        p: ["16px", { lineHeight: "1.3" }],
        "p-md": ["17px"],
        "p-lg": ["18px"],
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        h1: {
          "@apply text-h1 font-Grotesque font-[450]": {},
          "@screen md": { "@apply text-h1-md": {} },
          "@screen lg": { "@apply text-h1-lg": {} },
        },
        h3: {
          "@apply text-h3 font-Grotesque font-[500]": {},
          "@screen md": { "@apply text-h3-md": {} },
          "@screen lg": { "@apply text-h3-lg": {} },
        },
        p: {
          "@apply text-p font-Grotesque": {},
          "@screen md": { "@apply text-p-md": {} },
          "@screen lg": { "@apply text-p-lg": {} },
        },
      });
    },
  ],
};
