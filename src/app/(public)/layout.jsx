import PublicNavbar from "../components/layout/PublicNavbar";
import { getWebsiteSettings } from "@/services/websiteSettingService";

export default async function PublicLayout({ children }) {
    const settings = await getWebsiteSettings();

    return (
        <>
            <PublicNavbar siteName={settings.siteName} siteTagline={settings.siteTagline} siteLogo={settings.siteLogo} />
            {children}

        </>
    );
}
