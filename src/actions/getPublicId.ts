"use server"


export async function getPublicId(url: string) {
  try {
    const folder = process.env.CLOUDINARY_FOLDER_FOR_USERS_PROFILES!;
    const pathname = new URL(url).pathname;
    const marker = `/${folder}/`;

    const start = pathname.indexOf(marker);
    if (start === -1) {
      return null
    }

    return pathname
      .slice(start + 1) // remove leading '/'
      .replace(/\.[^.]+$/, "");
  } catch (error) {
    return null
  }
}