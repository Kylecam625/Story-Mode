# Story Mode

An interactive storytelling experience powered by AI, featuring dynamic voice narration and immersive decision-making.

## Features

- 🎭 **Dynamic Storytelling**: AI-generated narratives that adapt to your choices
- 🎙️ **Voice Narration**: Professional voice acting for all characters and narration
- 🎲 **Interactive Decisions**: Make choices that impact the story's direction
- ⚡ **Slot Machine Effect**: Engaging animations for random decision selection
- ⏱️ **Timed Decisions**: Add pressure and excitement to your choices
- 🎨 **Modern UI**: Clean, responsive interface with smooth animations
- 🔊 **Sound Controls**: Toggle typing sounds and adjust audio settings

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- OpenAI API key
- ElevenLabs API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kylecam625/Story-Mode.git
   cd Story-Mode
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.template` to `.env`
   - Add your API keys
   - Follow the voice setup instructions in the `.env.template` file

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Environment Setup

1. **OpenAI Configuration**
   - Sign up at [OpenAI](https://platform.openai.com)
   - Get your API key from the dashboard
   - Add it to your `.env` file

2. **ElevenLabs Configuration**
   - Sign up at [ElevenLabs](https://elevenlabs.io)
   - Get your API key from the Profile Settings
   - Follow the voice setup instructions in `.env.template`
   - Add each voice ID to your ElevenLabs account

## Features in Detail

### Voice System
- Professional voice acting for all characters
- Multiple voice options for both characters and narrators
- Real-time text-to-speech generation
- Voice preview system for selection

### Decision System
- Timed decision-making with visual countdown
- Slot machine effect for random choices
- Option to reconsider decisions
- Visual feedback for selection process

### UI/UX
- Clean, modern interface
- Responsive design
- Smooth animations and transitions
- Sound effects and audio feedback
- Accessibility considerations

## Contributing

Feel free to submit issues and enhancement requests! 