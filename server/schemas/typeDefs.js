const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    bookCount: Int
    saveBooks: [Book]
  }
type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String 
}

type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    me: User

  

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(): User
    removeBook(bookId: ID!): User
  }

`;

module.export = typeDefs