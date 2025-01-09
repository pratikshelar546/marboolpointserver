import JwtPassport from "passport-jwt";
import { client } from "./db";
import { PassportStatic } from "passport";
import { user } from '../commanTypes/types';

const JWTStrategy = JwtPassport.Strategy;
const ExtractJwt = JwtPassport.ExtractJwt;

interface Admin {
  admin_id: string;
  name: string;
}

interface Seller {
  seller_id: number;
  name: string;
}

type User = Admin | Seller;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "MARBOL_ADMIN",
};

const findAdmin = "SELECT admin_id, name FROM admin WHERE admin_id = $1";
const findSeller = "SELECT seller_id, name FROM seller WHERE seller_id = $1";

export default (passport: PassportStatic) => {
  passport.use(
    new JWTStrategy(options, async (jwt__payload, done) => {
      try {
        let findQuery = "";
        if (jwt__payload.role === "admin") {
          findQuery = findAdmin;

        } else if (jwt__payload.role === "seller") {
          findQuery = findSeller;
        } else {
          return done(null, false);
        }

        const find = await client.query(findQuery, [jwt__payload.user]);
        const doesUserExist = { role: jwt__payload.role, ...find.rows[0] as User | undefined };

        if (!doesUserExist) {
          return done(null, false);
        }

        // Type-safe access based on role
        if (
          (jwt__payload.role === "admin" && "admin_id" in doesUserExist) ||
          (jwt__payload.role === "seller" && "seller_id" in doesUserExist)
        ) {
          return done(null, doesUserExist);
        }

        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};
