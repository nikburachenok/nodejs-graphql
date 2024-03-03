import { GraphQLEnumType } from "graphql";
import { MemberTypeId } from "../../member-types/schemas.js";

export const MemberTypeIdGql = new GraphQLEnumType({
    name: "MemberTypeId",
    values: {
        [MemberTypeId.BASIC]: { value: MemberTypeId.BASIC },
        [MemberTypeId.BUSINESS]: { value: MemberTypeId.BUSINESS },
    },
});