const { ApolloServer } = require ('apollo-server')
const mongoose = require('mongoose')
const gql =  require('graphql-tag')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers/auth')


try {
    mongoose.connect('mongodb://localhost:27017/graphqluser', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('Db Connected');
    
} catch (error) {
    console.log('Error ============')
    console.log(error);
    process.exit(1);
}




const server = new ApolloServer({
    typeDefs,
    resolvers
})


server.listen({ port : 5000}).then((res)=>{
    console.log(`Server running at ${res.url}`) 
})