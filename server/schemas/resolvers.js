const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
     getSingleUser: async (_, { user = null, params }) => {
              try {
                const foundUser = await User.findOne({
                  $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
                });
        
                if (!foundUser) {
                  throw new Error('Cannot find a user with this id or username');
                }
        
                return foundUser;
              } catch (error) {
                throw new Error(error.message);
              }
            }
        
    },

    Mutation: {
       addUser: async (parent, args) => {
        console.log(args)
            const user = await User.create(args);
            console.log(user)
            const token = signToken(user);
            return { token, user };
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('No user found with this email address');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const token = signToken(user);
      
            return { token, user };
          },

        saveBook: async (parent, { _id, bookTitle, bookAuthor }, context) => {
            return  User.findOneAndUpdate(
                { _id: _id},
                {
                  $addToSet: { savedBooks: { bookTitle, bookAuthor } },
                },
                {
                  new: true,
                  runValidators: true,
                }
              );
        },

        deleteBook: async (parent, { _id, bookId }, context) => {
            return User.findOneAndUpdate(
              { _id: _id },
              { $pull: { savedBooks: { bookId: bookId } } },
              { new: true }
            );
          },
    }

}

module.export = resolvers