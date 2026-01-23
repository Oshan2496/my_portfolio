/**
 * Enhanced Typewriter Effect
 * Professional typing animation with multiple features
 * 
 * Features:
 * - Multiple typing styles (standard, scramble, fade)
 * - Cursor customization
 * - Sound effects support
 * - Callbacks and events
 * - Pause/resume control
 * - Multiple instances support
 * - Accessibility features
 */

export class Typewriter {
  constructor(selector, options = {}) {
    this.element = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector;
    
    if (!this.element) {
      console.warn(`Typewriter: Element "${selector}" not found`);
      return;
    }

    // Default options
    this.options = {
      words: [],
      typeSpeed: 100,          // Typing speed in ms
      deleteSpeed: 60,         // Deleting speed in ms
      delayBetweenWords: 1500, // Pause between words
      loop: true,              // Loop through words
      cursor: true,            // Show blinking cursor
      cursorChar: '|',         // Cursor character
      cursorSpeed: 530,        // Cursor blink speed
      autoStart: true,         // Auto-start typing
      shuffle: false,          // Shuffle word order
      scramble: false,         // Scramble effect
      fadeIn: false,           // Fade in characters
      sound: false,            // Typing sound effect
      soundUrl: null,          // Custom sound file
      pauseOnHover: false,     // Pause when hovering
      htmlTags: false,         // Allow HTML tags
      devMode: false,          // Development logging
      
      // Callbacks
      onStart: null,           // Called when typing starts
      onComplete: null,        // Called when word is complete
      onDelete: null,          // Called when deletion starts
      onLoop: null,            // Called on each loop
      onStop: null,            // Called when stopped
      
      ...options
    };

    // Get words from data attribute or options
    this.words = this.getWords();
    
    if (this.words.length === 0) {
      console.warn('Typewriter: No words provided');
      return;
    }

    // State
    this.wordIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.isPaused = false;
    this.isRunning = false;
    this.cursorInterval = null;
    this.audio = null;

    // Setup
    this.init();
  }

  /**
   * Initialize the typewriter
   */
  init() {
    // Create wrapper for cursor
    this.wrapper = document.createElement('span');
    this.wrapper.className = 'typewriter-wrapper';
    this.element.parentNode.insertBefore(this.wrapper, this.element);
    this.wrapper.appendChild(this.element);

    // Add cursor
    if (this.options.cursor) {
      this.createCursor();
    }

    // Shuffle words if needed
    if (this.options.shuffle) {
      this.shuffleWords();
    }

    // Setup audio
    if (this.options.sound) {
      this.setupAudio();
    }

    // Pause on hover
    if (this.options.pauseOnHover) {
      this.wrapper.addEventListener('mouseenter', () => this.pause());
      this.wrapper.addEventListener('mouseleave', () => this.resume());
    }

    // Auto-start
    if (this.options.autoStart) {
      this.start();
    }

    // Add styles
    this.addStyles();
  }

  /**
   * Get words from data attribute or options
   */
  getWords() {
    // Try data attribute first
    const dataWords = this.element.getAttribute('data-words');
    if (dataWords) {
      try {
        return JSON.parse(dataWords);
      } catch (e) {
        console.warn('Typewriter: Invalid JSON in data-words');
      }
    }

    // Use options
    if (this.options.words && this.options.words.length > 0) {
      return this.options.words;
    }

    // Fallback
    return ['Web Developer', 'Designer', 'Creator'];
  }

  /**
   * Create blinking cursor
   */
  createCursor() {
    this.cursor = document.createElement('span');
    this.cursor.className = 'typewriter-cursor';
    this.cursor.textContent = this.options.cursorChar;
    this.wrapper.appendChild(this.cursor);

    // Blink animation
    this.cursorInterval = setInterval(() => {
      if (!this.isPaused) {
        this.cursor.style.opacity = this.cursor.style.opacity === '0' ? '1' : '0';
      }
    }, this.options.cursorSpeed);
  }

  /**
   * Setup audio
   */
  setupAudio() {
    const soundUrl = this.options.soundUrl || "assets/audio/keyboard-typing-sound-effect.mp3";
    
    this.audio = new Audio(soundUrl);
    this.audio.volume = 0.3;
  }

  /**
   * Play typing sound
   */
  playSound() {
    if (this.audio && this.options.sound) {
      this.audio.currentTime = 0;
      this.audio.play().catch(() => {});
    }
  }

  /**
   * Shuffle words array
   */
  shuffleWords() {
    for (let i = this.words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.words[i], this.words[j]] = [this.words[j], this.words[i]];
    }
  }

  /**
   * Start typing animation
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.isPaused = false;
    
    if (this.options.onStart) {
      this.options.onStart(this.words[this.wordIndex]);
    }
    
    this.type();
  }

  /**
   * Stop typing animation
   */
  stop() {
    this.isRunning = false;
    this.isPaused = false;
    
    if (this.options.onStop) {
      this.options.onStop();
    }
  }

  /**
   * Pause typing animation
   */
  pause() {
    this.isPaused = true;
  }

  /**
   * Resume typing animation
   */
  resume() {
    if (this.isPaused && this.isRunning) {
      this.isPaused = false;
      this.type();
    }
  }

  /**
   * Main typing function
   */
  type() {
    if (this.isPaused || !this.isRunning) return;

    const currentWord = this.words[this.wordIndex];

    // Typing phase
    if (!this.isDeleting) {
      // Get next character
      const nextChar = currentWord.substring(0, this.charIndex + 1);
      
      // Apply effect
      if (this.options.scramble && this.charIndex < currentWord.length) {
        this.scrambleEffect(nextChar);
      } else if (this.options.fadeIn) {
        this.fadeInEffect(nextChar);
      } else {
        this.element.textContent = nextChar;
      }
      
      this.charIndex++;
      this.playSound();

      // Word complete
      if (this.charIndex === currentWord.length) {
        this.isDeleting = true;
        
        if (this.options.onComplete) {
          this.options.onComplete(currentWord);
        }
        
        setTimeout(() => this.type(), this.options.delayBetweenWords);
        return;
      }

      setTimeout(() => this.type(), this.getRandomSpeed(this.options.typeSpeed));
    } 
    // Deleting phase
    else {
      const deletedText = currentWord.substring(0, this.charIndex - 1);
      this.element.textContent = deletedText;
      this.charIndex--;

      // Deletion complete
      if (this.charIndex === 0) {
        this.isDeleting = false;
        
        if (this.options.onDelete) {
          this.options.onDelete();
        }
        
        // Move to next word
        this.wordIndex++;
        
        // Check if should loop
        if (this.wordIndex >= this.words.length) {
          if (this.options.loop) {
            this.wordIndex = 0;
            
            if (this.options.onLoop) {
              this.options.onLoop();
            }
          } else {
            this.stop();
            return;
          }
        }
      }

      setTimeout(() => this.type(), this.getRandomSpeed(this.options.deleteSpeed));
    }
  }

  /**
   * Scramble effect
   */
  scrambleEffect(targetText) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let iterations = 0;
    const maxIterations = 10;
    
    const interval = setInterval(() => {
      this.element.textContent = targetText
        .split('')
        .map((char, index) => {
          if (index < this.charIndex - 1) {
            return targetText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        this.element.textContent = targetText;
      }
    }, 30);
  }

  /**
   * Fade in effect
   */
  fadeInEffect(text) {
    this.element.textContent = '';
    const chars = text.split('');
    
    chars.forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.opacity = '0';
      span.style.transition = 'opacity 0.3s ease';
      this.element.appendChild(span);
      
      setTimeout(() => {
        span.style.opacity = '1';
      }, index * 50);
    });
  }

  /**
   * Get random speed with variance
   */
  getRandomSpeed(baseSpeed) {
    const variance = baseSpeed * 0.3; // 30% variance
    return baseSpeed + (Math.random() * variance * 2 - variance);
  }

  /**
   * Add necessary styles
   */
  addStyles() {
    const styleId = 'typewriter-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .typewriter-wrapper {
        display: inline-block;
      }
      
      .typewriter-cursor {
        display: inline-block;
        margin-left: 2px;
        font-weight: 300;
        opacity: 1;
        transition: opacity 0.1s;
      }
      
      .typewriter-cursor.hide {
        opacity: 0;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Destroy the typewriter instance
   */
  destroy() {
    this.stop();
    
    if (this.cursorInterval) {
      clearInterval(this.cursorInterval);
    }
    
    if (this.cursor) {
      this.cursor.remove();
    }
    
    if (this.wrapper && this.wrapper.parentNode) {
      this.wrapper.parentNode.insertBefore(this.element, this.wrapper);
      this.wrapper.remove();
    }
  }
}

/**
 * Simple initialization function (backward compatible)
 */
export function initTypewriter(selector, options = {}) {
  const element = document.querySelector(selector);
  if (!element) return null;

  // Get options from data attributes
  const dataOptions = {
    words: element.getAttribute('data-words') ? JSON.parse(element.getAttribute('data-words')) : [],
    typeSpeed: parseInt(element.getAttribute('data-speed')) || 100,
    deleteSpeed: parseInt(element.getAttribute('data-delete')) || 60,
    delayBetweenWords: parseInt(element.getAttribute('data-delay')) || 1500,
    loop: element.getAttribute('data-loop') !== 'false',
    cursor: element.getAttribute('data-cursor') !== 'false',
    cursorChar: element.getAttribute('data-cursor-char') || '|',
  };

  // Merge with provided options
  const mergedOptions = { ...dataOptions, ...options };

  return new Typewriter(selector, mergedOptions);
}

/**
 * Auto-initialize all typewriter elements
 */
export function autoInitTypewriter() {
  const elements = document.querySelectorAll('[data-typewriter]');
  const instances = [];
  
  elements.forEach(element => {
    instances.push(new Typewriter(element));
  });
  
  return instances;
}

// Auto-initialize on DOM ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInitTypewriter);
  } else {
    autoInitTypewriter();
  }
}

// Export default
export default Typewriter;