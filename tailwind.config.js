/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        primary:'#ED2353',
        'dark-blue':'#1E3354',
        success:'#16a34a'
      },
       fontFamily: {
        'dancing-bold': ['Dancing-Bold'],
        'dancing-medium': ['Dancing-Medium'],
        'dancing-Regular': ['Dancing-Regular'],
        'dancing-SemiBold': ['Dancing-SemiBold'],
        'sam-bold': ['Sam-Bold'],
        'sam-medium': ['Sam-Medium'],
        'sam': ['Sam'],
      },
    
    },
  },
  plugins: [],
}