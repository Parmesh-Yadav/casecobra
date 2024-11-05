'use server'

import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
    //check for current user
    // const { getUser } = getKindeServerSession();
    // const user = await getUser();
    const user = await currentUser();
    if (!user?.id || !user?.emailAddresses[0].emailAddress) {
        throw new Error("You need to be logged in to view this page");
    }
    //get order
    const order = await db.order.findFirst({
        where: {
            id: orderId,
            userId: user?.id,
        },
        include: {
            billingAddress: true,
            shippingAddress: true,
            configuration: true,
            user: true,
        },
    });
    if (!order) {
        throw new Error("This order does not exist");
    }
    //is the order paid
    if (order.isPaid) {
        return order;
    } else {
        return false;
    }
}