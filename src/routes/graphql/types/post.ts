import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInputObjectType
} from "graphql";
import { UUIDType } from "./uuid.js";

export const PostType: GraphQLObjectType = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
    }),
});

export const CreatePostInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: "CreatePostInput",
    fields: () => ({
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
    }),
});

export const ChangePostInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: "ChangePostInput",
    fields: () => ({
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        authorId: { type: UUIDType },
    }),
});