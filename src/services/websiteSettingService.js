import dbConnect from "@/lib/dbConnect";
import WebsiteSetting from "@/models/WebsiteSetting";

const DEFAULT_SETTINGS = {};

export async function getWebsiteSettings() {
    await dbConnect();

    let settings = await WebsiteSetting.findOne().lean();

    if (!settings) {
        settings = await WebsiteSetting.create(DEFAULT_SETTINGS);
        settings = settings.toObject();
    }

    return {
        ...settings,
        _id: String(settings._id),
    };
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

    return settings.toObject();
}
