import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Charts = ({ data }) => {
  const quizScores = data.quiz_scores || [];
  const topicPerformance = data.topic_performance || [];
  const timeSpent = data.time_spent || [];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="bg-[#1E293B] p-4 rounded-xl">
        <h3 className="mb-2">Quiz Scores</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={quizScores}>
            <XAxis dataKey="quiz" />
            <YAxis />
            <Tooltip />
            <Line dataKey="percentage" stroke="#4F46E5" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#1E293B] p-4 rounded-xl">
        <h3 className="mb-2">Topic Performance</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={topicPerformance}>
            <XAxis dataKey="topic" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#22C55E" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#1E293B] p-4 rounded-xl">
        <h3 className="mb-2">Time Spent</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={timeSpent}>
            <XAxis dataKey="topic" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="minutes" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
