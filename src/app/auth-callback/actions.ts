'use server'

import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { currentUser } from "@clerk/nextjs/server"

export const getAuthStatus = async () => {
    // const { getUser } = getKindeServerSession();
    // const user = await getUser();
    const user = await currentUser()
    if (!user?.id || !user?.emailAddresses?.[0]?.emailAddress)
        throw new Error('Invalid User Data');
    const existingUser = await db.user.findFirst({
        where: {
            id: user.id,
        },
    });
    if (!existingUser)
        await db.user.create({
            data: {
                id: user.id,
                email: user.emailAddresses[0].emailAddress,
            }
        });
    return {
        success: true
    }
}