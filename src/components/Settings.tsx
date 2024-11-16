import { useState } from "react";
import { Habit } from "./Habit";
import { QRCodeCanvas as QRCode } from "qrcode.react";
import copy from "copy-to-clipboard";

export type TimerSetting = {
  name: string;
  value: number;
  recommended: number[];
};

type SettingsProps = {
  timerSettings: TimerSetting[];
  updateSetting: (index: number, newValue: number) => void;
  habits: Habit[]
};

const Settings = ({ timerSettings, updateSetting, habits }: SettingsProps) => {
  const [buttonText, setButtonText] = useState('Generate Transmission URL');
  const [buttonStyle, setButtonStyle] = useState('bg-orange-500 hover:bg-orange-600 active:bg-orange-500');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const renderSetting = (setting: TimerSetting, index: number) => (
    <div key={index} className="flex flex-col mb-4">
      <label className="mb-2 text-lg font-bold">{setting.name} Timer Length (minutes)</label>
      <input
        type="number"
        value={setting.value}
        onChange={(e) => updateSetting(index, parseInt(e.target.value) || 0)}
        className="px-4 py-2 mb-2 border rounded"
      />
      <div className="flex gap-2">
        {setting.recommended.map((rec, recIndex) => (
          <button
            key={recIndex}
            onClick={() => updateSetting(index, rec)}
            className="px-4 py-2 text-gray-800 bg-gray-200 rounded"
          >
            {rec} min
          </button>
        ))}
      </div>
    </div>
  );

  const generateTransmissionUrl = () => {
    const transmissionData = {
      habits,
      timerSettings,
      safetySlug: generateRandomAlphanumeric(16),
    };
    const encodedState = encodeURIComponent(JSON.stringify(transmissionData));
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const urlWithQuery = `${baseUrl}?transmissionData=${encodedState}`;

    // Copy URL to clipboard
    const copiedSuccessfully = copy(urlWithQuery);

    if (copiedSuccessfully) {
      setButtonText("Copied Transmission URL To Clipboard!");
      setButtonStyle("bg-green-500 hover:bg-green-600 active:bg-green-500 animate-pulse");
      setQrCodeUrl(urlWithQuery);

      setTimeout(() => {
        setButtonText("Generate Transmission URL");
        setButtonStyle("bg-orange-500 hover:bg-orange-600 active:bg-orange-500");
      }, 3000);
    } else {
      console.error("Failed to copy URL to clipboard");
    }
  };


  const generateRandomAlphanumeric = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return result;
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold">Settings</h2>
      {timerSettings.map(renderSetting)}
      <button
        onClick={generateTransmissionUrl}
        className={`px-4 py-2 text-white duration-75 rounded ${buttonStyle}`}
      >
        {buttonText}
      </button>
      {qrCodeUrl && (
        <div className="mt-4">
          <QRCode value={qrCodeUrl} size={200} />
          <p className="mt-2 text-sm text-gray-600">Scan to load data on another device</p>
        </div>
      )}
    </div>
  );
};

export default Settings;
