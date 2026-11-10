type RecognitionResultEvent = {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      0?: { transcript: string };
    };
  };
};

type BrowserSpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: RecognitionResultEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionCtor = new () => BrowserSpeechRecognition;

const FLUSH_TIMEOUT_MS = 750;

export function canUseSpeechRecognition(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const win = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return Boolean(win.SpeechRecognition ?? win.webkitSpeechRecognition);
}

export type SpeechRecognitionSession = {
  getTranscript: () => string;
  flushAndStop: () => Promise<string>;
  stop: () => void;
};

export type CreateSpeechRecognitionSessionOptions = {
  onTranscriptUpdate?: (transcript: string) => void;
};

export function createSpeechRecognitionSession(
  options?: CreateSpeechRecognitionSessionOptions,
): SpeechRecognitionSession | null {
  if (!canUseSpeechRecognition()) {
    return null;
  }
  const win = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  const Ctor = win.SpeechRecognition ?? win.webkitSpeechRecognition;
  if (!Ctor) {
    return null;
  }

  const recognition = new Ctor();
  const finalParts: string[] = [];
  let latestInterim = "";

  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  const buildTranscript = (): string => {
    const finals = finalParts.join(" ").trim();
    if (!latestInterim) {
      return finals;
    }
    if (!finals) {
      return latestInterim.trim();
    }
    return `${finals} ${latestInterim}`.trim();
  };

  recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i];
      const transcript = result?.[0]?.transcript?.trim() ?? "";
      if (!transcript) {
        continue;
      }
      if (result.isFinal) {
        finalParts.push(transcript);
        latestInterim = "";
      } else {
        latestInterim = transcript;
      }
    }
    options?.onTranscriptUpdate?.(buildTranscript());
  };

  recognition.start();

  return {
    getTranscript: buildTranscript,
    flushAndStop: () =>
      new Promise<string>((resolve) => {
        let settled = false;

        const finish = () => {
          if (settled) {
            return;
          }
          settled = true;
          resolve(buildTranscript());
        };

        const previousOnEnd = recognition.onend;
        recognition.onend = () => {
          previousOnEnd?.();
          finish();
        };

        window.setTimeout(finish, FLUSH_TIMEOUT_MS);

        try {
          recognition.stop();
        } catch {
          try {
            recognition.abort();
          } catch {
            finish();
          }
        }
      }),
    stop: () => {
      try {
        recognition.stop();
      } catch {
        try {
          recognition.abort();
        } catch {
          /* ignore */
        }
      }
    },
  };
}
