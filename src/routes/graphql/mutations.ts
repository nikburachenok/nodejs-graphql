import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UserType, CreateUserInput, ChangeUserInput } from './types/user.js';
import { PostType, CreatePostInput, ChangePostInput } from './types/post.js';
import { ProfileType, CreateProfileInput, ChangeProfileInput } from './types/profile.js'
import { UUIDType } from './types/uuid.js';
import { Context } from './types/context.js';

export const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        createPost: {
            type: PostType,
            args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            resolve: async (_parent, { dto }, context: Context) => await context.prisma.post.create({ data: dto }),
        },
        createUser: {
            type: UserType,
            args: { dto: { type: CreateUserInput } },
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            resolve: async (_parent, { dto }, context: Context) => await context.prisma.user.create({ data: dto }),
        },
        createProfile: {
            type: ProfileType,
            args: { dto: { type: CreateProfileInput } },
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            resolve: async (_parent, { dto }, context: Context) => await context.prisma.profile.create({ data: dto }),
        },
        deletePost: {
            type: UUIDType,
            args: { id: { type: UUIDType } },
            resolve: async (_parent, { id }: { id: string }, context: Context) => (await context.prisma.post.delete({ where: { id } })).id,
        },
        deleteUser: {
            type: UUIDType,
            args: { id: { type: UUIDType } },
            resolve: async (_parent, { id }: { id: string }, context: Context) => (await context.prisma.user.delete({ where: { id } })).id,
        },
        deleteProfile: {
            type: UUIDType,
            args: { id: { type: UUIDType } },
            resolve: async (_parent, { id }: { id: string }, context: Context) => (await context.prisma.profile.delete({ where: { id } })).id,
        },
        changePost: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(ChangePostInput) }
            },
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            resolve: async (_parent, { id, dto }, context: Context) => await context.prisma.post.update( {where: { id }, data: dto } ),
        },
        changeProfile: {
            type: ProfileType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(ChangeProfileInput) }
            },
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            resolve: async (_parent, { id, dto }, context: Context) => await context.prisma.profile.update( {where: { id }, data: dto } ),
        },
        changeUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(ChangeUserInput) }
            },
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            resolve: async (_parent, { id, dto }, context: Context) => await context.prisma.user.update( {where: { id }, data: dto } ),
        },
        subscribeTo: {
            type: UserType,
            args: {
                userId: { type: UUIDType },
                authorId: { type: UUIDType }
            },
            resolve: async (_parent, { userId, authorId }: { userId: string, authorId:string }, context: Context) => {
                await context.prisma.subscribersOnAuthors.create({ data: {subscriberId: userId, authorId} });
                return context.prisma.user.findUnique({ where: { id: userId } });
            },
        },
        unsubscribeFrom: {
            type: UUIDType,
            args: {
                userId: { type: UUIDType },
                authorId: { type: UUIDType }
            },
            resolve: async (_parent, { userId, authorId }: { userId: string, authorId:string }, context: Context) => {
                const result = await context.prisma.subscribersOnAuthors.delete({
                    where: {
                        subscriberId_authorId: { subscriberId: userId ,authorId },
                    },
                });

                return result.authorId;
            },
        }
    }),
});
