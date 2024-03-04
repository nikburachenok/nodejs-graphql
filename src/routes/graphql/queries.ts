import { GraphQLObjectType, GraphQLList } from 'graphql';
import { UserType } from './types/user.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { MemberType } from './types/memberType.js';
import { UUIDType } from './types/uuid.js';
import { MemberTypeIdGql } from './types/memberTypeId.js';
import { prisma } from './index.js';
import { UUID } from 'node:crypto';

export const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve: async () => await prisma.user.findMany(),
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: async () => await prisma.post.findMany(),
        },
        profiles: {
            type: new GraphQLList(ProfileType),
            resolve: async () => await prisma.profile.findMany(),
        },
        memberTypes: {
            type: new GraphQLList(MemberType),
            resolve: async () => await prisma.memberType.findMany(),
        },
        user: {
            type: UserType,
            args: { id: { type: UUIDType } },
            resolve: async (_parent, { id }: { id: string } ) =>
                await prisma.user.findUnique({ where: { id } }),
        },
        post: {
            type: PostType,
            args: { id: { type: UUIDType } },
            resolve: async (_parent, { id }: { id: string }) =>
                await prisma.post.findUnique({ where: { id } }),
        },
        profile: {
            type: ProfileType,
            args: { id: { type: UUIDType } },
            resolve: async (_parent, { id }: { id: string } ) =>
                await prisma.profile.findUnique({ where: { id } }),
        },
        memberType: {
            type: MemberType,
            args: {
                id: { type: MemberTypeIdGql },
            },
            resolve: async (_parent, { id }: { id: string }) =>
                await prisma.memberType.findUnique({ where: { id } }),
        },
    },
});
