export function initTypewriter(selector) {
  const el = document.querySelector(selector);
  if (!el) return;

  // Get words from data-words attribute OR fallback
  let words = [];
  try {
    words = JSON.parse(el.getAttribute("data-words")) || [];
  } catch (error) {
    words = [];
  }

  if (words.length === 0) {
    words = ["Web Developer", "Designer", "Freelancer"];
  }

  const typeSpeed = parseInt(el.getAttribute("data-speed")) || 100;
  const deleteSpeed = parseInt(el.getAttribute("data-delete")) || 60;
  const delayBetweenWords = parseInt(el.getAttribute("data-delay")) || 1500;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, delayBetweenWords);
        return;
      }

      setTimeout(type, typeSpeed);
    } else {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }

      setTimeout(type, deleteSpeed);
    }
  }

  type();
}
