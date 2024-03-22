import { render, screen, waitFor } from '@testing-library/vue'
import SignUp from './SignUp.vue'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
// import axios from 'axios'
import {setupServer} from 'msw/node'
import { HttpResponse, http } from 'msw'
import axios from 'axios'
// vi.mock('axios')
// const mockFetch = vi.fn();
// global.fetch = mockFetch;

let requestBody;
let counter = 0
const server = setupServer(
  http.post('/api/v1/users', () => {
    counter += 1;
    return HttpResponse.json({message: 'User create success'})
  })
  
)

beforeEach(() => {
  counter = 0
  server.resetHandlers()
})

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

const setup = async () => {
  const user = userEvent.setup();
  const result = render(SignUp)
  const usernameInput = screen.getByLabelText("Username")
  const emailInput = screen.getByLabelText("E-mail")
  const passwordInput = screen.getByLabelText("Password")
  const passwordRepeatInput = screen.getByLabelText("Password Repeat")
  await user.type(usernameInput, 'user1');
  await user.type(emailInput, 'user1@mail.com');
  await user.type(passwordInput, 'P4ssword');
  await user.type(passwordRepeatInput, 'P4ssword');
  const button = screen.getByRole('button', {name: "Sign Up"});
  return {
    ...result,
    user,
    elements: {
      button
    }
  }
}

describe('SignUp', () => {
  it('has header', () => {
    render(SignUp)
    const header = screen.getByRole('heading', { name: 'Sign Up' })
    expect(header).toBeInTheDocument()
  })

  it('has username input', () => {
    // const {container} = render(SignUp)
    // expect(container.querySelector('input')).toBeInTheDocument()
    render(SignUp)
    expect(screen.queryByLabelText("Username")).toBeInTheDocument()
  }) 
  it('has email input', () => {
    render(SignUp)
    expect(screen.queryByLabelText("E-mail")).toBeInTheDocument()
  }) 
  it('has password input', () => {
    render(SignUp)
    expect(screen.queryByLabelText("Password")).toBeInTheDocument()
  }) 
  it('has password type for password input', () => {
    render(SignUp)
    expect(screen.queryByLabelText("Password")).toHaveAttribute('type', 'password')
  })
  it('has password repeat input', () => {
    render(SignUp)
    expect(screen.queryByLabelText("Password Repeat")).toBeInTheDocument()
  }) 
  it('has password type for password repeat input', () => {
    render(SignUp)
    expect(screen.queryByLabelText("Password Repeat")).toHaveAttribute('type', 'password')
  }) 
  it('has Sign Up button', () => {
    render(SignUp)
    const button = screen.getByRole('button', { name: 'Sign Up' })
    expect(button).toBeInTheDocument()
  })
  it('disables the button initially', () => {
    render(SignUp)
    const button = screen.getByRole('button', { name: 'Sign Up' })
    expect(button).toBeDisabled()
  })

  describe("when user sets same value for password inputs", () => {
    it('enables button', async () => {
      const {
        elements: { button }
      } = await setup()
      expect(button).toBeEnabled()
    })

  // describe("when user submits form", () => {
  //   it('sends username, email, password to the backend', async () => {
  //     let requestBody;
  //     const {user, elements: {button}} = await setup();
  //     await user.click(button)
      // await waitFor(() => {
      //   expect(requestBody).toEqual({
      //     username: 'user1',
      //     email: 'user1@mail.com',
      //     password: 'P4ssword' 
      //   })
      // })
      // expect(mockFetch).toHaveBeenCalledWith('/api/v1/users', {
      //   method: 'POST',
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({
      //     username: 'user1',
      //     email: 'user1@mail.com',
      //     password: 'P4ssword' 
      //   })
      // })
      // expect(axios.post).toHaveBeenCalledWith('/api/v1/users', {
        // username: 'user1',
        // email: 'user1@mail.com',
        // password: 'P4ssword' 
      // })
      //   })
  // })
    describe('when there is an ongoing api call', () => {
      it('does not allow clicking the button', async () => {
            const { user, elements: {button} } = await setup()
            await user.click(button)
            await user.click(button)
            await waitFor(() => {
              expect(counter).toBe(1)
            })
      })

      // it('displays spinner', async () => {
      //   server.use(
      //       http.post('/api/v1/users', async () => {
      //         await delay('infinite')
      //         return HttpResponse.json({})
      //       })            
      //   )
      //   const { user, elements: {button} } = await setup()
      //   await user.click(button)
      //   expect(screen.getByRole('status')).toBeInTheDocument()    
      // })

      it('does not display spinner', () => {
        render(SignUp)
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
      })

      describe('when response status 200 ok', () => {
        it('display messagem sucess', async () => {
          const { user, elements: {button} } = await setup()
          await user.click(button)
          const text = await screen.findByText('User create success')
          expect(text).toBeInTheDocument()
        })

        it('hides sign up form', async () => {
          const {
            user,
            elements: { button }
          } = await setup() 
          const form = screen.getByTestId("form-sign-up")
          await user.click(button)
          await waitFor(() => {
            expect(form).not.toBeInTheDocument()
          })
        })
      })

      describe('when response status 404', () => {
        it('display message unexpected', async () => {
          server.use(
            http.post('/api/v1/users', () => {
              return HttpResponse.error({})
            })            
          )
          const { user, elements: {button} } = await setup()
          await user.click(button)
          const text = await screen.findByText('Unexpected error occurred, please try again')
          expect(text).toBeInTheDocument()
        })

        it("hides spinner", async () => {
          server.use(
            http.post('/api/v1/users', () => {
              return HttpResponse.error({})
            })            
          )
          const { user, elements: {button} } = await setup()
          await user.click(button)
          await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument()
          })
        })
      })

      describe("when user submits again", () => {
        it("rides error when api request is progress", async () => {
          let processedFirstRequest = false
          server.use(
            http.post('/api/v1/users', () => {
              if(!processedFirstRequest) {
                return HttpResponse.error({})
              } else {
                return HttpResponse.json({})
              }
            })            
          )
          const { user, elements: {button} } = await setup()
          await user.click(button)
          const text = await screen.findByText('Unexpected error occurred, please try again')
          await user.click(button)
          await waitFor(() => {
            expect(text).not.toBeInTheDocument();
          })
        })
      })
    })
  })
}) 
 