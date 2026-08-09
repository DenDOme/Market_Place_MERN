import mongoose from "mongoose";
import request from "supertest"
import app from "../middleware/app.js";
import dotenv from "dotenv";

dotenv.config();

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL);
});

afterAll(async () => {
    await mongoose.connection.close();
})

describe("POST /users || Test for registering new user", () => {
    
    afterEach(async () => {
        await mongoose.connection.collection("users").deleteMany({ email: "testing-user@gmail.com" });
    });

    const data = {
      fullName: "testing_user",
      email: "testing-user@gmail.com",
      password: "Test12345",
    };
  
    it("should register new user", async () => {
      const res = await request(app)
        .post("/auth-service/auth/users")
        .send(data)
        .expect("Content-type", /json/)
        .expect(201);
  
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'][0]).toMatch(/jwt=/);
      expect(res.body.fullName).toBe(data.fullName);
      expect(res.body.email).toBe(data.email);
    });
  
    it("User with same data shouldn't register", async () => {
      await request(app).post("/auth-service/auth/users").send(data);
  
      const res = await request(app)
        .post("/auth-service/auth/users")
        .send(data)
        .expect("Content-type", /json/)
        .expect(400);
  
      expect(res.body.message).toBe("User already exists");
    });

    it("should reject registration with missing fields", async () => {
        const res = await request(app)
          .post("/auth-service/auth/users")
          .send({ email: "testing-user@gmail.com", password: "Test12345" })
          .expect(400);
      
        expect(res.body.message).toBeDefined();
    });

    it("should not return the password in the response", async () => {
        const res = await request(app)
          .post("/auth-service/auth/users")
          .send({ fullName: "safe_user", email: "testing-user@gmail.com", password: "Test12345" })
          .expect(201);
      
        expect(res.body.password).toBeUndefined();
    });
});

describe("POST /sessions || authorize and authenticate users", () => {

    const data = {
        email: "safe@gmail.com",
        password: "Test12345"
    }

    it("should login user", async () => {
        const res = await request(app)
            .post("/auth-service/auth/sessions")
            .send(data)
            .expect(200);

        expect(res.headers['set-cookie']).toBeDefined();
        expect(res.headers['set-cookie'][0]).toMatch(/jwt=/);
        expect(res.body.fullName).toBe("safe_user");
        expect(res.body.email).toBe(data.email);
    });

    it("shouldn't login user with wrong password", async () => {
        const res = await request(app)
            .post("/auth-service/auth/sessions")
            .send({email: data.email, password: "Test123456"})
            .expect(401);

        expect(res.body.message).toBeDefined();
    })

    it("shouldn't login user with wrong password", async () => {
        const res = await request(app)
            .post("/auth-service/auth/sessions")
            .send({email: "safe", password: "Test12345"})
            .expect(401);

        expect(res.body.message).toBeDefined();
    })
})

describe("DELETE /sessions || logout from user", () => {

    let cookie;

    beforeEach(async () => {
        const data = {
            email: "safe@gmail.com",
            password: "Test12345"
        };

        const res = await request(app)
            .post("/auth-service/auth/sessions")
            .send(data);

        cookie = res.headers['set-cookie'];
    });

    it("should logout user and clear cookies", async () => {
        const res = await request(app)
            .delete("/auth-service/auth/sessions")
            .set("Cookie", cookie)
            .expect(200)

        expect(res.headers[set-cookies][0]).toMatch(/jwt=;/)
    })

    it("shouldn't logout user and clear cookies", async () => {
        const res = await request(app)
            .delete("/auth-service/auth/sessions")
            .expect(401)

        expect(res.body.message).toBeDefined()
    })

})