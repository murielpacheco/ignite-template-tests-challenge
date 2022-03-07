import { ICreateUserDTO } from './../createUser/ICreateUserDTO';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { ShowUserProfileError } from './ShowUserProfileError';

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show Profile User Use Case", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to show user's profile", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456"
    });

    await showUserProfileUseCase.execute(user.id as string)

    expect(inMemoryUsersRepository.findById(user.id as string)).resolves.toBeTruthy();
  })
  it("should not be able to show a profile from a non-existent user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("fakeUserId")
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
