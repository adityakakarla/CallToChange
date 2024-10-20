"use server";

import { getUserInfo, checkIfUserExists, insertNewUser, updateAmountOffset, verifyTagOffset, checkIfTagExists } from "@/scripts/mongo";
import { currentUser } from "@clerk/nextjs/server";

export async function fetchUserInfo() {
    const user = await currentUser();
    const email =
        user && user.emailAddresses.length > 0
            ? user.emailAddresses[0].emailAddress
            : null;
    const exists = await checkIfUserExists(email);
    if (!exists) {
        return null;
    }
    const result = await getUserInfo(email);
    return result;
}

export async function addUser(tag: string){
    const user = await currentUser();
    const email =
        user && user.emailAddresses.length > 0
            ? user.emailAddresses[0].emailAddress
            : null;
    await insertNewUser(email, tag);
}

export async function updateOffset(amount: number) {  
    const user = await currentUser();
    const email =
        user && user.emailAddresses.length > 0
            ? user.emailAddresses[0].emailAddress
            : null;
    await updateAmountOffset(email, amount);
}

export async function verifyOffset(tag: string){
    const exists = await checkIfTagExists(tag);
    if (!exists) {
        return null;
    }
    const result = await verifyTagOffset(tag);
    return result
}