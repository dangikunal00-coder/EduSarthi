import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../services/api";

import StatCard from "../components/StatCard";
import StudentTable from "../components/StudentTable";
import StudentModal from "../components/StudentModal";
import Charts from "../components/Charts";

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard`);
        const data = await response.json();

        setDashboard(data);
        setStudents(data.students || []);
      } catch (err) {
        console.error("Teacher dashboard loading failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="mt-20 text-center text-gray-400">Loading teacher dashboard...</div>;
  }

  const stats = dashboard?.stats;

  return (
    <div className="p-6 space-y-6">
      {stats && (
        <div className="grid md:grid-cols-5 gap-4">
          <StatCard title="Total Students" value={stats.total_students} />
          <StatCard title="At Risk Students" value={stats.at_risk} />
          <StatCard title="Average Score" value={`${stats.average_score}%`} />
          <StatCard title="Accuracy" value={`${stats.accuracy}%`} />
          <StatCard title="Quiz Time" value={`${stats.time_spent_minutes}m`} />
        </div>
      )}

      {dashboard && <Charts data={dashboard} />}

      <StudentTable students={students} onSelect={setSelected} />

      {selected && (
        <StudentModal student={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default TeacherDashboard;
