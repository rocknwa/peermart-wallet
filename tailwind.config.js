const { withAccountKitUi } = require("@account-kit/react/tailwind");

module.exports = withAccountKitUi({
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
});
