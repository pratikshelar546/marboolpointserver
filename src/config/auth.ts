import JwtPassport from "passport-jwt";
import { client } from "./db";
import { PassportStatic } from "passport";

const JWTStrategy = JwtPassport.Strategy;
const ExtractJwt = JwtPassport.ExtractJwt;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "MARBOL_ADMIN",
};
const findAdmin = "SELECT * FROM admin WHERE admin_id = $1 ";
const findSeller = "SELECT * FROM seller WHERE seller_id = $1 ";

export default (passport: PassportStatic) => {
  passport.use(
    new JWTStrategy(options, async (jwt__payload, done) => {
      try {
        let findQurey = "";
        if (jwt__payload.role === "admin") {
          findQurey = findAdmin;
        } else if (jwt__payload.role === "seller") {
          findQurey = findSeller;
        } else {
          return done(null, false);
        }
        const find = await client.query(findQurey, [jwt__payload.user]);
        const doesUserExist = find.rows[0];
        // const doesUserExist = await UserModel.findById(jwt__payload.user) || await AdminModel.findById(jwt__payload.admin);
        // const doesUserExist =  await AdminModel.findById(jwt__payload.admin);

        if (!doesUserExist) return done(null, false);

        return done(null, doesUserExist);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};
