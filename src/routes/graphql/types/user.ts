import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLFloat,
    GraphQLList,
    GraphQLInputObjectType
} from "graphql";
import { ProfileType } from "./profile.js";
import { UUIDType } from "./uuid.js";
import { PostType } from "./post.js";
import { prisma } from "../index.js";

export const UserType: GraphQLObjectType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: GraphQLFloat },
        profile: {
            type: ProfileType,
            resolve: async ({ id }: { id: string }) => await prisma.profile.findUnique({ where: { userId: id } }),
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: async ({ id }: { id: string }) => await prisma.post.findMany({ where: { authorId: id } }),
        },
        userSubscribedTo: {
            type: new GraphQLList(UserType),
            resolve: async ({ id }: { id: string }) => {
                const usersId = await prisma.subscribersOnAuthors.findMany({ where: { subscriberId: id } });
                return usersId.map(async ({ authorId: id }) => await prisma.user.findUnique({ where: { id } }));
            }
        },
        subscribedToUser: {
            type: new GraphQLList(UserType),
            resolve: async ({ id }: { id:string }) => {
                const usersId = await prisma.subscribersOnAuthors.findMany({ where: { authorId: id } });
                return usersId.map(async ({ subscriberId: id }) => await prisma.user.findUnique({ where: { id } }));
            }
        }
    })
});

export const CreateUserInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: "CreateUserInput",
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
    })
});

export const ChangeUserInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: "ChangeUserInput",
    fields: () => ({
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
    })
});