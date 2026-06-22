const Section = ({ title, children }) => (
    <div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {children}
        </div>
    </div>
);

export default Section
