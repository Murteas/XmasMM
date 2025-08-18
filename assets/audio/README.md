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

### 3. tada.mp3/ogg
- **Purpose**: Hint usage feedback
- **Duration**: 0.5-1 seconds  
- **Volume**: Gentle, celebratory
- **Description**: Pleasant "tada" sound when player uses hint (replaces Santa chuckle for broader appeal)

### 4. ~~Element Selection Sound~~ (Removed)
- **Decision**: Removed for quieter family-friendly experience
- **Reasoning**: Element selection happens frequently and could become repetitive/annoying

## Technical Requirements

- **File Size**: <100KB per file (total <300KB for 3 files)
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

### Search Terms:
- `jingle bells short` - for guess submission
- `santa ho ho ho` OR `success chime` - for celebration  
- `tada celebration` OR `achievement sound` - for hints

## Implementation Status

- [ ] jingle_bells audio files
- [ ] ho_ho_ho audio files  
- [ ] tada audio files
- [x] AudioManager service created
- [x] Integration with game scenes
- [x] Audio toggle functionality
- [ ] iOS Safari testing

## Notes

- Background music intentionally excluded for family/quiet environment compatibility
- Element selection sound removed to reduce audio frequency/repetition
- Only 3 essential sounds needed for complete experience
- All sounds designed to enhance, not distract from gameplay
- Graceful fallback when audio unavailable or disabled
