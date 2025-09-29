import { useState, useEffect } from "react";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

const pollyClient = new PollyClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

export const useSpeech = (enabled = true) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

  const cancel = () => {
    if (currentAudio) {
      currentAudio.pause();
      setIsSpeaking(false);
      setCurrentAudio(null);
    }
  };

  const speak = async (text, options = {}) => {
    if (!enabled) return;

    try {
      // Cancel any ongoing speech
      cancel();

      setIsSpeaking(true);
      const response = await pollyClient.send(
        new SynthesizeSpeechCommand({
          Text: text,
          OutputFormat: "mp3",
          VoiceId: "Kajal",
          Engine: "neural",
          ...options,
        })
      );

      const audioBlob = new Blob(
        [await response.AudioStream.transformToByteArray()],
        {
          type: "audio/mpeg",
        }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.playbackRate = options.rate || 1;

      audio.onended = () => {
        setIsSpeaking(false);
        setCurrentAudio(null);
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        setCurrentAudio(null);
      };

      setCurrentAudio(audio);
      await audio.play();
    } catch (error) {
      console.error("AWS Polly Error:", error);
      setIsSpeaking(false);
      setCurrentAudio(null);
    }
  };

  return { speak, cancel, isSpeaking };
};
