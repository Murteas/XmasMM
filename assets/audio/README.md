# Christmas Audio Assets

## Required Sound Effects (Family-Friendly)

### 1. jingle_bells.mp3/ogg
- **Purpose**: Guess submission feedback
- **Duration**: 0.5-1 seconds
- **Volume**: Gentle, not startling
- **Description**: Soft jingle bell sound for tactile feedback when submitting guesses

### 2. ho_ho_ho.mp3/ogg  
- **Purpose**: Correct guess/game won celebration
- **Duration**: 1-2 seconds
- **Volume**: Cheerful but not loud
- **Description**: Classic Santa "Ho ho ho" or gentle success chime

### 3. santa_chuckle.mp3/ogg
- **Purpose**: Hint usage feedback
- **Duration**: 0.5-1 seconds  
- **Volume**: Gentle, friendly
- **Description**: Warm Santa chuckle when player uses hint

### 4. soft_ding.mp3/ogg
- **Purpose**: Element selection feedback (optional)
- **Duration**: 0.2-0.5 seconds
- **Volume**: Very soft
- **Description**: Subtle ding when selecting Christmas elements

## Technical Requirements

- **File Size**: <100KB per file (total <500KB)
- **Format**: MP3 primary, OGG fallback for browser compatibility
- **Sample Rate**: 44.1kHz recommended
- **Bit Rate**: 128kbps for good quality/size balance
- **iOS Safari**: Must work with user interaction requirement

## Audio Sources

### Free Options:
- Freesound.org (CC licensed)
- Zapsplat.com (free with account)
- Adobe Audition sound effects library
- YouTube Audio Library

### Custom Generation:
- Use AI audio generation tools
- Record custom sounds with family-friendly approach

## Implementation Status

- [ ] jingle_bells audio files
- [ ] ho_ho_ho audio files  
- [ ] santa_chuckle audio files
- [ ] soft_ding audio files
- [x] AudioManager service created
- [ ] Integration with game scenes
- [ ] Audio toggle functionality
- [ ] iOS Safari testing

## Notes

- Background music intentionally excluded for family/quiet environment compatibility
- All sounds designed to enhance, not distract from gameplay
- Graceful fallback when audio unavailable or disabled
