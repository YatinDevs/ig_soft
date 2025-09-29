class SpeechService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.selectedVoice = null;

    this.loadVoices();
  }

  loadVoices() {
    this.voices = this.synth.getVoices();
    this.selectedVoice = this.voices.find(
      (voice) => voice.name.includes("English") && voice.lang.includes("en")
    );
  }

  speak(text, options = {}) {
    if (!this.synth) {
      console.warn("Speech synthesis not supported");
      return;
    }

    this.synth.cancel(); // Cancel any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.selectedVoice;
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    this.synth.speak(utterance);

    return new Promise((resolve) => {
      utterance.onend = resolve;
    });
  }

  cancel() {
    this.synth.cancel();
  }
}

export const speechService = new SpeechService();
