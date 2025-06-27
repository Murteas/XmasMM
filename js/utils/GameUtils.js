// GameUtils.js - Common utility functions for XmasMM

class GameUtils {
  static generateRandomCode(elements, codeLength) {
    const code = [];
    for (let i = 0; i < codeLength; i++) {
      const randomElement = elements[Math.floor(Math.random() * elements.length)];
      code.push(randomElement);
    }
    return code;
  }

  static calculateFeedback(guess, code) {
    let black = 0; // Correct element and position
    let white = 0; // Correct element, wrong position
    
    const guessCopy = [...guess];
    const codeCopy = [...code];
    
    // First pass: count black pegs (exact matches)
    for (let i = guessCopy.length - 1; i >= 0; i--) {
      if (guessCopy[i] === codeCopy[i]) {
        black++;
        guessCopy.splice(i, 1);
        codeCopy.splice(i, 1);
      }
    }
    
    // Second pass: count white pegs (element exists but wrong position)
    for (let i = 0; i < guessCopy.length; i++) {
      const index = codeCopy.indexOf(guessCopy[i]);
      if (index !== -1) {
        white++;
        codeCopy.splice(index, 1);
      }
    }
    
    return { black, white };
  }

  static getGameElements() {
    return ['Santa', 'Present', 'Mistletoe', 'Star', 'Tree', 'Snowflake'];
  }

  static getDepthLayers() {
    return {
      BACKGROUND: 0,
      OVERLAY: 0.5,
      UI: 1,
      CURRENT_GUESS: 2,
      HISTORY: 3,
      TOUCH_AREA: 5,
      GAME_OVER: 10
    };
  }
}
