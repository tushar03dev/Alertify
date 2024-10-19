
import {IUser} from './models/userModel'
declare global {
    namespace Express {
        interface Request {
            user?: IUser; // You can replace `any` with a more specific type based on your user structure
        }
    }
}
