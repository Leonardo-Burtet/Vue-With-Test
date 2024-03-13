import { render, screen, waitFor } from '@testing-library/vue'
import SignUp from './SignUp.vue'
import { describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
// import axios from 'axios'
import {setupServer} from 'msw/node'
import { HttpResponse, http } from 'msw'
// vi.mock('axios')
// const mockFetch = vi.fn();
// global.fetch = mockFetch;

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
      const user = userEvent.setup();
      render(SignUp)
      const passwordInput = screen.getByLabelText("Password")
      const passwordRepeatInput = screen.getByLabelText("Password Repeat")
      await user.type(passwordInput, 'P4ssword');
      await user.type(passwordRepeatInput, 'P4ssword');
      expect(screen.getByRole('button', { name: 'Sign Up'})).toBeEnabled()
    })

  // describe("when user submits form", () => {
  //   it('sends username, email, password to the backend', async () => {
  //     let requestBody;
  //     const server = setupServer(
  //       http.post('/api/v1/users', async ({request}) => {
  //         requestBody = request.body
  //         return HttpResponse.json({})
  //       })
  //     )
  //     server.listen()
  //     const user = userEvent.setup();
  //     render(SignUp)
  //     const usernameInput = screen.getByLabelText("Username")
  //     const emailInput = screen.getByLabelText("E-mail")
  //     const passwordInput = screen.getByLabelText("Password")
  //     const passwordRepeatInput = screen.getByLabelText("Password Repeat")
  //     await user.type(usernameInput, 'user1');
  //     await user.type(emailInput, 'user1@mail.com');
  //     await user.type(passwordInput, 'P4ssword');
  //     await user.type(passwordRepeatInput, 'P4ssword');
  //     const button = screen.getByRole('button', {name: "Sign Up"});
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
      // server.close()
  // })
    describe('when there is an ongoing api call', () => {
      it('does not allow clicking the button', async () => {
            let counter = 0
            const server = setupServer(
              http.post('/api/v1/users', () => {
                counter += 1;
                return HttpResponse.json({})
              })
            )
            server.listen()
            const user = userEvent.setup();
            render(SignUp)
            const usernameInput = screen.getByLabelText("Username")
            const emailInput = screen.getByLabelText("E-mail")
            const passwordInput = screen.getByLabelText("Password")
            const passwordRepeatInput = screen.getByLabelText("Password Repeat")
            await user.type(usernameInput, 'user1');
            await user.type(emailInput, 'user1@mail.com');
            await user.type(passwordInput, 'P4ssword');
            await user.type(passwordRepeatInput, 'P4ssword');
            const button = screen.getByRole('button', {name: "Sign Up"});
            await user.click(button)
            await user.click(button)
            await waitFor(() => {
              expect(counter).toBe(1)
            })
            server.close()
      })
    })
  })
})
 