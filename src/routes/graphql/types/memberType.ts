import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLFloat,
    GraphQLInt
} from "graphql";
import { MemberTypeIdGql } from "./memberTypeId.js";

export const MemberType: GraphQLObjectType = new GraphQLObjectType({
    name: "MemberType",
    fields: {
        id: { type: new GraphQLNonNull(MemberTypeIdGql) },
        discount: { type: new GraphQLNonNull(GraphQLFloat) },
        postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) }
    },
})