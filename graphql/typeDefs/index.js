const { gql } = require('graphql-tag')


module.exports = gql`
    type User{
        id: ID!
        name: String!
        email: String!
        password: String!
        token: String!
    }

    type Query {  
        login(email: String! , password:String!) : User!
    }

    input CreateUserInput {
    name: String!
    email: String!
    password: String!
    }

    type Mutation {
        register(registerInput: CreateUserInput!): User
    }
    `