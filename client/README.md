# welconme to kudos

# this project is already deployed live link

https://kudos-alpha-one.vercel.app/landing

# Tech stack used React , Node , MongoDb

# Clone project

https://github.com/Deepanshu-Raghuwanshi/Kudos.git

# Create env on root kudos

add this to env
PASSWORD = your mongodb cluster password

# Go to server js and change this From this URI 'kudos' before ? to you databse name

`mongodb+srv://dipanshuraghuwanshi:${DBPass}@cluster0.luqz6xt.mongodb.net/kudos?retryWrites=true&w=majority`;

# On root folder kudos BE setup is there

npm install

# Client filder is FE

cd client
npm install

# go back to root

cd ../
npm start

# Currently listed users

ayush
dipanshu
vinay

# Schema ER details

The Kudos application consists of three main schemas: User, Kudos, and Like. These schemas are connected to enable the functionality of giving, receiving, and liking kudos.

User Schema: Represents a user in the system with a name field. Users can give kudos to others and like kudos posts.

Kudos Schema: Tracks the kudos given by users. It contains:

givenBy: References the user who gave the kudos.
givenTo: References the user who received the kudos.
badge: Type of badge given (e.g., "helping_hand").
reason_for_kudos: Reason for giving kudos.
Like Schema: Tracks which users liked a kudos post. It links:

user: The user who liked the post.
kudo: The kudos post that was liked.
Relationships
User ↔ Kudos: A user can give kudos to another user (tracked through givenBy and givenTo).
User ↔ Like: A user can like a kudos post (tracked through user in the Like schema).
Kudos ↔ Like: A kudos post can have multiple likes (tracked through kudo in the Like schema).
These schemas allow users to interact by giving kudos and liking posts, with all actions being recorded and easily retrievable.
