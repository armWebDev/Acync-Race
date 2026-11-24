import useRaceControls from '../../race/hooks/useRaceControls';

export default function RaceControls() {
  const { canRace, canReset, canGenerate, isGenerating, race, reset, generate } = useRaceControls();

  return (
    <div className="race-controls">
      <button type="button" className="button button--accent" onClick={race} disabled={!canRace}>
        Race
      </button>
      <button type="button" className="button" onClick={reset} disabled={!canReset}>
        Reset
      </button>
      <button type="button" className="button" onClick={generate} disabled={!canGenerate}>
        {isGenerating ? 'Generating…' : 'Generate cars'}
      </button>
    </div>
  );
}
