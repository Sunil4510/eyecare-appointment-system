import { Router } from "express";
import { addNewDataToFile, generateUUID, getFileData, hashPassword } from "../utils";
import { User, UserRole } from "../types/shared";
import { logError, logInfo } from "../utils/logger";

const usersRouter = Router();

// Helper to remove sensitive password from user object
export function sanitizeUser(user: User): Omit<User, "password"> {
  const { password, ...safeUser } = user;
  return safeUser;
}

/************************ Authentication ****************************/

// Login endpoint
usersRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logError("Login attempt missing email or password", { email });
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  try {
    const users = getFileData("users") as User[];
    const normalizedEmail = String(email).trim().toLowerCase();
    
    // Hash the password for comparison, also accept if incoming password is already 64-char hex hash
    const hashedPassword = password.length === 64 && /^[0-9a-f]+$/i.test(password)
      ? password.toLowerCase()
      : hashPassword(password);

    const user = users.find(
      (u) =>
        u.email.toLowerCase() === normalizedEmail &&
        (u.password === hashedPassword || u.password === password)
    );

    if (!user) {
      logError("Failed login attempt for user", { email: normalizedEmail });
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    logInfo("User successfully authenticated", {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: "Login successful",
      user: sanitizeUser(user),
    });
  } catch (error: any) {
    logError("Login endpoint exception", { error: error?.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/************************ Provided Basic CRUD Endpoints ****************************/

// Get all users
usersRouter.get("/users", (req, res) => {
  try {
    let data = getFileData("users") as User[];
    const role = req.query.role as string;
    if (role) {
      data = data.filter((u) => u.role.toLowerCase() === role.toLowerCase());
    }
    const safeData = data.map(sanitizeUser);
    res.json(safeData);
  } catch (error: any) {
    logError("Failed to fetch users", { error: error?.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a user by ID
usersRouter.get("/user/:id", (req, res) => {
  try {
    const data = getFileData("users") as User[];
    const user = data.find((u: User) => u.id === req.params.id);
    if (user) {
      res.json(sanitizeUser(user));
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error: any) {
    logError("Failed to fetch user by ID", { userId: req.params.id, error: error?.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a user
usersRouter.post("/user", (req, res) => {
  const newUser = req.body;
  try {
    if (!newUser.email || !newUser.role) {
      res.status(400).json({ error: "Email and role are required" });
      return;
    }

    const users = getFileData("users") as User[];
    if (users.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase())) {
      res.status(400).json({ error: "A user with this email already exists" });
      return;
    }

    const createdUser: User = {
      id: newUser.id || generateUUID(),
      email: newUser.email,
      password: newUser.password ? hashPassword(newUser.password) : "",
      role: newUser.role as UserRole,
      first_name: newUser.first_name || "",
      last_name: newUser.last_name || "",
      phone_number: newUser.phone_number || "",
      birthday: newUser.birthday || "",
      optician_id: newUser.optician_id,
    };

    addNewDataToFile<User>("users", createdUser);
    logInfo("New user registered", { userId: createdUser.id, email: createdUser.email });

    res.status(201).json({
      message: "User added successfully",
      data: sanitizeUser(createdUser),
    });
  } catch (error: any) {
    logError("Failed to create user", { error: error?.message });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default usersRouter;

