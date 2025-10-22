import { createSupabaseServer } from '@/lib/supabase/server';
import { format } from 'date-fns';
import ClientSummaryButton from './ClientSummaryButton'; // we'll add this later

export default async function Dashboard() {
  const supabase = await createSupabaseServer();

  // get the logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  // get latest 7 days of workout volume
  const { data: rows } = await supabase
    .from('v_daily_volume')
    .select('*')
    .eq('user_id', user?.id)
    .order('workout_date', { ascending: false })
    .limit(7);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        Welcome{user?.email ? `, ${user.email}` : ''} 👋
      </h1>

      <div className="border rounded-xl p-4">
        <h2 className="font-semibold mb-2">Last 7 Days — Total Volume</h2>
        <ul className="list-disc ml-5">
          {(rows ?? []).map((r) => (
            <li key={r.workout_date}>
              {format(new Date(r.workout_date), 'MMM d')}: {r.total_volume ?? 0}
            </li>
          ))}
        </ul>
      </div>

      <ClientSummaryButton />
    </div>
  );
}
