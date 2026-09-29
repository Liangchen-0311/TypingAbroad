import Cloudbase from "@cloudbase/js-sdk";

const envId = process.env.NEXT_PUBLIC_CLOUDBASE_ENV_ID ?? "";
const region = process.env.NEXT_PUBLIC_CLOUDBASE_REGION ?? "ap-shanghai";
const accessKey = process.env.NEXT_PUBLIC_CLOUDBASE_ACCESS_KEY ?? "";

let cloudbaseApp: ReturnType<typeof Cloudbase.init> | null = null;

export function cloudbaseAuthIsConfigured() {
  return Boolean(envId && accessKey);
}

export function getCloudbaseApp() {
  if (!cloudbaseAuthIsConfigured()) {
    throw new Error("CLOUDBASE_AUTH_NOT_CONFIGURED");
  }

  if (!cloudbaseApp) {
    cloudbaseApp = Cloudbase.init({
      env: envId,
      region,
      accessKey,
      persistence: "local",
    });
  }

  return cloudbaseApp;
}

export async function getCloudbaseAuthHeaders(): Promise<Record<string, string>> {
  if (!cloudbaseAuthIsConfigured()) return {};

  const { data, error } = await getCloudbaseApp().auth.getSession();
  const accessToken = data.session?.access_token;
  if (error || !accessToken) return {};

  return { Authorization: `Bearer ${accessToken}` };
}
