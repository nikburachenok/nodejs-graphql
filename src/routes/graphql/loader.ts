import { PrismaClient } from "@prisma/client";
import { Static } from "@sinclair/typebox";
import DataLoader from "dataloader";
import { profileSchema } from "../profiles/schemas.js";
import { postSchema } from "../posts/schemas.js";

export function getLoaders(prisma: PrismaClient) {
    return {
        profileLoader: new DataLoader(async (userIds: readonly string[]) => {
            const profilesMap = new Map<string, Static<typeof profileSchema>>();
            const profiles = await prisma.profile.findMany({
                where: { userId: { in: [...userIds] } },
            });

            profiles.forEach((profile) => profilesMap.set(profile.userId, profile));

            return userIds.map((id) => profilesMap.get(id));
        }),
        postsLoader: new DataLoader(async (userIds: readonly string[]) => {
            const posts = await prisma.post.findMany({
                where: { authorId: { in: [...userIds] } }
            });

            const postMap: Record<string, Static<typeof postSchema>[]> = {};
            posts.forEach((p) => {
                postMap[p.authorId]
                    ? postMap[p.authorId].push(p)
                    : (postMap[p.authorId] = [p])
            });
            return userIds.map((key) => postMap[key] ?? null);
        }),
        memberTypeLoader: new DataLoader(async (memberTypeIds: readonly string[]) => {
            const members = await prisma.memberType.findMany({
                where: { id: { in: [...memberTypeIds] } }
            });
            const idMemberMap = memberTypeIds.map((id) =>
                members.find((memberType) => memberType.id === id),
            );

            return idMemberMap;
        }),
        userSubscribedToLoader: new DataLoader(async (userIds: readonly string[]) => {
            const usersWithAuthors = await prisma.user.findMany({
                where: { id: { in: Array.from(userIds) } },
                include: { userSubscribedTo: { select: { author: true } } },
            });
            const subscribedAuthorsMap = new Map<string, { id: string; name: string }[]>();

            usersWithAuthors.forEach((user) => {
                const subscribedAuthors = user.userSubscribedTo.map(
                    (subscription) => subscription.author,
                );
                subscribedAuthorsMap.set(user.id, subscribedAuthors);
            });
            return userIds.map((id) => subscribedAuthorsMap.get(id));
        }),
        subscribedToUserLoader: new DataLoader(async (userIds: readonly string[]) => {
            const usersWithSubs = await prisma.user.findMany({
                where: { id: { in: Array.from(userIds) } },
                include: { subscribedToUser: { select: { subscriber: true } } },
            });
            const subscribersMap = new Map<string, { id: string; name: string }[]>();

            usersWithSubs.forEach((user) => {
                if (!subscribersMap.has(user.id)) {
                    subscribersMap.set(user.id, []);
                }

                subscribersMap
                    .get(user.id)
                    ?.push(...user.subscribedToUser.map((sub) => sub.subscriber));
            });

            return userIds.map((id) => subscribersMap.get(id));
        }),
    }
}