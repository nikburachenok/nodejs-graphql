import { GraphQLObjectType, GraphQLList } from 'graphql';
import { UserType } from './types/user.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { MemberType } from './types/memberType.js';
import { UUIDType } from './types/uuid.js';
import { MemberTypeIdGql } from './types/memberTypeId.js';
import { Context } from './types/context.js';

export const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve: async (_parent, _args, context: Context) => await context.prisma.user.findMany(),
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: async (_parent, _args, context: Context) => await context.prisma.post.findMany(),
        },
        profiles: {
            type: new GraphQLList(ProfileType),
            resolve: async (_parent, _args, context: Context) => await context.prisma.profile.findMany(),
        },
        memberTypes: {
            type: new GraphQLList(MemberType),
            resolve: async (_parent, _args, context: Context) => await context.prisma.memberType.findMany(),
        },
        user: {
            type: UserType,
            args: { id: { type: UUIDType } },
            resolve: async (_parent, { id }: { id: string }, context: Context) =>
                await context.prisma.user.findUnique({ where: { id } }),
        },
        post: {
            type: PostType,
            args: { id: { type: UUIDType } },
            resolve: async (_parent, { id }: { id: string }, context: Context) =>
                await context.prisma.post.findUnique({ where: { id } }),
        },
        profile: {
            type: ProfileType,
            args: { id: { type: UUIDType } },
            resolve: async (_parent, { id }: { id: string }, context: Context) =>
                await context.prisma.profile.findUnique({ where: { id } }),
        },
        memberType: {
            type: MemberType,
            args: {
                id: { type: MemberTypeIdGql },
            },
            resolve: async (_parent, { id }: { id: string }, context: Context) =>
                await context.prisma.memberType.findUnique({ where: { id } }),
        },
    },
});
