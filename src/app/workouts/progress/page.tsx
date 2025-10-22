'use client';
import { useEffect, useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function ProgressPage() {
  const supabase = createSupabaseBrowser();
  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('v_daily_volume')
      .select('*')
      .eq('user_id', user.id)
      .order('workout_date', { ascending: true })
      .limit(60);

    if (error) console.error(error);
    else {
      setLabels((data ?? []).map((d) => d.workout_date));
      setValues((data ?? []).map((d) => Number(d.total_volume || 0)));
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total Volume (kg)',
        data: values,
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Progress</h1>
      {loading ? (
        <p>Loading chart...</p>
      ) : labels.length ? (
        <Line data={chartData} />
      ) : (
        <p>No workout data yet — log a workout first!</p>
      )}
    </div>
  );
}
