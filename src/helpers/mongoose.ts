import mongoose from "mongoose";

export const isMongoServerError = (err: unknown): err is mongoose.mongo.MongoServerError => {
    return (err as mongoose.mongo.MongoServerError)?.code !== undefined;
};
