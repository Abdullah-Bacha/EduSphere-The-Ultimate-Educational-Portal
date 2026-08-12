import dbConnect from "@/lib/dbConnect";
import WebsiteSetting from "@/models/WebsiteSetting";

const DEFAULT_SETTINGS = {};

function serialize(doc) {
    return JSON.parse(JSON.stringify(doc.toObject()));
}

export async function getWebsiteSettings() {
    await dbConnect();

    let settings = await WebsiteSetting.findOne();

    if (!settings) {
        settings = await WebsiteSetting.create(DEFAULT_SETTINGS);
    }

    return serialize(settings);
}

export async function updateWebsiteSettings(data) {
    await dbConnect();

    const settings = await WebsiteSetting.findOneAndUpdate(
        {},
        data,
        {
            new: true,
            upsert: true,
            runValidators: true,
        }
    );

    return serialize(settings);
}
