import usersRouter from "./users.routes";
import { hashPassword } from "../utils";

function getHandler(method: string, path: string) {
  const layer = (usersRouter as any).stack.find(
    (l: any) => l.route && l.route.path === path && l.route.methods[method.toLowerCase()]
  );
  if (!layer) throw new Error(`Route handler not found for ${method} ${path}`);
  return layer.route.stack[0].handle;
}

function createMockRes() {
  return {
    statusCode: 200,
    body: undefined as any,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: any) {
      this.body = payload;
      return this;
    },
  };
}

describe("users.routes", () => {
  describe("POST /login", () => {
    const loginHandler = getHandler("POST", "/login");

    it("logs in successfully with patient credentials james@gmail.com", () => {
      const req = {
        body: { email: "james@gmail.com", password: "james" },
      } as any;
      const res = createMockRes();

      loginHandler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Login successful");
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe("james@gmail.com");
      expect(res.body.user.role).toBe("patient");
      expect(res.body.user.password).toBeUndefined();
    });

    it("logs in successfully with optician credentials mary@gmail.com", () => {
      const req = {
        body: { email: "mary@gmail.com", password: "mary" },
      } as any;
      const res = createMockRes();

      loginHandler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.user.email).toBe("mary@gmail.com");
      expect(res.body.user.role).toBe("optician");
      expect(res.body.user.optician_id).toBeDefined();
    });

    it("returns 401 for incorrect password", () => {
      const req = {
        body: { email: "james@gmail.com", password: "wrongpassword" },
      } as any;
      const res = createMockRes();

      loginHandler(req, res);

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Invalid email or password");
    });

    it("returns 400 when email or password is missing", () => {
      const req = {
        body: { email: "james@gmail.com" },
      } as any;
      const res = createMockRes();

      loginHandler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Email and password are required");
    });
  });

  describe("GET /users", () => {
    const getUsersHandler = getHandler("GET", "/users");

    it("returns all users sanitized", () => {
      const req = { query: {} } as any;
      const res = createMockRes();

      getUsersHandler(req, res);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].password).toBeUndefined();
    });

    it("filters users by role", () => {
      const req = { query: { role: "optician" } } as any;
      const res = createMockRes();

      getUsersHandler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.every((u: any) => u.role === "optician")).toBe(true);
    });
  });

  describe("GET /user/:id", () => {
    const getUserByIdHandler = getHandler("GET", "/user/:id");

    it("returns 404 for non-existent user", () => {
      const req = { params: { id: "non-existent-id" } } as any;
      const res = createMockRes();

      getUserByIdHandler(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("User not found");
    });
  });
});
