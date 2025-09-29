import AWS from "aws-sdk";

class PollyService {
  constructor() {
    // this.polly = new AWS.Polly({
    //   region: meta.env.REACT_APP_AWS_REGION,
    //   accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    //   secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    // });
  }

  async speak(text, options = {}) {
    try {
      const params = {
        OutputFormat: "mp3",
        Text: text,
        VoiceId: options.voiceId || "Joanna",
        Engine: "neural",
        SampleRate: "24000",
      };

      const data = await this.polly.synthesizeSpeech(params).promise();
      const audioBlob = new Blob([data.AudioStream], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audio.playbackRate = options.rate || 1;
      audio.volume = options.volume || 1;

      await audio.play();

      return new Promise((resolve) => {
        audio.onended = resolve;
      });
    } catch (error) {
      console.error("Polly error:", error);
      throw error;
    }
  }
}

export const pollyService = new PollyService();
