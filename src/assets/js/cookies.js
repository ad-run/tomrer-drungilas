window.addEventListener("load", function () {
  window.cookieconsent.initialise({
    palette: {
      popup: {
        background: "#000",
      },
      button: {
        background: "#f1d600",
        text: "#000",
      },
    },
    theme: "classic",
    content: {
      message:
        "We use cookies to ensure you get the best experience on our website.",
      dismiss: "Got it!",
      link: "Learn more",
      href: "/personvern", // Optional link to your privacy policy
    },
    location: true, // Optional: use this to geo-detect and show the banner based on location
    expireDays: 30, // Cookie expiration in days
  });
});
