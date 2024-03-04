import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLInputObjectType
} from "graphql";
import { UUIDType } from "./uuid.js";
import { MemberType } from "./memberType.js";
import { MemberTypeIdGql } from "./memberTypeId.js";
import { Context } from "./context.js";

export const ProfileType: GraphQLObjectType = new GraphQLObjectType({
    name: "Profile",
    fields: {
        id: { type: new GraphQLNonNull(UUIDType) },
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
        userId: { type: new GraphQLNonNull(UUIDType) },
        memberTypeId: { type: new GraphQLNonNull(MemberTypeIdGql) },
        memberType: {
            type: MemberType,
            resolve: async ({ memberTypeId }: { memberTypeId: string }, __, context: Context) => await context.prisma.memberType.findUnique({where: {id: memberTypeId}})
        }
    },
});

export const CreateProfileInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: "CreateProfileInput",
    fields: () => ({
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
        userId: { type: new GraphQLNonNull(UUIDType) },
        memberTypeId: { type: new GraphQLNonNull(MemberTypeIdGql) },
    }),
});

export const ChangeProfileInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: "ChangeProfileInput",
    fields: () => ({
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        memberTypeId: { type: MemberTypeIdGql },
    }),
});