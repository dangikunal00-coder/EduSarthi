import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";

const Performance = ({ data }) => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-semibold">My Performance</h2>
                    <p className="text-gray-500 text-sm">
                        Track your learning progress and improve every day.
                    </p>
                </div>

                <div className="bg-white px-4 py-2 rounded-lg shadow text-sm">
                    {data?.dateRange}
                </div>
            </div>

            {/* TOP CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {data?.stats?.map((item, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl shadow">
                        <div className={`w-10 h-10 rounded-full mb-2 ${item.color}`}></div>
                        <p className="text-gray-500 text-sm">{item.title}</p>
                        <h2 className="text-xl font-semibold">{item.value}</h2>
                        <p className="text-xs text-green-500">{item.sub}</p>
                    </div>
                ))}
            </div>

            {/* GRAPH + TOPICS */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">

                {/* LINE CHART */}
                <div className="bg-white p-4 rounded-xl shadow">
                    <h3 className="mb-4 font-semibold">Progress Over Time</h3>

                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={data?.progress}>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* TOPIC BARS */}
                <div className="bg-white p-4 rounded-xl shadow">
                    <h3 className="mb-4 font-semibold">Topic-wise Performance</h3>

                    {data?.topics?.map((t, i) => (
                        <div key={i} className="mb-3">
                            <div className="flex justify-between text-sm">
                                <span>{t.name}</span>
                                <span>{t.value}%</span>
                            </div>

                            <div className="w-full bg-gray-200 h-2 rounded">
                                <div className={`h-2 rounded ${t.color}`} style={{ width: t.value + "%" }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* LOWER SECTION */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">

                {/* WEAK AREAS */}
                <div className="bg-white p-4 rounded-xl shadow">
                    <h3 className="mb-3 font-semibold">Weak Areas</h3>

                    {data?.weakAreas?.map((w, i) => (
                        <div key={i} className="flex justify-between mb-2 text-sm">
                            <span>{w.name}</span>
                            <span className="text-red-500">{w.score}%</span>
                        </div>
                    ))}

                    <button className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg">
                        Practice Now
                    </button>
                </div>

                {/* STRONG AREAS */}
                <div className="bg-white p-4 rounded-xl shadow">
                    <h3 className="mb-3 font-semibold">Strong Areas</h3>

                    {data?.strongAreas?.length ? data.strongAreas.map((s, i) => (
                        <div key={i} className="flex justify-between mb-2 text-sm">
                            <span>{s.name}</span>
                            <span className="text-green-500">{s.score}%</span>
                        </div>
                    )) : (
                        <p className="text-sm text-gray-500">Attempt more quizzes to discover strong topics.</p>
                    )}
                </div>

                {/* PIE CHART */}
                <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
                    <h3 className="mb-3 font-semibold">Time Spent by Topic</h3>

                    <PieChart width={200} height={200}>
                        <Pie data={data?.timeSpent} dataKey="value" outerRadius={80}>
                            {data?.timeSpent?.map((_, i) => (
                                <Cell key={i} fill={data?.timeSpent[i].color} />
                            ))}
                        </Pie>
                    </PieChart>

                    <p className="text-sm mt-2">{data?.totalTime}</p>
                </div>

                {/* RECENT ACTIVITY */}
                <div className="bg-white p-4 rounded-xl shadow">
                    <h3 className="mb-3 font-semibold">Recent Quiz Activity</h3>

                    {data?.recent?.map((r, i) => (
                        <div key={i} className="flex justify-between text-sm mb-2">
                            <span>{r.title}</span>
                            <span className="text-indigo-500">{r.score}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI INSIGHT */}
            <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="font-semibold mb-2">AI Study Insight</h3>
                <p className="text-sm text-gray-500">{data?.insight}</p>
            </div>

            {/* FOOTER */}
            <div className="mt-6 bg-purple-100 p-4 rounded-xl text-center text-sm text-purple-700">
                {data?.quote}
            </div>

        </div>
    );
}

export default Performance;
