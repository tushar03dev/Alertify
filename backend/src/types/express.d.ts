import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: { _id: string; email: string }; // Update this type to match your `req.user`
        }
    }
}
