import { verifyToken } from "@clerk/backend";

export const clerkAuthMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const { userId } = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY
    });
    req.userId = userId;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};
