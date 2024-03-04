import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { Query } from './queries.js';
import { Mutation } from './mutations.js';
import {
  graphql,
  GraphQLSchema,
  parse,
  validate
} from 'graphql';
import { PrismaClient } from '@prisma/client';
import depthLimit from 'graphql-depth-limit';

export const prisma = new PrismaClient();
const gqlSchema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      const validation = validate(gqlSchema, parse(query), [depthLimit(5)]);
      if (validation.length > 0) {
        return { errors: validation };
      }

      return graphql({
        schema: gqlSchema,
        source: query,
        variableValues: variables,
        // contextValue
      })
    },
  });
};

export default plugin;
