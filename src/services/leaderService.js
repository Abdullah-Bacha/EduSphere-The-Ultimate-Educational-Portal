import dbConnect from "@/lib/dbConnect";
import Leader from "@/models/Leader";

const DEFAULT_LEADERS = [
    {
        name: "Dr. Robert Mitchell",
        title: "Chairman",
        image: "/images/leaders/dr-robert-mitchell.png",
        quote: "Education is the foundation of meaningful change. Keep learning, keep growing, and never stop believing in your potential.",
        order: 1,
    },
    {
        name: "Dr. Priya Sharma",
        title: "Vice President",
        image: "/images/leaders/dr-priya-sharma.png",
        quote: "Our goal is to make world-class education accessible to every student, no matter where they start from.",
        order: 2,
    },
    {
        name: "Prof. James Anderson",
        title: "University Leadership",
        image: "/images/leaders/prof-james-anderson.png",
        quote: "True leadership in education means empowering students to think critically and lead with confidence.",
        order: 3,
    },
    {
        name: "Dr. Maria Santos",
        title: "Academic Leadership",
        image: "/images/leaders/dr-maria-santos.png",
        quote: "Every learner has untapped potential — our job is to build the path that helps them reach it.",
        order: 4,
    },
];

function serialize(doc) {
    return { ...doc, _id: String(doc._id) };
}

export async function getLeaders() {
    await dbConnect();

    const count = await Leader.countDocuments();
    if (count === 0) {
        await Leader.insertMany(DEFAULT_LEADERS);
    }

    const leaders = await Leader.find().sort({ order: 1, createdAt: 1 }).lean();
    return leaders.map(serialize);
}

export async function createLeader(data) {
    await dbConnect();
    const leader = await Leader.create(data);
    return serialize(leader.toObject());
}

export async function updateLeader(id, data) {
    await dbConnect();
    const leader = await Leader.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    return leader ? serialize(leader) : null;
}

export async function deleteLeader(id) {
    await dbConnect();
    await Leader.findByIdAndDelete(id);
}
