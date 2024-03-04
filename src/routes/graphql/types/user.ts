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
import { Context } from "./context.js";

export const UserType: GraphQLObjectType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: GraphQLFloat },
        profile: {
            type: ProfileType,
            resolve: async ({ id }: { id: string }, __, context: Context) =>
                await context.dataLoader.profileLoader.load(id)
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: async ({ id }: { id: string }, __, context: Context) =>
                await context.dataLoader.postsLoader.load(id),
        },
        userSubscribedTo: {
            type: new GraphQLList(UserType),
            resolve: async ({ id }: { id: string }, __, context: Context) =>
                await context.dataLoader.userSubscribedToLoader.load(id)
        },
        subscribedToUser: {
            type: new GraphQLList(UserType),
            resolve: async ({ id }: { id:string }, __, context: Context) =>
                await context.dataLoader.subscribedToUserLoader.load(id)
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