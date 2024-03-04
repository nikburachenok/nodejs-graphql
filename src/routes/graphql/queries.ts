import { GraphQLObjectType, GraphQLList } from 'graphql';
import { UserType } from './types/user.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { MemberType } from './types/memberType.js';
import { UUIDType } from './types/uuid.js';
import { MemberTypeIdGql } from './types/memberTypeId.js';
import { Context } from './types/context.js';
import {
    ResolveTree,
    parseResolveInfo,
    simplifyParsedResolveInfoFragmentWithType
} from 'graphql-parse-resolve-info';
import { User } from '@prisma/client';

export const Query = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        users: {
            type: new GraphQLList(UserType),
            resolve: async (_parent, _args, context: Context, info) => {
                const { fields } = simplifyParsedResolveInfoFragmentWithType(
                    parseResolveInfo(info) as ResolveTree,
                    new GraphQLList(UserType),
                );

                const users = await context.prisma.user.findMany({
                    include: {
                        userSubscribedTo: 'userSubscribedTo' in fields,
                        subscribedToUser: 'subscribedToUser' in fields,
                    },
                });

                if ('userSubscribedTo' in fields || 'subscribedToUser' in fields) {
                    const usersById = new Map<string, User>();
                    users.forEach((user) => usersById[user.id] = user);

                    users.forEach((user) => {
                        if ('subscribedToUser' in fields) {
                            context.dataLoader.subscribedToUserLoader.prime(
                                user.id,
                                user.subscribedToUser.map((sub) => usersById.get(sub.subscriberId) as User)
                            );
                        }
                        if ('userSubscribedTo' in fields) {
                            context.dataLoader.userSubscribedToLoader.prime(
                                user.id,
                                user.userSubscribedTo.map((sub) => usersById.get(sub.authorId) as User)
                            );
                        }
                    });
                }
                return users;
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: async (_parent, _args, context: Context) => await context.prisma.post.findMany()
        },
        profiles: {
            type: new GraphQLList(ProfileType),
            resolve: async (_parent, _args, context: Context) => await context.prisma.profile.findMany()
        },
        memberTypes: {
            type: new GraphQLList(MemberType),
            resolve: async (_parent, _args, context: Context) => await context.prisma.memberType.findMany()
        },
        user: {
            type: UserType,
            args: { id: { type: UUIDType } },
            resolve: async (_parent, { id }: { id: string }, context: Context) =>
                await context.prisma.user.findUnique({ where: { id } })
        },
        post: {
            type: PostType,
            args: { id: { type: UUIDType } },
            resolve: async (_parent, { id }: { id: string }, context: Context) =>
                await context.prisma.post.findUnique({ where: { id } })
        },
        profile: {
            type: ProfileType,
            args: { id: { type: UUIDType } },
            resolve: async (_parent, { id }: { id: string }, context: Context) =>
                await context.prisma.profile.findUnique({ where: { id } })
        },
        memberType: {
            type: MemberType,
            args: {
                id: { type: MemberTypeIdGql },
            },
            resolve: async (_parent, { id }: { id: string }, context: Context) =>
                await context.prisma.memberType.findUnique({ where: { id } })
        },
    }),
});
