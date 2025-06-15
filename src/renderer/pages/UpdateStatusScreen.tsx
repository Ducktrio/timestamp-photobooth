import React from 'react';

type UpdateState =
  | 'checking'
  | 'downloading'
  | 'installing'
  | 'normal'
  | 'starting'
  | 'error';

interface UpdateStatusScreenProps {
  state: UpdateState;
  progress?: number; // 0–100 if available
}

export default function UpdateStatusScreen({
  state,
  progress,
}: UpdateStatusScreenProps) {
  const renderText = () => {
    switch (state) {
      case 'checking':
        return 'Checking for updates...';
      case 'downloading':
        return 'Downloading update...';
      case 'installing':
        return 'Installing update...';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800">
      <div className="text-3xl font-semibold mb-6">{renderText()}</div>

      {state === 'downloading' && (
        <div className="w-64 h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-blue-500 rounded transition-all"
            style={{ width: `${progress ?? 0}%` }}
          />
        </div>
      )}

      {state === 'installing' && (
        <div className="mt-4 text-sm text-gray-500">
          The app will restart shortly...
        </div>
      )}
    </div>
  );
}
