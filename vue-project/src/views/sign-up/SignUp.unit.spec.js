vi.mock('axios')
import { render, screen } from '@testing-library/vue'
import SignUp from './SignUp.vue'
import { describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import axios from 'axios'

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
    describe('SignUp', () => {
        describe("when user submits form", () => {
            it('sends username, email, password to the backend', async () => {
              axios.post.mockResolvedValue({data: {}})  
              const {user, elements: {button}} = await setup()
                await user.click(button)
                expect(axios.post).toHaveBeenCalledWith('/api/v1/users', {
                    username: 'user1',
                    email: 'user1@mail.com',
                    password: 'P4ssword' 
                })
            })
        })
    }) 
})