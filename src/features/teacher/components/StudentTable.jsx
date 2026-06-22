const StudentTable = ({ students, onSelect }) => {
  return (
    <div className="bg-[#1E293B] p-4 rounded-xl overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Course</th>
            <th className="p-2">Semester</th>
            <th className="p-2">Avg</th>
            <th className="p-2">Weak Topics</th>
            <th className="p-2">Quizzes</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr
              key={student.id}
              className="border-t border-gray-700 cursor-pointer hover:bg-[#334155]"
              onClick={() => onSelect(student)}
            >
              <td className="p-2">{student.name || "Student"}</td>
              <td className="p-2">{student.email || "-"}</td>
              <td className="p-2">{student.course || "-"}</td>
              <td className="p-2">{student.semester || "-"}</td>
              <td className="p-2">{student.average_score}%</td>
              <td className="p-2">
                {student.weak_topics?.length
                  ? student.weak_topics.map((topic) => topic.topic).join(", ")
                  : "-"}
              </td>
              <td className="p-2">{student.total_quizzes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {!students.length && (
        <p className="text-gray-400 text-center py-6">No student data available</p>
      )}
    </div>
  );
};

export default StudentTable;
