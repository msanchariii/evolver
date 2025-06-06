import dotenv from "dotenv";

dotenv.config();

const env = {
    auth: {
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    },
    db: {
        url: process.env.DATABASE_URL,
    },
};

export default env;
