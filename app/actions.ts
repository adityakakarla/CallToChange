"use server";

import { getUserInfo } from "@/scripts/mongo";
import { currentUser } from "@clerk/nextjs/server";
import { XRP } from "xrpl"

export async function fetchUserInfo() {
    const user = await currentUser();
    const email =
        user && user.emailAddresses.length > 0
            ? user.emailAddresses[0].emailAddress
            : null;
    const result = await getUserInfo(email);
    return result;
}