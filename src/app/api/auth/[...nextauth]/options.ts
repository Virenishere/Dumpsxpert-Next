import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "../../lib/mongodb";
import User from "../../model/User";

export const authOptions:NextAuthOptions = {
providers:[
    CredentialsProvider({
        id:"credentials",
        name:"credentials",
         credentials: {
      email: { label: "email", type: "email", placeholder: "Enter email here" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials:any):Promise<any>{
await dbConnect()
try {
  const user =   await User.findOne({
        $or:[
            {email: credentials.identifier},
            {username: credentials.identifier}
        ]
    })
    if(!user){
        throw new Error('no user fount with this data')
    }
    if(!user.isVerified){
        throw new Error('please verify your account first')
    }
   const isPasswordCorrect =  await bcrypt.compare(credentials.password, user.password)
if (isPasswordCorrect) {
   return user
}
else {
            throw new Error('incorrect password')

}

} catch (error) {
    throw new Error(error)
}
    }
    })

],
callbacks: {
  async jwt({ token, user }) {
    // This runs during login
    if (user) {
      token.id = user.id;
      token.email = user.email;
      token.name = user.name;
    }
    return token;
  },

  async session({ session, token }) {
    // This attaches user data from token to session
    // if (token) {
    //   session.user.id = token.id;
    //   session.user.email = token.email;
    //   session.user.name = token.name;
    // }
    return session;
  }
},

pages:{
    signIn:"/login"
},
session:{
    strategy: "jwt"
},
secret: process.env.NEXTAUTH_SECRET
}