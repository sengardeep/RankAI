import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const token = authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({ message: "Not authorized" });
        };
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user={ id: decoded.id };
        req.userId = decoded.id;
        next();
    }
    catch(error){
        console.log(error);
        res.status(401).json({ message: "Not authorized" });
    }
}
export default authMiddleware;