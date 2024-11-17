
import {IUser} from './models/userModel'
declare global {
    namespace Express {
        interface Request {
            user?: IUser; // You can replace `any` with a more specific type based on your user structure
        }
    }
}
// import { JwtPayload } from 'jsonwebtoken';
//
// declare global {
//     namespace Express {
//         interface Request {
//             user?: JwtPayload | { _id: string }; // Define the type of `req.user`
//         }
//     }
// }
