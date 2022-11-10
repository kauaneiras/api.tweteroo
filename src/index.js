import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const tweets = [];

app.post("/sign-up", (req, res) => {
    const {username, avatar} = req.body;
    if (!username || !avatar) {
        res.status(400).send({error:"Todos os campos são obrigatorios" });
        return;
    }

    const userExists = users.find(user => user.username === username);

    if (userExists) {
        res.status(400).send({error:"Usuário já existe" });
        return;
    }
    users.push({ username, avatar });
    res.status(201).send({message:"Usuário criado com sucesso" });
});

app.post("/tweets", (req, res) => {
    const  { user } = req.headers;
    const { tweet } = req.body;

    if(!user){
        res.status(400).send({error:"Evie o username" });
        return;
    }
    if (!tweet) {
        res.status(400).send({error:"Envie um tweet!" });
        return;
    }

    tweets.push({ username: user, tweet: tweet});
});


app.get("/tweets", (req, res) => {
    const {page} = req.query;

    if (page && page < 1){
        res.status(400).send({error:"Pagina inválida" });
        return;
    }

    const limit = 10;
    const start = (page - 1) * limit;
    const end = page*limit;

    tweets.forEach((tweet) => {
        const {avatar} = users.find(user => user.username === tweet.username);
        tweet.avatar = avatar;
    });

    if (tweets.length <= 10) {
        res.send(tweets.reverse());
        return;
    }
    res.send(tweets.reverse().slice(start,end));
});

app.get("/tweets/:username", (req, res) => {
    const {username} = req.params;
    const tweetsFromUser = tweets.filter(tweet => tweet.username === username);
    res.send(tweetsFromUser.reverse());
});

app.listen(5000, () => {console.log("Server is running on port 5000")});