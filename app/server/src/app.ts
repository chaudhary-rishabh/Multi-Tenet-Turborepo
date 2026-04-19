import express from "express";
import helmet from "helmet";
import { corsOptions } from "./config/cors";
import cors from "cors";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import cookieParser from 'cookie-parser'

const app = express();

app.use(helmet());

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(hpp());

app.use(mongoSanitize()) // noSql injection prevention

app.use(morgan('dev'))
export default app;