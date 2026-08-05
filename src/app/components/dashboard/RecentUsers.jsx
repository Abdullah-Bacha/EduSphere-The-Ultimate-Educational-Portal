import Badge from "@/app/components/ui/Badge";

export default function RecentUsers({ users }) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold tracking-[-0.01em] text-slate-900">Recent Users</h2>
                    <p className="mt-1 text-sm text-slate-500">Fresh member activity and account growth.</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="ds-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="font-medium text-slate-800">{user.name}</td>
                                <td className="text-slate-600">{user.email}</td>
                                <td><Badge tone="emerald" className="capitalize">{user.role}</Badge></td>
                                <td className="text-slate-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}