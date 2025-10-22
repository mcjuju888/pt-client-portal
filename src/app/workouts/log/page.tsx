'use client';

import { useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';

type Entry = {
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
};

export default function LogWorkoutPage() {
  const supabase = createSupabaseBrowser();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [entries, setEntries] = useState<Entry[]>([
    { exercise_name: 'Bench Press', sets: 3, reps: 8, weight: 60 },
  ]);
  const [saving, setSaving] = useState(false);

  function addRow() {
    setEntries((prev) => [
      ...prev,
      { exercise_name: '', sets: 3, reps: 10, weight: 0 },
    ]);
  }

  async function saveWorkout() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in!');
      setSaving(false);
      return;
    }

    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert({ user_id: user.id, workout_date: date, notes })
      .select()
      .single();

    if (workoutError) {
      alert(workoutError.message);
      setSaving(false);
      return;
    }

    const validEntries = entries
      .filter((e) => e.exercise_name && e.sets > 0 && e.reps > 0)
      .map((e) => ({ workout_id: workout.id, ...e }));

    const { error: entryError } = await supabase
      .from('workout_entries')
      .insert(validEntries);

    if (entryError) alert(entryError.message);
    else alert('Workout saved ✅');

    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Log Workout</h1>

      <div className="grid gap-3">
        <input
          type="date"
          className="border rounded-xl p-3"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <textarea
          className="border rounded-xl p-3"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="space-y-2">
          {entries.map((entry, i) => (
            <div className="grid grid-cols-4 gap-2" key={i}>
              <input
                className="border rounded-xl p-2"
                placeholder="Exercise"
                value={entry.exercise_name}
                onChange={(e) =>
                  setEntries((prev) =>
                    prev.map((r, idx) =>
                      idx === i ? { ...r, exercise_name: e.target.value } : r
                    )
                  )
                }
              />
              <input
                className="border rounded-xl p-2"
                type="number"
                placeholder="Sets"
                value={entry.sets}
                onChange={(e) =>
                  setEntries((prev) =>
                    prev.map((r, idx) =>
                      idx === i ? { ...r, sets: +e.target.value } : r
                    )
                  )
                }
              />
              <input
                className="border rounded-xl p-2"
                type="number"
                placeholder="Reps"
                value={entry.reps}
                onChange={(e) =>
                  setEntries((prev) =>
                    prev.map((r, idx) =>
                      idx === i ? { ...r, reps: +e.target.value } : r
                    )
                  )
                }
              />
              <input
                className="border rounded-xl p-2"
                type="number"
                placeholder="Weight (kg)"
                value={entry.weight}
                onChange={(e) =>
                  setEntries((prev) =>
                    prev.map((r, idx) =>
                      idx === i ? { ...r, weight: +e.target.value } : r
                    )
                  )
                }
              />
            </div>
          ))}
          <button
            className="border rounded-xl px-3 py-2"
            onClick={addRow}
          >
            + Add exercise
          </button>
        </div>

        <button
          disabled={saving}
          onClick={saveWorkout}
          className="border rounded-xl p-3"
        >
          {saving ? 'Saving…' : 'Save workout'}
        </button>
      </div>
    </div>
  );
}
