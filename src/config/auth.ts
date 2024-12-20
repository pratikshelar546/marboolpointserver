import JwtPassport from "passport-jwt";
import { client } from "./db";
import { PassportStatic } from "passport";

const JWTStrategy = JwtPassport.Strategy;
const ExtractJwt = JwtPassport.ExtractJwt;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "MARBOL_ADMIN",
};
const findAdmin = "SELECT * FROM admin WHERE admin_id = $1 RETURNING admin_id";
const findSeller = "SELECT * FROM admin WHERE admin_id = $1 RETURNING admin_id";

export default (passport: PassportStatic) => {
  passport.use(
    new JWTStrategy(options, async (jwt__payload, done) => {
      try {
        const find =
          (await client.query(findAdmin, [jwt__payload.user])) ||
          (await client.query(findSeller, [jwt__payload.user]));
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
