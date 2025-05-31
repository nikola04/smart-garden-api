import mongoose from "mongoose";

const connect = async (): Promise<void> => {
    const URI = process.env.MONGODB_URI;
    if (!URI)
        throw "MONGODB_URI is not defined in ENV";

    await mongoose
        .connect(URI)
        .catch((err) => {
            throw "MongoDB Not Connected: " + err;
        });
};

export default {
    connect
};
