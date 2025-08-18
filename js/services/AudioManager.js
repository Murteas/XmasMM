// AudioManager.js - Handles Christmas sound effects for family-friendly gameplay

class AudioManager {
  constructor(scene) {
    this.scene = scene;
    this.sounds = {};
    this.isEnabled = true;
  }

  /**
   * Preload all Christmas sound effects
   * Call this in scene preload() method
   */
  preloadSounds() {
    // Preload Christmas sound effects
    // Note: Actual audio files will be added to assets/ directory
    
    // Functional feedback sounds
    this.scene.load.audio('jingleBells', ['assets/audio/jingle_bells.mp3', 'assets/audio/jingle_bells.ogg']);
    this.scene.load.audio('successChime', ['assets/audio/ho_ho_ho.mp3', 'assets/audio/ho_ho_ho.ogg']);
    this.scene.load.audio('santaChuckle', ['assets/audio/santa_chuckle.mp3', 'assets/audio/santa_chuckle.ogg']);
    this.scene.load.audio('elementSelect', ['assets/audio/soft_ding.mp3', 'assets/audio/soft_ding.ogg']);
  }

  /**
   * Initialize sound objects after preloading
   * Call this in scene create() method
   */
  initializeSounds() {
    try {
      // Create sound objects with family-friendly volume levels
      this.sounds.jingleBells = this.scene.sound.add('jingleBells', { volume: 0.3 });
      this.sounds.successChime = this.scene.sound.add('successChime', { volume: 0.4 });
      this.sounds.santaChuckle = this.scene.sound.add('santaChuckle', { volume: 0.3 });
      this.sounds.elementSelect = this.scene.sound.add('elementSelect', { volume: 0.2 });
    } catch (error) {
      console.warn('AudioManager: Could not initialize sounds', error);
      // Graceful fallback - game still playable without audio
    }

    // Check user preference for audio
    this.updateEnabledState();
  }

  /**
   * Update enabled state based on user preference
   */
  updateEnabledState() {
    this.isEnabled = this.scene.registry.get('sfxOn') !== false;
  }

  /**
   * Play sound effect with user preference check
   */
  playSound(soundKey, config = {}) {
    if (!this.isEnabled) return;
    
    const sound = this.sounds[soundKey];
    if (!sound) {
      console.warn(`AudioManager: Sound '${soundKey}' not found`);
      return;
    }

    try {
      // iOS Safari requires user interaction for audio
      if (this.scene.sound.context.state === 'suspended') {
        this.scene.sound.context.resume();
      }
      
      sound.play(config);
    } catch (error) {
      console.warn('AudioManager: Could not play sound', soundKey, error);
      // Graceful fallback - continue without audio
    }
  }

  /**
   * Convenient methods for specific game events
   */
  playGuessSubmission() {
    this.playSound('jingleBells');
  }

  playCorrectGuess() {
    this.playSound('successChime');
  }

  playGameWon() {
    // Play a slightly louder success sound for winning
    this.playSound('successChime', { volume: 0.5 });
  }

  playHintUsed() {
    this.playSound('santaChuckle');
  }

  playElementSelect() {
    this.playSound('elementSelect');
  }

  /**
   * Enable/disable audio based on user preference
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
    this.scene.registry.set('sfxOn', enabled);
  }

  /**
   * Check if audio is currently enabled
   */
  isAudioEnabled() {
    return this.isEnabled;
  }

  /**
   * Cleanup method for scene destruction
   */
  destroy() {
    // Stop all sounds
    Object.values(this.sounds).forEach(sound => {
      if (sound && sound.isPlaying) {
        sound.stop();
      }
    });
    this.sounds = {};
  }
}
