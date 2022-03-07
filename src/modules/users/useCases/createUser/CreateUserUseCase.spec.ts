import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User UseCase", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    });

    expect(user).toHaveProperty("id");
  });
  it("should not be able to create a new user with an existent email", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456"
      });

      const user2 = await createUserUseCase.execute({
        name: "John Doe2",
        email: "johndoe@exampl1e.com",
        password: "123456"
      });
     }).rejects.toBeInstanceOf(CreateUserError)
  });
});
