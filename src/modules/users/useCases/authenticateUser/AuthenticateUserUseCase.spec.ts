import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"


let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;


describe("Authentica User Use Case", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(result).toHaveProperty("token");
  })

  it("should not be able to authenticate a non-existing user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "fakeEmail@example.com",
        password: "incorretPassword"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("should not be able to authenticate an user with incorrect password", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456"
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorretPassword"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
